---
slug: 20250114
title: 再谈Redux
authors: [xu]
tags: [redux]
description: 本文分享个人对前端状态管理的理解及 Redux 的独特用法，介绍轻量级开源库 @nebula-note/redux-hooks，实现像 hooks 一样优雅高效地管理共享状态，简化组件通信逻辑
---

2025年再聊前端状态管理似乎是一件不必要的事，毕竟相关文章已堆积得如山如海。但在这些文章或视频内容中，我并没有找到自己喜欢的方案，准确的说是使用方式。所以这篇文章不做技术分析，主要聊聊个人对状态管理的理解，并分享独特的redux使用的方式。

<!-- truncate -->

## 状态管理

先分享一个有趣的现象。或许是小厂的缘故，经常会在一些项目中看到vuex的身影，憋屈的是它经常会被用来存用户相关的数据，并且是只存当前登陆用户的相关信息，或者再存些权限、菜单数据。经手过的项目中用到状态管理的地方其实并不多，所以很多时候也没有太在意，毕竟用是挺好用的，但写起来还是不如组件状态那么简单。直到项目上用了React，并大范围使用redux后我对状态管理有了全新，确切的说是比较正确的认知。为了描述它，我专门画了张草图：
![组件结构示意图](img_1.png)

图上是一个令人痛苦的需求，点击“按钮2”点时候要将外层的“按钮1”设置为禁用状态。要求并不高，痛苦的地方在于他们间隔着好几层的嵌套（现实可能会更残酷些），如果通过事件传递，那么就涉及到所有隔着的组件调整，让它们帮忙传递这个事件。不难，但有点烦。当然，也可以换个思路，比如添加一个全局的事件管理程序，在“按钮1”所在的组件订阅一个事件，事件触发后禁用“按钮1”。当然还有很多类似的方式，如react context等。这个时候我们如果冷静的想想，控制按钮禁用的其实是一个属性，在组件中应该对应一个状态（比如：isDisable=true），如果“按钮2”点击后可以直接修改这个状态，好像会简单很多。这应该就是状态管理最基本的用法。为了方便理解，我还专门画了一张草图：

![状态管理示意图](img_2.png)

大概就这意思吧，状态管理就是将组件状态统一管理，方便组件间状态共享。状态管理是一个非常科学的设计，不仅能降低代码复杂度，还能降低组件的耦合程度。在复杂的场景下，结合中间件可以轻易的解决很多令人头疼的需求，高效、简洁，当然最重要的还是优雅！

这么好的设计为什么我就不常见呢？除了厂小的缘故，使用复杂应该是最大的障碍。遥记得java ssh架构下写一个接口需要修改很多个配置文件！好用的Redux早期管理一个状态至少也要改三个文件（action、reducer、selector），甚至更多，后来用上redux toolkit后也就少写一个action。

## @nebula-note/redux-hooks

出于对编码工作的热爱，最近在写一个自己的代码笔记工具 Nebula Note，React技术栈，状态管理还是熟悉的Redux。Redux中Function Component组件化成本极低，所以我在使用React的时候几乎已完全放弃Class Component。开始并没考虑使用状态管理，但由于组件粒度越来越小，最后还是绷不住用上了。开始是reduxjs/toolkit，后来越写越觉得复杂，最后基于对Redux的熟悉，写了  [@nebula-note/redux-hooks](https://github.com/ASER1989/redux-hooks)，目的是像使用hooks一样使用redux，所以将这个hooks命名useRedux。这里以最小的篇幅介绍下这个库的使用。

#### 配置Store
Redux使用前需要做一些简单的配置，越简单的使用，配置就越简单，且这事只干一次。[@nebula-note/redux-hooks](https://github.com/ASER1989/redux-hooks)是基于redux toolkit封装的，所以使用配置和redux toolkit完全一致。只不过configureStore这个函数需要从[@nebula-note/redux-hooks](https://github.com/ASER1989/redux-hooks)中导入。下面是相关代码：
``` ts
import { configureStore } from '@nebula-note/redux-hooks';
const store = configureStore();
```
#### 使用hooks管理状态
下面是一个极度简单的使用案例，完整的。
```typescript
import { useRedux } from '@nebula-note/redux-hooks';

type ExampleState = {
    isDisabled:boolean
}

export const ExampleA = () => {
     const { state, setState } = useRedux<ExampleState>('reduxKeyName', {isDisabled:false});
     
     const handleDisabled= () => {
        setState(true);
     }
        
     return(
        <div>
            <button disabled={state.isDisabled}>按钮1</button>
          
            <button onclick={handleDisabled}>按钮2</button>
        </div>
     )
}

export const ExampleB = () => {
     const { setState } = useRedux<ExampleState>('reduxKeyName', {isDisabled:false});
     
     const handleDisabled= () => {
        setState(true);
     }
        
     return(
            <button onclick={handleDisabled}>按钮2</button>
     )
}
```

值得开心的是使用[@nebula-note/redux-hooks](https://github.com/ASER1989/redux-hooks)后不再需要编写reducer和action，useRedux会自动创建set和update两个action及reducer，使用中主要是应用这两个action去设置或更新状态，对应的是hooks暴露的两个函数，setState，updateState。setState是完全使用给定值，updateState则不需要提供完整的状态对象，如状态中存储的是`{name, age}`,如果只想更新age，那么只需要传入age就可以了`updateState({age:10})`。

兼容方面[@nebula-note/redux-hooks](https://github.com/ASER1989/redux-hooks)完全兼容redux toolkit，因为早期的时候项目中使用的是redux toolkit，所以重构也不是一次性完成的，因此并不用担心[@nebula-note/redux-hooks](https://github.com/ASER1989/redux-hooks)的引入会对历史代码造成影响。如果需要使用想saga这样的中间件，还是需要自己定义action，[@nebula-note/redux-hooks](https://github.com/ASER1989/redux-hooks)只是一个针对状态的轻量级解决方案。

关于共享状态，useRedux第一个参数是redux的状态名称，所以只要状态名相同，在任何地方使用useRedux都能获取或修改这个状态数据。useRedux的第二个参数是状态默认值，这个值只会在状态数据初始化之前有效。

## 最后
引入状态管理后代码逻辑变得更清晰，使用[@nebula-note/redux-hooks](https://github.com/ASER1989/redux-hooks)后代码变得更简洁。[@nebula-note/redux-hooks](https://github.com/ASER1989/redux-hooks)已发布到[npm](https://www.npmjs.com/package/@nebula-note/redux-hooks)和[github](https://github.com/ASER1989/redux-hooks)上。目前的设计完全是基于自己的需求在做，后续的更新中应该会加入一些新内容，但范围不会太大应该还是只针对基础状态管理。以上便是我对状态管理的理解，以及Redux使用的分享，喜欢请记得点赞。

