---
sidebar_position: 3
---

# K3S测试应用部署
在 K3s 集群中创建一个简单的应用，比如一个 Nginx 服务器，并通过 IP 访问它。

### 1. 部署一个 Nginx 应用
创建一个 nginx-deployment.yaml 文件：
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
```

应用部署：
```sh
kubectl apply -f nginx-deployment.yaml
```

### 创建 Service 以暴露应用
创建 nginx-service.yaml 文件，K3s 自带的 klipper-lb（基于 Traefik），可以直接创建一个 LoadBalancer 类型的服务：
``` yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  type: LoadBalancer
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
```

应用：
```sh
kubectl apply -f nginx-service.yaml
```

### 获取IP地址

``` sh
kubectl get svc nginx-service
```
查看 EXTERNAL-IP，然后访问该 IP。
```
http://<EXTERNAL-IP>
```

### 常用命令

查看pod状态
```sh
kubectl get pods
```

查看pod日志
```shell
kubectl logs <pod-name>
```

查看pod详细信息
```ssh
kubectl describe pod <pod-name>
```
  
K3s执行日志
``` sh
journalctl -u k3s -f

```


### 附
Pod 常见状态解析

| 状态 | 说明 |
|------|------|
| **Pending** | Pod 已创建，但至少有一个容器还没启动（可能是镜像未拉取、调度问题等）。 |
| **ContainerCreating** | Pod 正在创建容器，通常是镜像下载中或容器准备中。 |
| **Running** | Pod 及其中所有容器都已正常运行。 |
| **Completed** | Pod 运行完成（通常是 Job 类型的 Pod）。 |
| **CrashLoopBackOff** | Pod 不断崩溃并重启（可能是应用错误或配置错误）。 |
| **ImagePullBackOff** | 无法拉取镜像（可能是网络问题或镜像不存在）。 |
| **ErrImagePull** | 拉取镜像失败（一般是认证失败或镜像不存在）。 |
| **CreateContainerConfigError** | 容器创建失败，通常是环境变量、资源请求等配置错误。 |
| **OOMKilled** | 容器因为 **内存不足（Out Of Memory, OOM）** 而被终止。 |
| **Evicted** | Pod 被 **驱逐**（可能是因为节点资源不足）。 |
| **Terminating** | Pod 正在删除（可能因 `kubectl delete pod` 或 **节点重启**）。 |
| **NodeLost** | 节点丢失，导致 Pod 无法访问。 |
