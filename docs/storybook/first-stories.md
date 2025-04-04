---
sidebar_position: 2
---

# 第一个文档

先分享一个示例，新建一个文档`button.stories.ts`, 内容如下：
``` typescript
import { Meta, StoryObj } from '@storybook/react';
import Button, { ButtonProps } from './index';
import { action } from '@storybook/addon-actions';

export default {
    title: 'Atoms/Button',   
    component: Button,       
    tags: ['autodocs'],      
    argTypes: {},           
    args: {},               
} as Meta<ButtonProps>;

export type Story = StoryObj<ButtonProps>;
export const Primary: Story = {
    args: {
        children: 'Button',    
        type: 'primary',
        onClick: action('Button clicked'), 
    },
};

```
以上便是[Nebula UI](https://ui.aser1989.cn/) 中button文档的全部代码。在 Storybook 的 stories 中，可以使用`actions`来监听按钮点击事件,`action('Button clicked')` 可以在 Action 面板上实时展示事件调用及参数，对于组件自测非常友好，能够帮助开发者快速验证组件的交互行为。

## Storybook 中 Meta 配置说明

在 Storybook 中，每个组件的 story 文件通常会导出一个 `Meta` 对象（使用 `export default`），用于描述该组件在 Storybook 中的展示、组织方式及其行为。

以下是 `Meta` 对象中常用字段的说明：

| 字段名       | 类型                                              | 说明 |
|--------------|-------------------------------------------------|------|
| `title`      | `string`                                        | 定义组件在 Storybook 中的路径与名称。使用斜杠 `/` 可创建分组层级，例如：`Atoms/Button` 表示组件出现在 “Atoms” 分组下。 |
| `component`  | `React.ComponentType`                           | 绑定当前要展示的组件。Storybook 会基于它自动生成控件和文档。 |
| `tags`       | `string[]`                                      | 为 story 添加标签。常见标签如 `autodocs`（启用自动文档生成）、`canvas-hidden` 等。 |
| `argTypes`   | `Record<string, ArgType>`                       | 配置组件 props 的控制方式、类型说明、文档描述等。用于自定义控件 UI 行为。 |
| `args`       | `Record<string, any>`                           | 为组件设置默认 props，所有绑定该 Meta 的 story 都会继承这些默认值。 |
| `parameters` | `object`                                        | 提供额外配置，如布局方式（layout）、背景色、文档展示方式等。 |
| `decorators` | `Function[]`                                    | 为所有 story 添加装饰器，例如包装主题或上下文。 |
| `loaders`    | `Function[]`                                    | 在 story 渲染前执行异步数据加载（可用于模拟 API 请求）。 |
| `render`     | `Function`                                      | 自定义渲染函数，用于替代默认的渲染方式。 |
| `beforeEach` | `BeforeEach[]` 或单个函数                            | 在每个 story 执行前调用（一般用于测试或清理逻辑）。 |
| `mount`      | `(context: StoryContext) => TRenderer["mount"]` | 用于自定义渲染挂载逻辑（渲染器相关，常用于非 React 项目）。 |
| `includeStories` | `StoryDescriptor`                               | 指定要包含的 story 名称（或正则），只展示这些 stories。 |
| `excludeStories` | `StoryDescriptor`                               | 指定要排除的 story 名称（或正则），不展示这些 stories。 |
| `subcomponents`  | `Record<string, TRenderer["component"]>`        | 可选的子组件映射，例如 `{ Icon: Icon }`，用于展示在文档中。 |
| `play`           | `PlayFunction<TRenderer, TArgs>`                | 在 story 渲染完成后运行的函数，适用于交互测试、自动化模拟等。 |
| `globals`        | `Globals`                                       | 全局变量配置（通常来自全局控件），可影响 story 行为，比如暗色模式切换等。 |


## 参考资料
[1、How to write stories](https://storybook.js.org/docs/writing-stories)
