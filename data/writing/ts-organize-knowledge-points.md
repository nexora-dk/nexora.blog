---
title: TS知识点整理
description: ypeScript的核心价值是强类型约束，从基础类型、对象类型到泛型、类型守卫，所有特性都是为了让代码“类型可预测、错误早发现”。
date: 2026年5月19日星期二
category: programming
categoryLabel: 编程
tags:
  - TS
readingTime: 3 分钟
views: '0'
likes: '0'
modifiedTime: 2026年5月19日星期二
---
## 一、TS的诞生：解决JS弱类型的痛点

JavaScript是典型的**弱类型语言**，无需提前声明变量类型，运行时才会做类型推导。
```JavaScript
// 示例：JS中无类型约束的相加函数
function add(a, b) {
  return a + b;
}
add(1, '2'); // 结果是"12"，而非预期的3
```
就像上面的代码，原本用于数字相加的函数，传入字符串后得到非预期结果，而这类问题在代码运行前无法被发现。

TypeScript作为JS的超集，核心是**强类型约束**：定义变量/函数时必须声明类型，提前规避因类型不符导致的Bug，同时降低团队间的沟通成本——使用者无需反复确认“这个函数该传什么类型的参数”。

## 二、TS基础类型：给变量“贴标签”

TS兼容JS所有原生类型，同时扩展了部分专属类型，核心分类如下：

### 1. 基础原始类型

与JS一致，声明时需显式指定类型：
```TypeScript
// 布尔型
let isDone: boolean = false;
// 数字型（包含整数、浮点数、NaN等）
let count: number = 123;
// 字符串型
let str: string = 'hello';
// 符号型
const sym: symbol = Symbol();
// 未定义/空值（是所有类型的子类型）
let u: undefined = undefined;
let n: null = null;
```

### 2. 数组与元组

- 普通数组：只能存放同类型数据，两种声明方式：
```TypeScript
// 方式1：类型[]
const list: number[] = [1, 2, 3];
// 方式2：泛型写法（后文详解）
let arr: Array<number> = [1, 2, 3];
// 联合类型数组（存放多种类型）
let mixArr: Array<number | string> = [1, 2, '3'];
```
- 元组（Tuple）：特殊数组，需按顺序指定成员类型，长度固定：
```TypeScript
// 第一个元素必须是数字，第二个必须是字符串
let tuple: [number, string] = [100, 'hello'];
```

### 3. 枚举类型（Enum）

用于定义带名字的常量，限制变量值只能是枚举内的项，提升代码可读性：
```TypeScript
enum Direction {
  North, // 默认值0，也可自定义：North = '北'
  South,
  East,
  West
}
// dir的值只能是Direction.North/South/East/West
let dir: Direction = Direction.North;
```
### 4. 任意类型（any）与未知类型（unknown）

两者都表示“类型不确定”，但有核心区别：

- any：放弃类型检查，可赋值给任意类型变量（尽量少用，否则回到JS的问题）：
```TypeScript
let notSure: any = 100;
notSure = 'hello'; // 合法
let abc: string = notSure; // 合法（any可赋值给string）
```
- unknown：更安全的“不确定类型”，不能直接赋值给其他类型变量：
```TypeScript
let value: unknown = 123;
value = 'hello'; // 合法
let abc: string = value; // 报错（unknown不可直接赋值给string）
```

### 5.函数相关类型

- void：函数无返回值时使用：
```TypeScript
function logMsg(): void {
  console.log('hello');
}
```
- 函数类型：函数本身也可作为类型（返回值为函数的场景）：
```TypeScript
function getUser(): Function {
  return function(): number {
    return 123;
  }
}
```

