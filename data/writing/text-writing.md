---
title: 测试标题
description: 这是测试文章
date: 2026年5月16日星期六
category: tinkering
categoryLabel: 折腾
tags:
  - Next、text
readingTime: 2 分钟
views: '0'
likes: '0'
modifiedTime: 2026年5月16日星期六
---
## 哈哈哈哈哈哈哈哈哈哈哈
作用域是变量的可访问范围，决定了变量的查找规则，JS采用**词法作用域（静态作用域）**，与动态作用域形成本质区别。

### 词法作用域的核心规则
词法作用域的作用域范围在**函数定义时**即确定，而非函数调用时。也就是说，函数的作用域由其在代码中的书写位置决定：
```javascript
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar(); // 输出1
```
上述代码中，`foo`函数定义时的上层作用域为全局作用域，因此调用时会查找全局的`value`（值为1），而非`bar`函数内的`value`（值为2）。

### 动态作用域的对比
动态作用域的作用域范围在**函数调用时**确定，变量查找会从调用栈的当前作用域向上追溯。例如bash脚本采用动态作用域：
```bash
value=1
function foo () {
    echo $value;
}
function bar () {
    local value=2;
    foo;
}
bar # 输出2
```
此处`foo`调用时的作用域为`bar`函数，因此读取的是`bar`内的`value`。

### 经典面试题：作用域与函数执行位置
两段代码执行结果相同，但执行逻辑存在本质差异：
```javascript
// case1
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope(); // local scope

// case2
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()(); // local scope
```
两者的核心区别在于**执行上下文栈的变化**：case1中`f`函数在`checkscope`执行时直接调用，`checkscope`与`f`的执行上下文同时存在于栈中；case2中`checkscope`先执行完毕并出栈，再调用返回的`f`函数，`f`的执行上下文单独入栈，但因词法作用域的特性，依然能读取`checkscope`的`scope`。
