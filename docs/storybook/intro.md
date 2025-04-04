---
sidebar_position: 1
---
# 简介
Storybook 是一个开源项目，在 GitHub 上已有 83K+ star。它不仅用于构建组件库文档，还能用于组件测试。推荐 Storybook 的主要原因如下：
1.	可直接嵌入项目，在编写组件文档的同时进行组件编码和测试；
2.	基于 TypeScript 组件类型定义自动生成组件参数文档；
3.	**允许在文档中动态修改组件参数值，实时预览不同效果**。
4. 基础文档建设难度低（大多数 [Nebula UI](https://ui.aser1989.cn/)  文档的编写时间不超过1分钟，主要得益于我的项目 [Nebula Note](https://www.aser1989.cn/)，可实现快速内容替换）。

## 安装
1、在项目根目录下运行以下命令，Storybook 会自动检测你的框架（React、Vue、Angular 等）并进行相应的安装：
``` shell
npx storybook@latest init
```
安装过程可能需要几分钟，完成后它会添加必要的Storybook依赖并生成 .storybook 配置目录然后在 src/stories/ 目录中创建示例组件。

## 运行
``` shell
npm run storybook
```
默认情况下，Storybook 会在 http://localhost:6006/ 运行。虽然我们一行代码都没写，但已经可以看到Storybook提供的示例组件文档。



## 配置
在编写文档前，首先应该决定文档的存放方式：
* **集中存放：** 将所有文档统一放在指定目录，例如 src/stories/，类似于示例文档的管理方式。
1. 优点：结构清晰，文档与业务代码解耦，方便统一管理。
2. 适用场景：适合大规模组件库开发，尤其是需要独立维护文档的项目。
* **跟随组件：** 每个组件的 Story 文档与组件代码存放在一起，例如 src/components/Button/Button.stories.tsx。
1. 优点：文档紧贴组件，便于开发和维护，不需要在多个目录之间跳转。
2. 适用场景：适合产品型项目，组件文档随组件代码更新，保持同步。

如果选择跟随组件，则需要调整.storybook/main.js（或 main.ts），并指定文档路径，示例代码如下：
``` typescript

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
```

---


## 参考资料  
[1 . https://storybook.js.org/](https://storybook.js.org/)  