## 三、TS对象类型：区分不同“对象”范畴
TS对“对象”的类型定义做了细分，核心有三种：
```TypeScript
// 1. 小写object：狭义对象（仅包含对象、数组、函数）
const obj: object = { name: '张三' }; 
const arrObj: object = [1, 2, 3];
const funcObj: object = () => {};

// 2. 大写Object：广义对象（几乎囊括所有值，等同于any）
const obj2: Object = 123; // 合法（数字属于广义Object）
const obj3: Object = 'hello'; // 合法

// 3. 空对象{}：不能添加任何属性
const emptyObj: {} = {};
emptyObj.a = 123; // 报错
```
### 特殊：值类型
将具体值作为类型，变量只能等于该值（字面量类型）：
```TypeScript
const hello: 'hello' = 'hello';
hello = 'world'; // 报错（只能是'hello'）
```

## 四、TS进阶手段：让类型更“智能”

### 1. 类型推导

TS编译器会根据变量初始值自动推导类型，可省略显式声明：
```TypeScript
let num = 123; // 编译器自动推导num为number类型
num = 'hello'; // 报错（推导后类型固定）
```

### 2. 类型断言

当开发者比编译器更清楚变量类型时，手动指定类型（两种写法）：
```TypeScript
let someValue: any = 'this is a string';
// 写法1：as 类型（推荐，兼容JSX）
let strLength1 = (someValue as string).length;
// 写法2：<类型>值（不兼容JSX）
let strLength2 = (<string>someValue).length;
```
 **注意：不能将无关类型断言（比如不能把number断言为string）。**

### 3. 类型守卫

运行时检查表达式，确保类型在指定范围内，避免类型错误：
```TypeScript
interface Person {
  name: string;
  age: number;
  sex?: unknown;
}

const p: Person = { name: '张三', age: 18 };
// 类型守卫：检查p.sex是否为string类型
if (typeof p.sex === 'string') {
  console.log(p.sex.length); // 安全访问
}
```

## 五、TS类型定义：interface与type

当基础类型无法满足需求时，TS提供interface和type自定义类型，核心区别如下：

### 1. 接口（interface）

主要用于定义对象结构，可扩展、可实现：
```TypeScript
interface Person {
  name: string; // 必选属性
  age: number;
  sex?: unknown; // 可选属性
}

// 实现接口
const p: Person = {
  name: '张三',
  age: 18,
  // sex可选，可省略
};
```
### 2. 类型别名（type）

功能更强大，可定义对象、联合类型、交叉类型等：
```TypeScript
// 定义基础类型别名
type StrType = string;
const a: StrType = 'hello';

// 联合类型（变量可是多种类型之一）
type UnionType = string | number | boolean;
const b: UnionType = 123; // 合法
const c: UnionType = 'hello'; // 合法

// 交叉类型（合并多个类型，需同时满足）
type PartailX = { x: number };
type Point = PartailX & { y: number };
const p: Point = { x: 100, y: 200 }; // 必须同时有x和y
```

## 六、TS泛型：让代码“复用且类型安全”

泛型是TS的核心特性，解决“类型不明确但需保证类型一致”的问题，核心用于函数、数组等场景。

### 1. 函数泛型

当函数参数/返回值类型不确定，但需保证入参和返回值类型一致时使用：
```TypeScript
// 泛型函数：T是类型变量，调用时确定具体类型
function identity<T>(value: T): T {
  return value;
}

// 调用时指定类型：T为number
identity<number>(123); 
// 调用时自动推导：T为string
identity('hello');

// 多泛型参数
function identity2<T, U>(value: T, msg: U): T {
  console.log(msg);
  return value;
}
identity2<number, string>(123, 'hello');
```
### 2. 数组泛型

本质是泛型的应用，与类型[]等价：
```TypeScript
// Array<number> 等同于 number[]
let arr: Array<number> = [1, 2, 3];
// 结合联合类型
let mixArr: Array<number | string> = [1, 2, '3'];
```
## 总结

TypeScript的核心价值是强类型约束，从基础类型、对象类型到泛型、类型守卫，所有特性都是为了让代码“类型可预测、错误早发现”。
