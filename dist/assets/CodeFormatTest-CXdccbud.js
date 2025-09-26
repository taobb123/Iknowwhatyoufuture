import{r as n,j as e}from"./index-BCw3XfMH.js";import{M as r}from"./MarkdownRenderer-By8FJgtO.js";import{R as s}from"./RichTextEditor-CcJJrE1j.js";import"./code-BovoTn7x.js";import"./list-Sovbi24v.js";const d=()=>{const[t,a]=n.useState(`# 代码格式测试

这是一个测试页面，用于验证代码格式在文章中的显示效果。

## 行内代码测试

这里有一些行内代码：\`console.log("Hello World!")\` 和 \`const name = "张三"\`

## 代码块测试

下面是一个JavaScript代码块：

\`\`\`javascript
function greetUser(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome, \${name}\`;
}

const user = "张三";
const message = greetUser(user);
console.log(message);
\`\`\`

## 多个代码块测试

第一个代码块：

\`\`\`typescript
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "张三",
  age: 25
};
\`\`\`

第二个代码块：

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
\`\`\`

## Python代码块测试

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

def calculate_fibonacci(n):
    """计算斐波那契数列"""
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

# 生成前10个斐波那契数
fib_numbers = [calculate_fibonacci(i) for i in range(10)]
print(fib_numbers)
\`\`\`

## HTML代码块测试

\`\`\`html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>测试页面</title>
</head>
<body>
    <h1>欢迎来到测试页面</h1>
    <p>这是一个<strong>测试</strong>段落。</p>
</body>
</html>
\`\`\`

## CSS代码块测试

\`\`\`css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.button:hover {
    background-color: #0056b3;
}
\`\`\`

## 混合内容测试

这里有一些**加粗文本**和*斜体文本*，以及一些行内代码如 \`npm install\` 和 \`git commit -m "message"\`。

### 列表测试

- 第一项包含 \`code\`
- 第二项包含 **加粗文本**
- 第三项包含 *斜体文本*

### 多个列表测试

第一个列表：
- 列表项1
- 列表项2
- 列表项3

第二个列表：
- 另一个列表项1
- 另一个列表项2
- 另一个列表项3

### 引用测试

> 这是一个引用块，里面也包含一些 \`行内代码\` 和 **加粗文本**。
`);return e.jsx("div",{className:"min-h-screen bg-gray-900 text-white pt-20",children:e.jsx("div",{className:"container mx-auto px-6 py-8",children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsx("h1",{className:"text-3xl font-bold mb-8",children:"代码格式测试页面"}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h2",{className:"text-xl font-semibold",children:"编辑器"}),e.jsx(s,{value:t,onChange:a,placeholder:"在这里编辑内容...",className:"rounded-lg"})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h2",{className:"text-xl font-semibold",children:"预览效果"}),e.jsx("div",{className:"bg-gray-800 rounded-lg p-6 min-h-[500px]",children:e.jsx(r,{content:t})})]})]}),e.jsxs("div",{className:"mt-8",children:[e.jsx("h2",{className:"text-xl font-semibold mb-4",children:"原始Markdown内容"}),e.jsx("pre",{className:"bg-gray-800 border border-gray-600 p-4 rounded-lg overflow-x-auto text-sm text-gray-300 whitespace-pre-wrap",children:t})]})]})})})};export{d as default};
