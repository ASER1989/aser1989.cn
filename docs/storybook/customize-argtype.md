---
sidebar_position: 3
---
# 自定义props描述
:::warning
文档内容基于 Storybook 8.6 版本的特性和功能编写，所提供示例代码为 React 或 Typescript内容。
:::

Storybook 的自动文档系统由`@storybook/addon-docs`提供支持，能够基于组件的元数据自动生成文档，尤其是`Props`表格和相关描述信息。
然而，默认生成的`Props`描述往往不够完整或缺乏语义化说明。为了提升文档质量，我们可以通过配置`argTypes`属性，手动补充或优化组件参数的描述，使组件文档更加清晰、易于理解。

## 什么是 `argTypes`？

在 Storybook 中，`argTypes` 是一个对象，它允许我们在 `stories` 中定义组件参数（Props）的详细信息。通过 `argTypes`，我们不仅可以修改 Props 的描述，还可以指定控件类型、默认值、是否必填等信息。

## 如何使用 `argTypes` 自定义 Props 描述？

### 1. 基本使用

首先，我们在定义故事（Story）时，使用 `argTypes` 属性来配置每个 Props 的描述。通过这种方式，`Props` 表格将显示我们自定义的描述信息。

### 示例代码

假设我们有一个 `Button` 组件，它的 Props 如下：

```tsx
type ButtonProps = {
  /** 按钮文字 */
  label: string;
  /** 按钮是否禁用 */
  disabled?: boolean;
  /** 按钮大小 */
  size?: 'small' | 'medium' | 'large';
};

const Button = ({ label, disabled, size }: ButtonProps) => (
  <button disabled={disabled} className={`btn-${size}`}>
    {label}
  </button>
);

export default Button;
```
接下来，我们在 Storybook 中使用 argTypes 来为这些 Props 添加详细描述。


### 2. 配置 argTypes

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    label: {
      description: '按钮上显示的文字',
      type: { name: 'string', required: true },
      table: { defaultValue: { summary: '确定' } },
      control: { type: 'text' },
    },
    disabled: {
      description: '是否禁用按钮',
      type: { name: 'boolean', required: false },
      table: { defaultValue: { summary: 'false' } },
      control: { type: 'boolean' },
    },
    size: {
      description: '按钮的大小',
      type: { name: 'enum', value: ['small', 'medium', 'large'], required: false },
      table: { defaultValue: { summary: 'medium' } },
      control: { type: 'radio' },
    },
  },
} as Meta<Button>;

type Story = StoryObj<typeof Button>;
export const Primary: Story = {};
```

### 3. `argTypes` 详细配置说明

- **description**：描述该 Prop 的作用，用于在文档中显示详细说明。
- **type**：指定该 Prop 的类型，包括 `string`、`boolean`、`enum` 等。
    - `required: true` 或 `false`：指示该 Prop 是否是必填项。
- **table.defaultValue.summary**：设置默认值，Storybook 会在文档中显示该值作为默认值。
- **control**：允许我们为该 Prop 添加交互控件，支持的控件类型包括：
    - `text`：文本框
    - `boolean`：开关
    - `radio`：单选框
    - `select`：下拉框等

### 4. 在 Storybook 中展示

通过这种方式，当我们在 Storybook 中查看组件文档时，Props 表格会显示如下：

| Name         | Description                            | Default | Control     |
|--------------|----------------------------------------|---------|-------------|
| **label**    | 按钮上显示的文字<br/> `string`                 |  确定     | Set String  |
| **disabled** | 是否禁用按钮 <br/> `boolean`                 | false   | Set Boolean |
| **size**     | 按钮的大小 <br/> `small`, `medium`, `large` | medium  | Select      |

同时，Storybook 还会为 `label`、`disabled` 和 `size` 等 Props 提供相应的交互控件，允许用户在 Storybook UI 中动态调整这些参数。

## 高级用法

除了基本的属性描述，我们还可以为 `argTypes` 添加更多高级功能：

### 控制参数的显示与隐藏

我们可以根据需要隐藏某些`Props`，避免它们出现在文档中：

```tsx
argTypes: {
  label: { table: { disable: true } },  // 不显示在 Props 表格中
}
```
### 自定义控件

`Props`还可以定义更复杂的控件。例如，使用 `select` 控件来选择一个预定义的值：

```tsx
argTypes: {
  size: {
    control: {
      type: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
}
```

### 默认值和控件状态
我们可以为默认值和控件的状态进行配置，以便开发和测试人员快速看到各种状态下的组件效果。
```tsx
argTypes: {
  // ...
 },
args: {
  disabled: true, // 默认禁用按钮
}
```

## 总结

通过使用 `argTypes`，我们可以自定义和增强 Storybook 生成的组件文档。无论是添加参数描述、控制控件类型，还是指定默认值，`argTypes` 都为我们提供了极大的灵活性，使得组件文档不仅更加清晰易懂，还能增强开发者和设计师的交互体验。使用 `argTypes` 自定义 Props 描述，有助于在 Storybook 中构建更专业、更易用的组件库，让团队成员更高效地理解和使用这些组件。
