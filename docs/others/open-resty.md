---
sidebar_position: 2
---
# OpenResty

**OpenResty** 是一个基于 Nginx 的 Web 应用服务器，它将强大的 Nginx 与 LuaJIT 脚本语言深度整合，让你能在 Nginx 中运行 Lua 脚本，实现传统 Web 服务器做不到的灵活逻辑控制。

它可以看作是：

OpenResty = Nginx + LuaJIT + 一堆高性能模块（如 Redis、MySQL、JSON、HTTP 等）

---

##  OpenResty 能干什么？

| 应用方向           | 功能示例                                                         |
|--------------------|------------------------------------------------------------------|
| 网关 / API 代理     | 参数校验、用户认证、签名校验、防刷机制                           |
| 动态路由控制       | 根据 cookie/header/ip 动态转发请求                                |
| 限流降级           | 根据用户、接口或 IP 实现精细化限流                                |
| 缓存机制           | Lua 脚本定制 Key、缓存命中策略，可接 Redis 或本地缓存             |
| 日志系统/埋点      | 实现按需收集请求数据，上报到 Kafka/ElasticSearch                 |
| 服务熔断、降级     | 检测后端服务状态，做降级处理或灰度发布                           |
| Web 防火墙（WAF） | 用 Lua 脚本实现动态规则的防火墙                                  |

---


## 安装 OpenResty（以 Ubuntu 为例）：

```bash
sudo apt update
sudo apt install -y curl gnupg2 ca-certificates lsb-release
curl -O https://openresty.org/package/pubkey.gpg
sudo apt-key add pubkey.gpg

echo "deb http://openresty.org/package/ubuntu $(lsb_release -sc) main" \
  | sudo tee /etc/apt/sources.list.d/openresty.list

sudo apt update
sudo apt install -y openresty
```
## 一个简单的 Lua 控制页面

**编辑配置文件：`/usr/local/openresty/nginx/conf/nginx.conf`**

```nginx
worker_processes  1;

events {
worker_connections  1024;
}

http {
server {
listen 8080;

        location /hello {
            content_by_lua_block {
                ngx.say("Hello from OpenResty!")
            }
        }
    }
}
```

---

## 启动 OpenResty

```bash
sudo /usr/local/openresty/bin/openresty -p `pwd` -c nginx.conf
```

访问：`http://localhost:8080/hello`，你会看到输出：

```bash
Hello from OpenResty!
```

---

## 进阶示例：使用 Redis 做访问频率限制

**配置片段：**

```nginx
http {
lua_shared_dict limit_store 10m;

    server {
        listen 8080;

        location /api {
            access_by_lua_block {
                local limit_req = require "resty.limit.req"

                local lim, err = limit_req.new("limit_store", 10, 20)
                if not lim then
                    ngx.log(ngx.ERR, "failed to instantiate limiter: ", err)
                    return ngx.exit(500)
                end

                local key = ngx.var.binary_remote_addr
                local delay, err = lim:incoming(key, true)
                if not delay then
                    return ngx.exit(429)
                end

                if delay >= 0.001 then
                    ngx.sleep(delay)
                end

                ngx.say("Welcome, your request is allowed!")
            }
        }
    }
}
```

---

## 常用 OpenResty Lua 模块
resty.* 是一系列由 OpenResty 团队开发的 Lua 模块，这些模块是专为高效处理 Web 服务、数据库、缓存、API 请求等功能而设计的，并且都与 OpenResty 或 Nginx 深度集成。它们通常是基于 OpenResty 提供的 lua-nginx-module 和其他 Nginx 模块实现的，能够在 Nginx 中运行 Lua 脚本。
这些模块具有高性能、低延迟、易用性等特点，常用于处理 Web 请求、管理缓存、进行限流、连接数据库等任务。

以下是一些常见的 resty.* 模块：

| 模块            | 功能                                                        |
|------------------|-----------------------------------------------------------|
| `resty.redis`     | 用于操作 Redis 数据库，支持高效的 Redis 操作                             |
| `resty.mysql`     | 用于与 MySQL 数据库进行交互，支持连接池、异步操作等功能，如：执行 SQL 查询、更新等           |
| `resty.http`      | 提供高性能的 HTTP 客户端，支持发起 HTTP 请求，如：发起 HTTP GET、POST 请求，支持异步操作 |
| `resty.core`      | 提供与 Nginx 相关的底层 API 和功能支持，用于执行高效的 Lua 脚本                  |
| `resty.limit.req` | 用于实现请求限流，防止 API 被滥用或过载，可用于限制单个用户请求的频率                     |
| `resty.jwt`       | 用于处理 JSON Web Token (JWT) 的解析、验证、生成等操作，用于解码和验证 JWT 实现用户认证 |
| `cjson`           | 用于处理 JSON 数据的编解码，JSON 编解码极快，比标准 Lua 的 json 库更高效           |

---
这些模块大大简化了开发者在 OpenResty 上的工作，提供了对常用功能的封装，使得在 Web 应用开发中更加灵活高效。

:::tip

- Lua 是单线程的，所有逻辑应尽量异步或非阻塞。
- 不建议执行长耗时逻辑（如读大文件、复杂循环）阻塞请求。
- 所有模块最好使用 OpenResty 提供的 `lua-resty-*` 系列，避免手写 socket 或连接池。
:::

## 参考资料
- [1 . OpenResty 官网](https://openresty.org/)
