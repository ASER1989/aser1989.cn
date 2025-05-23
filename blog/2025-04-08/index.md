---
slug: 20250408
title: 从零散笔记到结构化知识库
description: 使用 K3s、Argo CD 和 GitHub Actions 构建个人文档网站，整理笔记，实现自动部署与知识沉淀。
authors: [xu]
tags: [Frontend]
date: 2025-04-08 13:00
hide_table_of_contents: false
---
我一直有记录笔记的习惯，无论是在工作还是学习中。但随着近年来更换笔记软件、频繁迁移数据，笔记内容逐渐变得零散、分散，缺乏系统性与整体性。为了更好地沉淀和复用这些知识，我决定搭建一个文档网站，对过往的笔记进行梳理与整合，逐步构建一套结构清晰、内容完整的知识资料库。

<!-- truncate -->

下面是我在这个过程中所做的一些尝试与实践。


## K8s：不务正业地搭了个集群

在一次“手痒”的驱使下，我在服务器上部署了一个 K8s 集群（有兴趣的朋友可以看看这篇：[用99元买的服务器搭一套CI/CD系统](https://www.cnblogs.com/aser1989/p/18797001)）。虽然这并不是搭建文档网站的必要步骤，因为作为一个静态网站，其实用 `httpd` 或 `IIS` 就足够了。在服务器上部署K8s主要是为了了解更多K8s相关的知识。

目前我的集群由两台服务器组成：一台是阿里云 99 元/年的 ECS，另一台是华为云的轻量应用服务器（原来的腾讯云体验版已到期）。两台服务器配置均为 2 核 2G，组成了一个跨公网的集群。需要注意的是，这种架构在访问速度上会受到明显影响，尤其是在带宽不理想的情况下。如果有条件，推荐使用同一家云服务商的主机，以减少网络延迟。

主力运行节点其实是华为云的那台服务器。虽然使用 `K3s` 构建的集群中 Server 既是 Master 也是 Worker，但由于我在这台机器上部署了 `Argo CD`，再加上本来就紧张的内存资源，导致运行相当吃力。后来关闭了 `kdump`，勉强挤出约 200MB 的内存，才算稳定运行。



## Argo CD：轻量好用的 GitOps 实现

考虑到我并不需要完整的 DevOps 平台，也没有企业级资源，于是选择了开源、口碑不错的 GitOps 工具 —— `Argo CD`。它的主要作用是自动化部署文档网站：每次更新文档并推送至 Git 仓库后，CI 流程完成构建，`Argo CD` 会自动拉取新版本并部署。

虽然配置初期略有学习成本，但上手之后带来的便利是非常明显的：部署自动化、版本回滚、配置追踪，一应俱全。就目前的效果而言，我个人是相当满意的，每次添加了文档后推送到Git仓库就不管了，程序会在CI执行完成后自动更新部署。


## Github Actions：免费的自动构建工具

我最初使用的是 `Harness CI`，不过由于网站源码托管在 GitHub 上，直接使用 `Github Actions` 代替了原来的 `Harness CI`。这里有个小惊喜 —— 对于前端项目，`GitHub Actions` 在安装 `node_modules` 方面的效率极高。而且它运行在 **GitHub** 的托管环境中，我也不需要担心服务器内存不够的问题，毕竟只是闹着玩，再多折腾点就要玩不下去了。

CI 的核心流程如下：

1. 安装依赖并构建静态资源；
2. 将构建结果打包成 `Docker` 镜像；
3. 推送镜像到阿里云容器仓库；
4. 更新部署配置中的镜像版本号，触发 `Argo CD` 自动部署。

整体运行平稳，唯一不足在于**Github**的访问不太稳定，导致 `Argo CD` 有时无法拉取到最新的配置。不过，这并不影响整体使用，因为我对线上文档更新的实时性要求不高，而且通常几分钟内就能恢复正常。


## Docusaurus：开源文档框架

为了整理这些笔记，我选择了由 Facebook开发的开源文档框架 `Docusaurus`。它是一个基于`Markdown` 和 `React` 的静态网站生成器，专为构建文档网站设计，既简洁易用，又可高度定制。相比 `VuePress`，我更喜欢 `Docusaurus` 在自定义页面开发方面的灵活性，它默认支持 MDX，允许在 `Markdown` 中直接使用 `React` 组件，这为前端开发者带来了极大的便利。

同时，`Docusaurus` 提供了一些官方插件和功能模块，如：

- 搜索（相关插件数量应该是最多的）
- 国际化（i18n）
- PWA 支持
- 多版本文档
- 博客系统

虽然插件生态不如 `VuePress` 丰富，但核心功能已经非常完善，尤其适合做结构化、系统化的技术知识整理。


## 性能优化措施

为了提升网站的访问速度，在资源有限的条件下，我主要做了两件优化工作：

* **配置 HTTPS**：这是启用 HTTP/2 的前提。使用 HTTP/2 主要是为了突破浏览器的并发连接限制，从而提升网站加载速度。
* **启用内容压缩**：通过 `Traefik` 中间件实现内容压缩。在带宽受限的情况下，启用压缩能够显著加快内容的传输速度。

## 最后

网站已经部署一段时间，当前已完成部分文档的整理。如果感兴趣，可以访问 [aser1989.cn](https://www.aser1989.cn/) 查看相关内容。更多博客内容请访问 [Aser1989’s cnblogs](https://www.cnblogs.com/aser1989)。

---

Posted on [Aser1989’s](https://www.cnblogs.com/aser1989) cnblogs on April 8, 2025
