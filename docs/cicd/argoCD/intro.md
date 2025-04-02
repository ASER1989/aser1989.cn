---
sidebar_position: 1
---
# 简介

Argo CD是一款适用于`Kubernetes`的声明式`GitOps`持续交付工具。Argo CD中应用的定义、配置和环境应采用声明式方式，并进行版本控制。应用的部署和生命周期管理应实现自动化、可审计且易于理解。
![来自官方的poster](img.webp)
## 配置管理
Argo CD支持多种方式的配置管理，包括`Kustomize`、`Helm`、`Jsonnet`、`Ksonnet`、`YAML`等。Argo CD可以自动检测和同步这些配置文件，确保应用程序的状态与Git存储库中的配置文件保持一致。

默认情况下Argo CD 每三分钟轮询一次 Git 仓库，以检测清单的变更。 为消除轮询带来的延迟，可将 API 服务器配置为接收 webhook 事件。 Argo CD 支持来自 GitHub、GitLab、Bitbucket、Bitbucket Server、Azure DevOps 和 Gogs 的 Git webhook 通知。webhook相关的内容请参考[Git Webhook Configuration](https://argo-cd.readthedocs.io/en/stable/operator-manual/webhook/)。更多Argo CD相关的设置请参考 [High Availability](https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/)。

## 参考资料
 [1 . Git Webhook Configuration](https://argo-cd.readthedocs.io/en/stable/operator-manual/webhook/)  
 [2 . High Availability](https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/)
