---
sidebar_position: 2
---
# 安装问题
:::info
文档包管理器为：Yarn。
:::

Electron 是一个大包，安装过程会下载对应平台的二进制文件，有时会卡在某个地方(如：` [4/4] ⠄electron`)，或者下载失败。可以尝试以下方法解决：  

## 设置镜像源（特别是国内用户）
镜像源设置有两种方式：运行时环境变量设置、包管理器配置文件设置。

**运行时环境变量设置**

```bash
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
```
```bash
yarn install
```

**包管理器配置文件设置（推荐）**

.npmrc 或 .yarnrc 文件中加入：
```js
electron_mirror=https://npmmirror.com/mirrors/electron/
```
推荐使用此方法解决这个问题，毕竟项目不是一个人的事，也不仅仅是在本机构建。

## 版本问题
在package.json中默认情况下包版本号是长这样的:`Electron: ^25.1.0`，如果没有yarn.lock文件，yarn install时会自动安装最新的版本号，比如：`Electron: 25.1.29`。但这个版本在`npmmirror.com`上可能会没有对应的二进制文件（尤其在最新版本发布后），所以会导致安装失败。

如果在安装时遇到问题，可以尝试将版本号改为最新的稳定版本号，如：`Electron: 25.1.0`。

此外文档的lock文件尽量不要随意删除。

## 最后

**如果`yarn install`时一直卡在：**

> [5/5] 🔨  Building fresh packages...  
> [-/4] ⠄ waiting...   
> [4/4] ⠄ electron  

**试试跳过构建调试**:
```bash
yarn install --ignore-scripts
```

### 常见卡住原因
**1. 网络问题**

Electron 安装过程中会从 GitHub CDN 下载二进制文件，如果被墙或不稳定，容易卡死。

配置镜像源(命令行):
```shell
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
export ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/
```
或者直接写进 .zshrc 或 .bash_profile：
```shell
echo 'export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/' >> ~/.zshrc
echo 'export ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/' >> ~/.zshrc
source ~/.zshrc
```


**2.node_modules 缓存或 lock 文件异常**

如果之前断过安装，或者用了不同版本的 Node/yarn，可能导致依赖安装死循环或冲突。可以通过清理重新安装：
```shell
rm -rf node_modules
rm -f yarn.lock
yarn cache clean
yarn install
```
