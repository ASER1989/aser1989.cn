---
sidebar_position: 5
---

# K3s 中 ConfigMap 使用
ConfigMap 用于保存非敏感配置（如参数、开关、配置文件），让配置和镜像解耦。

## 1. 创建 ConfigMap
### 使用 YAML（也可以通过命令行创建）
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_NAME: "demo-app"
  APP_ENV: "prod"
  nginx.conf: |
    server {
      listen 80;
      server_name _;
      location / {
        return 200 "ok";
      }
    }
```

应用配置：
```sh
kubectl apply -f app-config.yaml
```

## 在 Pod 中使用 ConfigMap
### 方式一：作为环境变量
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-env-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app-env-demo
  template:
    metadata:
      labels:
        app: app-env-demo
    spec:
      containers:
        - name: app
          image: nginx:latest
          envFrom:
            - configMapRef:
                name: app-config
```

### 方式二：作为文件挂载
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-volume-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app-volume-demo
  template:
    metadata:
      labels:
        app: app-volume-demo
    spec:
      containers:
        - name: app
          image: nginx:latest
          volumeMounts:
            - name: config-volume
              mountPath: /etc/config
      volumes:
        - name: config-volume
          configMap:
            name: app-config
```

## 更新与生效
更新 ConfigMap：
```sh
kubectl edit configmap app-config
```

常见生效规则：
- 以环境变量注入时：通常需要重建 Pod（如滚动重启 Deployment）
- 以文件挂载时：配置文件会自动刷新（有短暂延迟）

滚动重启示例：
```sh
kubectl rollout restart deployment app-env-demo
```

## 常用排查命令
查看 ConfigMap：
```sh
kubectl get configmap
kubectl describe configmap app-config
kubectl get configmap app-config -o yaml
```

查看 Pod 是否读到配置：
```sh
kubectl exec -it <pod-name> -- env | grep APP_
kubectl exec -it <pod-name> -- ls /etc/config
kubectl exec -it <pod-name> -- cat /etc/config/nginx.conf
```

## 注意事项
- ConfigMap 不适合存放密码、Token 等敏感信息（请使用 Secret）
- 单个 ConfigMap 建议保持小而清晰，按应用或模块拆分
- 修改配置前先备份原内容，避免误改影响线上服务
