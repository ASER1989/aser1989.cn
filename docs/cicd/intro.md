---
sidebar_position: 1
---

# 简介
因为已经部署好K3s集群，所以也不再想过手动部署那种刀耕火种的生活了，于是便考虑怎么实现自动化构建和部署。对于个人开发者来说，程序开发完成后要上线主要就打包、部署两个步骤，所对应的正好就是CI和CD。文档中所描述的CI/CD是基于GitOps架构的设计。

## 目标
![](source/intro-img-1.png)
## CI
现在很多的Git工具都支持CI，比如GitHub、GitLab、Gitee、Harness等。CI主要的工作除了构建、测试外，还可以打包镜像并发布到镜像仓库中。如果提交到镜像仓库时需要登陆认证，CI可以自动登陆认证，认证所需的用户名也可以通过git的Secret进行存储，以避免信息泄露。
