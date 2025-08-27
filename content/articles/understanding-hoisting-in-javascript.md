---
title: "Understanding Hoisting in JavaScript"
date: 2025-07-25
tags: ["javascript"]
---

## What is Hoisting?

During the compilation phase, JavaScript scans your code, finds all the variable and function declarations, and registers them in memory before any code runs. But what it does with each declaration type varies.

---

## What gets Hoisted and How?

1. `var`

    When you declare a variable with `var`, JavaScript hoists the *declaration* and also initializes it to `undefined`.
    ```js
    console.log(a); // undefined
    var a = 5;
    ```
    This gets rewritten like:
    ```js
    var a;
    console.log(a); // undefined
    a = 5;
    ```
    And since `var` is function scoped, not block scoped, it can lead to unexpected leaks or overwrites:
    ```js
    if (true) {
        var x = 10;
    }
    console.log(x); // 10
    ```

2. `let` and `const`

     Introduced in `ES6 (ECMAScript 2015)`, `let` and `const` are hoisted too but not initialized. This results in *the temporal dead zone (TDZ)*, the time between entering the scope and reaching the declaration line.
    ```js
    console.log(b); // ReferenceError
    let b = 10;
    ```
     This protects you from using variables too early.

3. Function declarations vs expressions

    A *function declaration* is hoisted entirely, both its name and body, so it can be called before its definition.
    ```js
    greet(); // works

    function greet() {
       console.log('Hello');
    }
    ```
    A *function expression*, however, is not hoisted in the same way. It's treated like a variable assignment, so calling it before definition throws an error.
    ```js
    sayHi(); // ReferenceError

    const sayHi = function () {
        console.log('Hi');
    };
    ```
    Same goes for arrow functions:
    ```js
    sayBye(); // ReferenceError

    const sayBye = () => {
        console.log('Bye');
    };
    ```

4. **Classes**

    ES6 `class` declarations are hoisted similarly to `let` and `const`, meaning they are not initialized until the execution reaches the line.
    ```js
    const p = new Person(); // ReferenceError

    class Person {
        constructor() {
            this.name = 'Alice';
        }
    }
    ```
> A `ReferenceError` occurs when you try to access a variable or function that doesn't exist or hasn't been initialized yet.
>
> A `SyntaxError` happens when your code breaks JavaScript's rules.

---

## What's Happening Internally?
JavaScript execution has two main phases:

1. **Creation Phase**:
- All `var` variables are registered and set to `undefined`.
- `let` and `const` are placed in memory but uninitialized.
- Function declarations are fully available.

2. **Execution Phase**:
- Code runs from top to bottom.
- Variables are assigned their values.
- Functions are called.

---

## Common Bugs Hoisting Creates

- `undefined` bugs from `var` declarations
- `ReferenceError` when using `let`/`const` in the TDZ
- Unexpected function behaviors due to expression hoisting
- Async closure capturing hoisted `var` values incorrectly
``` js
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// logs 3, 3, 3
```
Because `var` is function scoped, all callbacks share the same `i`.
Fixing it with `let`:
```js
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// logs 0, 1, 2
```
---

## Best Practices

To write more predictable JavaScript and avoid hoisting related bugs:
- **Prefer `const` and `let` over `var`**: They provide block scoping and the TDZ protection helps catch errors early rather than allowing silent `undefined` bugs.
- **Declare variables at the top of their scope**: Even though `let` and `const` are hoisted, placing them early in their block improves readability and makes your intention clearer.
- **Use function declarations for main logic, expressions for callbacks**: Function declarations are fully hoisted and are ideal for the code logic you'll use throughout. Use function expressions or arrow functions for callbacks or conditional assignments.
- **Enable ESLint rules**: Set up rules like `no-use-before-define` and `no var` to catch hoisting issues automatically. Modern linters can prevent most hoisting related bugs before they even run.

---

## Conclusion

Hoisting isn't just a technical detail, it's a fundamental part of how JavaScript works behind the scenes. What gets hoisted, and how it's hoisted, directly affects how your code behaves at runtime. Understanding these mechanics gives you control over your code's predictability and helps you write more reliable JavaScript.
