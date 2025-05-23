---
slug: 20250410
title: 短信接口被刷爆：我用Nginx临时止血
authors: [xu]
tags: [Frontend]
date: 2025-04-10 11:12
hide_table_of_contents: false
description: 朋友公司 App 的短信验证码接口被黑产盯上，遭遇大规模盗刷，充值秒光，损失严重。作为非技术团队，无法改动源码，我通过分析 Nginx 日志、利用 OpenResty 和请求头识别，成功用 Nginx 拦截了恶意请求，并实现“以假乱真”的防御效果。
---
最近，朋友公司遇到了一件让他们“寝食难安”的事：他们的短信验证码接口被人盯上了，充进去的钱没多久就被刷得一分不剩。不充钱，业务直接受影响；但充钱吧，就像往无底洞里灌水。他们联系短信服务商，对方反馈说可能是“被恶意盗刷”。由于他们没自己的IT团队，App是找外包做的，现在处于无人维护状态。老板希望在不改代码的前提下想个办法帮忙止血。

<!-- truncate -->

## 断症：不是Bug，而是接口在裸奔
这个App已经稳定运行了两年左右，程序 bug 的可能性比较小。我们怀疑是短信平台信息泄露，或者接口被恶意程序利用。我上服务器看了下，他们部署非常简单：前端用 Nginx 直接代理后端 Java 服务。打开 Nginx 日志发现有人以每秒3-6次的频率请求获取短信验证码的URL。并且接口调用未做二次验证，这就等于把“发验证码”的权限完全开放了。哎！机会就这样留给了别有用心的人。

## 亡羊补牢
这种情况，不改代码确实有点难搞。从Nginx日志上可以看到，攻击者使用了大量代理IP，每次请求的IP和参数都在变化，所以没办法通过IP黑名单的方式解决问题。我们只能寄希望于App在请求接口的时携带了攻击者不具备的标识。由于Nginx无法直接打印完整请求头，所以考虑用OpenResty通过Lua脚步把所有的请求头内容输出到日志里（这个接口是Get请求）。又只能在夜深人静的时候加班学习，好在以前了解过一点OpenResty的知识。

### 分析请求头
先折腾了一个简单脚本来分析请求头，要是这一关过不了，那基本可以放弃这个思路了。
``` 
location /api/reg/getCode {
    content_by_lua_block {
        for k, v in pairs(ngx.req.get_headers()) do
            ngx.say(k, ": ", v)
        end
    }
}
```
经过一番分析，发现App在每个请求上都带上了一个版本号信息（虽然还在1.0.0），好在正好可以用来区分是否为恶意请求。

### 基于请求头做验证
接下来，就是利用 Nginx 的 map 指令判断请求头中是否包含指定版本号字段。命中放行，没命中就拦下。
代码如下：
```
http {
    map $http_app_version $allow {
        default 0;
        "~*xxx_1.0.0" 1;
    }

    server {
        listen 80;
        server_name xxx.xxx.com;

        location /api/reg/getCode {
            if ($allow = 0) {
                return 403;
            }

            proxy_pass http://java_service;
        }
    }
}
```
部署上去后看了下 Java 的日志，接口盗刷的请求直接被干掉，效果显著。

### 以假乱真
虽然拦截成功，但返回403会暴露我们的防御策略，容易引起对手的注意，分分钟就能突破这道薄弱的屏障。于是做了个升级：在nginx拦截到请求后，直接返回请求成功的响应结果，从此以后双方都可以保持“成功”的假象。

改动如下：
```
location /api/reg/getCode {
    if ($allow = 0) {
        add_header Content-Type application/json;
        return 200 '{"code":"200","message":"验证码发送成功","success":true}';
    }

    proxy_pass http://java_service;
}

```
经测试，妥妥的，在不看日志的情况下，根本看不出到底有没有真的请求到 Java 服务。

## 总结
一直不太能理解，这种攻击到底图个啥。既没带来直接利益，还要花成本搞代理搞脚本，这不是典型的损人不利己吗。在之后的几天里，一切又恢复到了往日的宁静。虽然事情已经告一段落，但临时止血不是长久之计，解决这类问题还是需加强程序安全验证，提升攻击难度。

## 最后
关于OpenResty，可以翻阅我的[OpenResty](https://www.aser1989.cn/docs/others/open-resty)学习笔记，欢迎点赞支持。

---

Posted on [Aser1989’s](https://www.cnblogs.com/aser1989) cnblogs on April 10, 2025
