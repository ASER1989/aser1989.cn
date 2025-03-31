---
sidebar_position: 1
---

# K3s 简介
K3s 是轻量级的、一个完全兼容的 Kubernetes 发行版。K3s 易于安装，仅需要 Kubernetes 内存的一半，所有组件都在一个小于 100 MB 的二进制文件中（～70MB）。官方说希望安装的 Kubernetes 只占用一半的内存。Kubernetes 是一个 10 个字母的单词，他们只用5个，所以叫K3s。很轻，适合2核2GB的云服务器装着玩。虽然程序只有～70MB，但实际上包含Server和Agent两个应用（同Master-Slave）。不仅如此，K3s 打包了所需的依赖，包括containerd、Flannel、Traefik、ServiceLB等等。

### 安装K3s所需的硬件条件
官方给出最低硬件要求是1核512MB，推荐配置是2核1GB。

### 应用访问
通常情况下一个应用程序部署后应该包括Pod、Service。Pod是应用的实例，Service是应用的访问入口。Service有三种类型： ClusterIP 、NodePort 、LoadBalancer。
+ ClusterIP是集群内部访问；
+ NodePort是集群外部直接通过Pod所在主机IP+端口访问；
+ LoadBalancer是使用负载均衡模式，应用可以通过负载均衡上的任意EXTERNAL-IP+端口进行访问。

K3s自带的ServiceLB就是一个负载均衡器，当Service类型是LoadBalancer时，K3s会使用ServiceLB实现负载均衡。需要注意的是使用ServiceLB时不同Service中端口不能重复，重复的端口会导致Service无法获取到IP。

综上所述当Service类型是NodePort和LoadBalancer时应用已经可以通过IP+端口的方式被外部访问，如果需要通过域名访问，可以使用Ingress。Ingress是Kubernetes中的一种资源对象，它是一个API对象，定义了从外部到集群内Service的HTTP和HTTPS路由规则，K3s默认使用Traefik作为 Ingress Controller。


### Helm
Helm是Kubernetes的包管理工具。Helm Chart为Kubernetes YAML清单文件提供了模板语法。借助Helm，开发人员或集群管理员可以创建称为Chart的可配置模板，而不仅仅是使用静态清单。K3s不需要使用任何特殊配置来支持Helm。K3s包含一个Helm Controller，它使用HelmChart自定义资源定义(CRD)来管理Helm Chart的安装、升级、重新配置和卸载。与自动部署AddOn清单配合使用后，它可以在磁盘上创建单个文件，自动在集群上安装Helm Chart。

### Traefik
Traefik是一个开源的反向代理和负载均衡工具,它强大的地方在于Traefik使用服务发现来动态配置路由，且单个服务配置的启停不会影响其他服务（与之对应的像Nginx reload）。Traefik还支持SSL终止，并与ACME提供程序（如Let’s Encrypt）一起自动生成证书。K3s默认使用Traefik作为 Ingress Controller。

### Local Path Provisioner
Local Path Provisioner是Rancher开发的一种动态存储供应器（Storage Provisioner），用于在K3s或其他Kubernetes集群中提供基于本地存储的动态持久化卷（Persistent Volume, PV）。
在传统Kubernetes中，使用hostPath类型的存储通常需要手动创建PersistentVolume，而Local Path Provisioner提供了一种更简单的方式，使每个节点的本地存储，能够自动创建PersistentVolumeClaim（PVC），并动态分配存储路径。K3s自带Local Path Provisioner。




---

参考：
[K3s官方文档](https://docs.k3s.io/zh/)
