---
sidebar_position: 2
---
## 安装
在服务器上运行以下命令来安装Argo CD：
```shell

kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

```
安装配置清单中包含的ClusterRoleBinding资源引用了`argocd`名称空间。 如果要将Argo CD安装到不同的名称空间，请确保更新名称空间引用。

## 创建Ingress
```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: argocd-ingress
  namespace: argocd
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-production # 注意这里使用了lets encrypt的证书
    kubernetes.io/ingress.class: traefik
spec:
  tls:
    - hosts:
        - <your-domain>
      secretName: <your-cert>  # 给证书起个名字，绑定TLS证书（由 cert-manager 创建）
  rules:
    - host: <your-domain>
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: argocd-server
                port:
                  number: 80  # 代理到 argocd-server 的 80 端口
```
应用ingress
```shell
kubectl apply -f ingress.yaml
```
## 问题
通常这个时候还不能正常访问，因为argocd默认使用了自签名证书，并强制通过https进行访问，这个时候直接访问极大可能会出现无限重定向。Argo CD官方文档中有详细的介绍证书相关的[文档](https://argo-cd.readthedocs.io/en/stable/operator-manual/tls/)。这里重点介绍--insecure（完全禁用 TLS）选项，因为Ingress上已经配置了证书，所以这里直接使用`--insecure`选项即可。

### 修改Argo CD配置
```shell
kubectl edit configmap argocd-cmd-params-cm -n argocd -o yaml
```

在配置文件中添加
```yaml
data：
  server.insecure: "true"

```

完整内容如下：
```yaml
apiVersion: v1
data:
  server.insecure: "true"
kind: ConfigMap
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","kind":"ConfigMap","metadata":{"annotations":{},"labels":{"app.kubernetes.io/name":"argocd-cmd-params-cm","app.kubernetes.io/part-of":"argocd"},"name":"ar
  creationTimestamp: "2025-03-21T08:20:18Z"
  labels:
    app.kubernetes.io/name: argocd-cmd-params-cm
    app.kubernetes.io/part-of: argocd
  name: argocd-cmd-params-cm
  namespace: argocd
  resourceVersion: "282649"
  uid: e28d7e71-63f8-4232-9e7e-78f1bdbc3c5e
```

### 重启Argo CD
```shell
kubectl rollout restart deployment argocd-server -n argocd
```
### 校验
通过浏览器重新尝试访问argo CD，检查重定向问题是否已经解决。

## 登录
访问Argo CD的登录页面，使用默认用户名`admin`和密码`admin`进行登录。登陆前通过以下命令在服务器上查看初始密码：
``` sh
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo
```

## 参考资料
[官方文档](https://argo-cd.readthedocs.io/en/stable/)
