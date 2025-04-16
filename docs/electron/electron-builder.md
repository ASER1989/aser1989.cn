---
sidebar_position: 3
---
# Electron Builder 资源下载问题
Electron Builder在打包时会下载一些资源文件，国内失败概率较高。

## 设置镜像源
Electron默认下载地址是**Github**，如果有代理能正常访问Github，本地开发时可以设置代理。但Electron推荐使用**npm**的镜像源，设置方法如下：

在package.json中加入以下配置：
```json
 "build": {
    "electronDownload": {
      "mirror": "https://npmmirror.com/mirrors/electron/"
    }
  }
```
:::warning[重要提示]
Electron builder 中`package.json`的配置优先级高于`electron-builder.yml`或`electron-builder.json`中的配置。且两种方式不能同时使用。
:::
这里配置的是Electron Builder中的Electron下载源，跟包管理器（yarn、npm）上的不是同一个配置。
到此应该能正常构建MacOS安装包，Windows相关的包会多一些，比较麻烦，可以手动下载：

## 手动下载
有很多博客或文章介绍这种方式，通常会看到需要把xxx文件放到xxx目录下。为了避免麻烦，也避免同操作系统路径不同的问题，可以在项目中指定electron构建缓存的目录。指定目录是CLI 参数，不能设置在Electron builder配置中。这里使用js脚本来配置Electron builder，完整示例如下：

### 脚本示例

```js
// build.js

const builder = require("electron-builder")
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

process.env.ELECTRON_MIRROR = 'https://npmmirror.com/mirrors/electron/';
process.env.ELECTRON_CACHE = path.resolve(__dirname, '../.electron-cache');
process.env.ELECTRON_BUILDER_CACHE = path.resolve(__dirname, '../.electron-cache');


const Platform = builder.Platform;

const args = process.argv.slice(2);

let targets;

if (args.includes('--mac')) {
  targets = Platform.MAC.createTarget();
} else if (args.includes('--win')) {
  targets = Platform.WINDOWS.createTarget();
} else if (args.includes('--all')) {
  targets = Platform.MAC.createTarget()
    .merge(Platform.WINDOWS.createTarget())
    .merge(Platform.LINUX.createTarget());
} else {
  targets = undefined;
}

const configPath = path.resolve(__dirname, '../electron-builder.yml');
let config = {};

try {
  const fileContent = fs.readFileSync(configPath, 'utf8');
  config = yaml.load(fileContent);
} catch (error) {
  console.error('❌ Failed to read electron-builder.yml:', error);
  process.exit(1);
}

builder.build({
  config,
  targets,
}).then(() => {
  console.log('✅ Build completed successfully.');
}).catch((error) => {
  console.error('❌ Build failed:', error);
});

```

脚本中设置了`ELECTRON_CACHE`和`ELECTRON_BUILDER_CACHE`目录为`../.electron-cache`（分别使用两个不同的目录）,相关资源在手动下载后可以直接放入
`../.electron-cache`目录下。这样就不需要每次都下载了。

### 文件存放方式
**1、Electron：**

Electron 资源文件存放示例：`../.electron-cache/electron-v35.1.1-darwin-arm64.zip`。  
直接把压缩包放到这个目录下即可。

**2、Windows相关资源：**

Windows相关资源需要解压并存放到对应目录下，如nsis： `/../.electron-cache/nsis/nsis-3.0.4.1`。  
注意`nsis-3.0.4.1`是解压后到文件夹。


### 运行脚本

脚本中读取的 Electron builder 配置文件文为`../electron-builder.yml`，如果你使用的是`electron-builder.json`，可以直接修改脚本中的路径。

运行脚本时，需要指定要构建的平台，可以使用`--mac`、`--win`或`--all`参数。例如，要构建macOS和Windows平台，可以使用以下命令：
```bash
node build.js --mac
```
