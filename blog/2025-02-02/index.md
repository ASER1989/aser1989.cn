---
slug: deepseek-locally
title: 本地部署DeepSeek
authors: [xu]
tags: [AI]
description: 本文详解如何在 Mac 上通过 Ollama、DeepSeek-R1 与 Enchanted 快速实现大模型本地部署，涵盖模型选择、常见报错及 UI 工具配置，助你轻松开启 AI 本地化探索之旅。
---
没想到新年最热闹的地方之一会是互联网，刷爆朋友圈的除了新年祝福还有DeepSeek。揣着一颗好奇心试了试，竟有一种发现新大路的感觉。估计是围观的人太多，在线的版本有时候会出现连不上的情况，好奇心驱使之下想尝试本地部署。

<!-- truncate -->

## 方案
本地化方案非常简单：Ollama + DeepSeek-R1 + Enchanted LLM 。
### [Ollama](https://ollama.com/)
[Ollama](https://ollama.com/)  是一个用于在本地运行大型语言模型（LLMs）的工具，支持多种开源模型，如 Llama 2、Code Llama、Mistral 等。它简化了模型下载、配置和运行的过程，用户可以通过命令行轻松管理模型。使用起来颇有docker的感觉，pull、run、ps...。安装也简单，选择对于系统，下载安装就妥了。
![https://ollama.com/](img-1.png)

### DeepSeek-R1
在Ollama的网站上（[https://ollama.com/](https://ollama.com/)）Models页面当前排名第一的就是DeepSeek-R1，点进去选择对应的版本，右边会展示对应的ollama 命令，复制命令粘贴到命令行工具中执行即可。如图：
![image](img-2.png)
这种高端操作一帆风顺貌似不太合理，所以我也遇到点问题。不同的版本大小差异会比较大，第一个上手的是==70b==这个版本，总大小43GB。en～下了两个小时左右，终于好了，正准备见证奇迹的时候，ollama抛出这样一个提示：`ollama Error: Post "http://127.0.0.1:11434/api/show": read tcp 127.0.0.1:57953->127.0.0.1:11434: read: connection reset by peer` 。后来问了DeepSeek，它思考了半天，它告诉我`The server is busy. Please try again later.` 最后它让我检查服务状态、端口占用、防火墙、Ollama版本......一顿操作之后突然想起了ollama ps这个命令，一看傻眼了，啥都没有。突然明白是模型没运行起来，估计是电脑配置不够，==70b==这个版本高攀不起。于是开始尝试==1.5b==这个版本，一切顺利，可以通过控制台进行对话了。让它用React实现一个tab组件，好家伙给了我十几个方案，果断换下一个版本。于是选择了==32b==这个版本，20GB竟然成功跑起来了。

### Enchanted
控制台对话终究没有UI方便，在[Ollama README](https://github.com/ollama/ollama)上列举了大量UI工具，如Open WebUI、Enchanted、Hollama、Lollms-Webui.... 因为本地是MacOs，这里选择的是[Enchanted](https://github.com/gluonfield/enchanted)。[Enchanted](https://github.com/gluonfield/enchanted)是MacOs下的一个App，也支持IOS和Vision Pro，在AppStore上下载安装即可。[Enchanted](https://github.com/gluonfield/enchanted)配置非常简单，填写本地服务地址（Ollama本地服务是： localhost:11434）选择对应模型版本即可。至此本地化就完成了。最后附上纪念照：

![example](img-3.png)


---

Posted on [Aser1989’s](https://www.cnblogs.com/aser1989) cnblogs on February 2, 2025, at 23:37
