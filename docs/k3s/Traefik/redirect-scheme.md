---
sidebar_position: 1
---

# 重定向中间件
`RedirectScheme`中间件会在请求的`Scheme`与配置的`Scheme`不同时，对请求进行重定向,将客户端重定向到不同的`Scheme/端口`。

## 中间件配置
### scheme重定向
以https重定向为例：
```yaml
# middleware-https-redirect.yaml
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: https-redirect
  namespace: default
spec:
  redirectScheme:
    scheme: https
    permanent: true
```

### 端口重定向：
```yaml
# middleware-https-redirect.yaml
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: test-redirectscheme
spec:
  redirectScheme:
    # ...
    port: "443"
```

### 参数解析
 | 参数          | 说明                                             | 
|-------------|------------------------------------------------| 
| scheme      | 重定向的目标scheme，如：scheme: https即将所有请求重定向到https协议  |
| permanent   | 是否使用301重定向，默认为false，即302重定向                    |
| port        | 重定向的目标端口，如：port: "443"即将所有请求重定向到443端口          |


## 创建中间件
```shell
kubectl apply -f middleware-https-redirect.yaml
```
## 应用中间件
以Ingress-Route为例，在配置中添加中间件使用：
```yaml
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: my-ingressroute
  namespace: default
spec:
  entryPoints:
    - web
  routes:
    - match: Host(`example.com`)
      kind: Rule
      middlewares:
        - name: https-redirect
      services:
        - name: my-service
          port: 80
---
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: my-ingressroute-https
  namespace: default
spec:
  entryPoints:
    - websecure
  routes:
    - match: Host(`example.com`)
      kind: Rule
      services:
        - name: my-service
          port: 80
  tls:
    secretName: my-tls-secret
```

## 参考资料
[ 1 . RedirectScheme Middleware](https://doc.traefik.io/traefik/middlewares/http/redirectscheme/)
