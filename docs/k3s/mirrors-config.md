---
sidebar_position: 2
---
# K3s镜像源设置
K3s默认使用containerd作为容器运行时，如果服务器不能正常访问registry-1.docker.io，可以设置镜像源，以便拉取公共镜像。

:::warning[重要提示]
如果是K3s集群，需要在所有节点上设置镜像源。
::::

### 创建/修改 containerd 配置文件

``` sh
mkdir -p /etc/rancher/k3s
cat <<EOF | tee /etc/rancher/k3s/registries.yaml
mirrors:
  docker.io:
    endpoint:
      - "https://your.mirrors.com/"
EOF
```

### 确保 registries.yaml 配置正确
``` sh
cat /etc/rancher/k3s/registries.yaml
```

应该类似于：
``` yaml
mirrors:
  docker.io:
    endpoint:
      - "https://your.mirrors.com/"
```

### 确保 K3S_REGISTRIES_FILE 变量生效
如果 registries.yaml 仍然没有生效，检查 systemd 是否正确加载了配置：
``` sh
systemctl cat k3s | grep K3S_REGISTRIES_FILE
```

如果没有 Environment="K3S_REGISTRIES_FILE=/etc/rancher/k3s/registries.yaml”，就手动添加：
``` sh
mkdir -p /etc/systemd/system/k3s.service.d
cat <<EOF | tee /etc/systemd/system/k3s.service.d/override.conf
[Service]
Environment="K3S_REGISTRIES_FILE=/etc/rancher/k3s/registries.yaml"
EOF
```

然后重新加载 systemd 配置：
``` sh
systemctl daemon-reload
systemctl restart k3s
```

### 检查 containerd 是否生效
确认 containerd 是否正确加载了 registries.yaml：
``` sh
k3s ctr --debug mirrors list
```

<font color="#777">如果 docker.io 没有使用 https://your.mirrors.com/ 作为镜像源，说明 containerd 仍然没有正确解析 registries.yaml。</font>

手动拉取一个测试镜像：
``` sh
k3s crictl pull nginx
```

检查镜像是否成功拉取：
``` sh
k3s crictl images | grep nginx
```

如果拉取失败，查看 k3s 的日志：

``` sh
journalctl -u k3s -f
```
### 特别说明
如果是K3s集群，需要在所有节点上设置镜像源。
