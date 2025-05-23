---
slug: k3s-ci-cd
title: 用99元买的服务器搭一套CI/CD系统
authors: [xu]
tags: [K3s]
description: 用99元买的服务器搭一套CI/CD系统
---
故事的开始是这样的：无聊的时候在阿里云买了一个99/年的服务，上面部署了一个Git服务，用于托管自己无聊时写的一些代码，顺便也拿它做开发服务器。为了方便应用管理，起初用docker来管理和部署应用，后来升级了一把，用上了docker-compose，毕竟跟手撕命令相比声明式部署更显科学，docker-compose对于依赖项目的管理更是深得我心。于是，这样和谐的过了很久，直到不久前无聊的时候在腾讯云上领了一个体验服务器，免费的。虽然是体验版，但不用起来谈何体验呢，思来想去感觉应该组个集群，顺便搞一套 CI/CD，这样做不仅能大幅提升编码幸福感，也能对K8s有个体面的认识。

<!-- truncate -->

## K3S
K3s 是轻量级的、一个完全兼容的 Kubernetes 发行版。K3s 易于安装，仅需要 Kubernetes 内存的一半，所有组件都在一个小于 100 MB 的二进制文件中（～70MB）。官方说希望安装的 Kubernetes 只占用一半的内存。Kubernetes 是一个 10 个字母的单词，他们只用5个，所以叫K3s。

K3s很轻，适合2核2GB的云服务器装着玩。虽然程序只有～70MB，但实际上包含Server和Agent两个应用（同Master-Slave）。不仅如此，K3s 打包了所需的依赖，包括containerd、Flannel、Traefik、Service LB等等。看上去还是挺优秀的，实际上手还是有一些门槛的，由于基础知识的缺失，单是kubectl这个工具都熟悉两天。加上Flannel、LoadBalancer这些内容，服务器都重装了好几轮。好在，所有的问题都有一个标准答案，一路踩坑一路成长，总算把 K3s 给跑起来了。

## Harness（open source）
记得它曾经叫Gitness，他们家东西挺多的，比如Drone。现在做强做大了，Gitness也改名叫Harness了，它资源消耗很小。Harness自带Pipeline功能，这也是我比较喜欢的方式，CI的配置直接存项目里。它的服务是go写的、ui是react、打包用webpack，或许是他们那里的网络带宽足够大吧，它打包的时候没有打压缩包（像比较熟悉的gzip），服务上也没做内容压缩，部署在只有3M带宽的服务器上加载速度着实感人，所以只能在代理层手动做 gzip 压缩（顺便还加上了http cache）。

## ArgoCD
Argo CD是一款适用于Kubernetes 的声明式GitOps 持续交付工具。应用程序的定义、配置和环境应该是声明式的，并受版本控制。 应用程序的部署和生命周期管理应该是自动化的、可审计的，并易于理解。这是官方给出的介绍，简单来说，它可以：
1.  从Git仓库拉取Kubernetes配置，并自动同步到集群。
2. 提供可视化UI，支持应用管理、版本回滚等操作。
3. 声明式管理，所有变更都由Git驱动，保证部署一致性。

在我的架构中，ArgoCD负责盯紧Git仓库中的deployment.yaml，一旦检测到更新，就会自动部署最新的版本。如果出现问题，直接在UI里点回滚，几秒钟搞定，优雅又高效。

## CI/CD 流程效果
**CI阶段（Harness Pipeline）**
代码push到Git仓库后，Harness触发Pipeline：
1. Checkout代码
2. 安装依赖 & 构建应用
3. 构建Docker镜像
4. 上传镜像到阿里云镜像仓库（个人版免费）
5. 修改deployment.yaml里的镜像版本号。

CI 到此结束，下一步交给 ArgoCD。

**CD阶段（ArgoCD部署）**
1. 	自动拉取最新配置deployment.yaml（deployment.yaml存放在Git仓库中）。
2. 	自动同步或手动同步应用部署。

最终，实现了代码提交 → 自动构建 → 自动部署的完整闭环，整个过程无需手动干预，更新全自动完成！

## 防坑指南
最坑的还是AI大模型的幻觉问题，当下AI已成为生活必需品，它能快速的分析问题并给出解决方案，也正是因此被他带着满世界跑，兜兜转转还是回到了起点，下面盘点一下这次AI带我跳过的坑。

**1、禁用Traefik**
安装K3s时它就让我直接把Traefik禁用，然后用Nginx或Caddy做反向代理。正好Caddy我熟，这坑跳得是无怨无悔。老实说，Caddy配置着实简单，尤其是在开启Let‘s Encrypt和gzip压缩这件事上，于是果断选择了Caddy。起初手动部署项目的时候用着还挺顺手的，直到安装了ArgoCD要开始自动部署时，我忽然意识到了问题，程序虽自动部署了，域名绑定什么的咋整？又要上服务器吗？哎！这才明白Ingress Controller是不可替代的。不过这一路也不亏，不仅提高了对Ingress Controller的认知，中间还因为Flannel配置导致的问题将LoadBalancer的知识也撸了不少（AI让我把自带的ServiceLB禁用了，自己安装MetalLB，竟然也老老实实的跟着干了）。

**2、Harness Pipeline配置**
这个其实有点甩锅，毕竟工具是我选的。在使用Pipeline插件构建docker镜像这件事上，Harness自己的插件文档给出来的代码并不适用于Harness Pipeline。但又确实是AI胡编乱造的给我的配置文件，折腾到了几乎要放弃的地步。好在放弃的前一刻，自己根据pipeline示例配置结合官方文档魔改了一份，最后竟成功蒙混过关。

## 最后
从最初的99元服务器，到搭建完整的K3s + CI/CD体系，这一路踩了不少坑，但收获也不少。Kubernetes的学习门槛确实不低，但只要愿意折腾，总能找到答案。
如果对K3s感兴趣，可以看看我的详细笔记：https://www.aser1989.cn/docs/k3s/intro/

---

Posted on [Aser1989’s](https://www.cnblogs.com/aser1989) cnblogs on April 1, 2025, at 22:38
