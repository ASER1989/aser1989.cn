---
sidebar_position: 1
---

# K3s独立安装
国内不能流畅访问github。安装k3s可以先手动下载程序，再上传到服务器。
访问 K3s 官方 GitHub Releases 页面，找到适合你的系统架构的 K3s 版本。或在github的仓库中release页面下载对应版本的对应架构的K3s版本。
```
https://github.com/k3s-io/k3s/releases/latest/download/k3s
```

## 安装
``` sh 
scp k3s root@ip:/usr/local/bin/
```

```sh
sudo chmod +x /usr/local/bin/k3s
```


创建 systemd 服务:

``` sh
cat <<EOF | sudo tee /etc/systemd/system/k3s.service
[Unit]
Description=Lightweight Kubernetes
After=network.target

[Service]
ExecStart=/usr/local/bin/k3s server
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF
```

``` sh
sudo systemctl daemon-reload
sudo systemctl enable k3s
sudo systemctl start k3s
```


## 全局下使用 kubectl

检查一下：
``` sh
which kubectl
```

如果输出是 /usr/local/bin/kubectl，说明已经有了。
如果没有，那就手动创建个软链接：
``` sh
sudo ln -sf /usr/local/bin/k3s /usr/local/bin/kubectl
```



**配置 KUBECONFIG**  
K3s 的 kubeconfig 文件默认在 /etc/rancher/k3s/k3s.yaml。
让 kubectl 直接使用它：
``` sh
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
```

为了永久生效，把它加到 `~/.bashrc`、`~/.zshrc` 或 `/etc/profile` 里：
``` sh
echo 'export KUBECONFIG=/etc/rancher/k3s/k3s.yaml' >> ~/.bashrc
source ~/.bashrc
```

如果你用的是 Zsh：
``` sh
echo 'export KUBECONFIG=/etc/rancher/k3s/k3s.yaml' >> ~/.zshrc
source ~/.zshrc
```

**检查效果**

``` sh
kubectl get nodes
```
如果看到类似下面的输出，说明安装成功：
| NAME |  STATUS | ROLES  | AGE | VERSION |
| ---- | ------- | ------ | ---| -------|
| izbp1axh-ecs-e099 | Ready | master | 1m | v1.31.6+k3s1|
