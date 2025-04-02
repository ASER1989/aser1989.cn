---
sidebar_position: 2
---
# 启用压缩和缓存

## 简介
启用内容压缩和缓存可以减少网络流量和响应时间。针对某些网站没有在打包时生成对应的压缩文件，或服务上没有开启内容缓存，这种情况下如果需要开启压缩和缓存可以通过`Traefik`中间件来实现。

## 压缩
创建中间间配置文件`compress.yaml`：
```yaml
apiVersion: traefik.containo.us/v1alpha1
kind: Middleware
metadata:
  name: compress-middleware
  namespace: default
spec:
  compress: {}
```
应用配置：
```sh
kubectl apply -f compress.yaml
```

以Ingress-Route为例，在配置中添加中间件使用：
```yaml
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: <your ingress name>
  namespace: default
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-production
spec:
  entryPoints:
    - web
    - websecure
  routes:
    - match: Host(`<your host name>`)
      kind: Rule
      services:
        - name: <your service name>
          port: 80
      middlewares:
        - name: compress-middleware # 添加中间件
  tls:
    secretName: <your cert name>
```


## 缓存
创建中间件配置文件`cache.yaml`：

```yaml
apiVersion: traefik.containo.us/v1alpha1
kind: Middleware
metadata:
  name: cache-control
  namespace: default
spec:
  headers:
    customResponseHeaders:
      Cache-Control: "public, max-age=36000"  # 设置缓存策略
```
应用配置：
```sh
kubectl apply -f cache.yaml
```

以Ingress-Route为例，在配置中添加中间件使用：
```yaml
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: <your ingress name>
  namespace: default
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-production
spec:
  entryPoints:
    - web
    - websecure
  routes:
    - match: Host(`<your host name>`)
      kind: Rule
      services:
        - name: <your service name>
          port: 80
      middlewares:
        - name: compress-middleware
        - name: cache-control #添加cache中间件
  tls:
    secretName: <your cert name>
```

## 参考资料
[1 . Traefik Middlewares](https://doc.traefik.io/traefik/middlewares/overview/)
