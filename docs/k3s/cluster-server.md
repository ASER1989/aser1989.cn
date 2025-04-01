---
sidebar_position: 4
---
# K3s公网集群配置
## 概述
现有两台服务器，其中一台在阿里云，另一台在 腾讯云。使用k3s组建集群后pod能成功部署到Agent上，但不能正常访问。包括service或describe pod。由于云服务器有两个IP地址，一个公网IP一个私有主机IP。K3s自带ServiceLP默认使用私有主机IP。如果是单台服务器、局域网内多服务器或同云服务商这并没有什么问题。但公网服务器无法通过私有主机IP进行通信，导致容器无法正常访问。K3s以flannel作为CNI运行，Flannel是一种轻量级的三层网络组件，实现了Kubernetes的容器网络接口（CNI）。它通常被称为CNI插件，公网集群配置需要调整flannel启动参数，使用节点的外部IP地址作为Flannel流量的目标，而不是内部IP。

## 集群搭建
### 检查两台云服务器的网络连通
``` sh
ping <主节点IP>
```

``` sh
telnet <主节点IP> 6443
```

K3s 的默认端口是否开放（6443 是 API 端口），云服务器需要配置对应的安全组策略

### 主节点配置
修改K3s启动参数
```shell
vi /etc/systemd/system/k3s.service
```
按如下方式修改Service部分内容
```sh
[Service]
ExecStart=/usr/local/bin/k3s server --node-external-ip <主机公网IP>  --flannel-backend=wireguard-native --flannel-external-ip
```
重启服务
```shell
sudo systemctl daemon-reload
sudo systemctl restart k3s-agent
```
验证状态
``` sh
sudo systemctl status k3s
```

配置Agent前需先获取主节点的token，在主节点上执行，并记录token内容：
``` sh
sudo cat /var/lib/rancher/k3s/server/node-token
```

### Agent配置
安装k3s并修改启动配置。
```shell
vi /etc/systemd/system/k3s.service
```
按如下方式修改Service部分内容
``` sh
[Service]
ExecStart=/usr/local/bin/k3s agent --node-external-ip <Agent服务器公网IP>
```

重启服务
```
sudo systemctl daemon-reload
sudo systemctl restart k3s-agent
```

验证状态
``` sh
sudo systemctl status k3s-agent
```


### 校验
回到 **主节点** 查看节点是否成功加入集群：
``` sh
kubectl get nodes
```

## 注意事项
1、K3s安装文件中包含Server 和Agent两个应用，Server是主节点，Agent是工作节点。启动时需要指定不同的应用。    
2、确保两台服务器之间可以互相访问，特别是 K3s 需要的端口要打开：  

**主节点开放端口**

| 端口范围      | 服务                           |
|--------------|--------------------------------|
| 6443         | Kubernetes API server         |
| 2379-2380    | etcd（如果是高可用）          |
| 10250        | kubelet                        |
| 10251        | kube-scheduler                 |
| 10252        | kube-controller-manager       |

**工作节点开放端口**

| 端口范围      | 服务                  |
|--------------|-----------------------|
| 10250        | kubelet               |
| 30000-32767  | NodePort 服务范围     |

## 完整配置参考
**主节点配置**
```shell
[Unit]
Description=Lightweight Kubernetes
After=network.target

[Service]
ExecStart=/usr/local/bin/k3s server --node-external-ip <主节点公网IP> --flannel-backend=wireguard-native --flannel-external-ip
Restart=always
User=root

[Install]
WantedBy=multi-user.target
```

**Agent配置**
```shell
[Unit]
Description=K3s Agent
After=network-online.target
Wants=network-online.target

[Service]
Type=exec
# 替换 <server-ip> 和 <node-token>，保证它能连上主节点
Environment="K3S_URL=https://<server-ip>:6443"
Environment="K3S_TOKEN=<node-token>"
ExecStart=/usr/local/bin/k3s agent --node-external-ip <Agent公网IP>
Restart=always
RestartSec=5
LimitNOFILE=1048576
LimitNPROC=infinity
LimitCORE=infinity

[Install]
WantedBy=multi-user.target
```

## 参考资料
[Basic Network Options](https://docs.k3s.io/zh/networking/basic-network-options)    
[Distributed hybrid or multicloud cluster](https://docs.k3s.io/zh/networking/distributed-multicloud)
