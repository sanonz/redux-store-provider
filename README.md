## ReduxStoreProvider

[![npm](https://img.shields.io/npm/v/redux-store-provider.svg)](https://www.npmjs.com/package/redux-store-provider) ![Github file size](https://img.shields.io/github/size/sanonz/redux-store-provider/dist/redux-store-provider.umd.min.js.svg) ![npm](https://img.shields.io/npm/dw/redux-store-provider.svg)

这个库是为了简化 redux 创建 Action 和 Reducer 的过程，使创建过程语义化，提升应用自明性方便后期维护。

本库把 Store 数据简化分为 `单一型`、`列表型`，单一型就是一个 `Object`，对象上边的属性由开发者所定义。列表型就是一个 `Array`，但是它也包含单一型的数据类型，两者在列表型时可以同时使用，默认扩展了 `total` 字段，来记录列表总条数，如果开发者有需要还可以自定义更多属性。

* [安装](#安装)
* [手册](#手册)
* [例子](#例子)


## 安装
```shell
npm install redux-store-provider --save
```

## 手册
```javascript
import Redux from 'redux';
import ReduxStoreProvider from 'redux-store-provider';


const UserStore = new ReduxStoreProvider({ key: 'USER' })
  .begin('set_name')
  // 定义 Action 触发 Reducer
  .action((type, name) => {
    return {
      type,
      name,
    };
  })
  // 定义 Reducer 执行设置用户名的逻辑
  .reducer((type, state, action) => {
    const newState = {...state};
    // 设置用户名
    newState.name = action.name;

    return newState;
  })
  .end()

  .begin('set_other')
  .action(...)
  .reducer(...)
  .end();

const store = Redux.createStore(
  Redux.combineReducers({
    userStore: UserStore.getReducer()
  })
);

// 进行设置操作
store.dispatch(UserStore.getAction().set_name('Sanonz'));
```

### 成员

* [ReduxStoreProvider](#new-reduxstoreprovider)
    * `static` [type(name)](#static-typename--string) ⇒ `string`
    * `static` [config(options)](#static-configoptions--this) ⇒ `this`
    * `static` [.getInitialState()](#static-reduxstoreprovidergetinitialstate--object) ⇒ `Object`
    * `static` [.getInitialStateList()](#static-reduxstoreprovidergetinitialstatelist--object) ⇒ `Object`
    * [new ReduxStoreProvider()](#new-reduxstoreprovider)
    * [.setInitialState(value)](#reduxstoreprovidersetinitialstatevalue--this) ⇒ `this`
    * [.getInitialState()](#reduxstoreprovidergetinitialstate--object) ⇒ `Object`
    * [.begin(name)](#reduxstoreproviderbeginname--this) ⇒ `this`
    * [.action(handler)](#reduxstoreprovideractionhandler--this) ⇒ `this`
    * [.reducer(handler)](#reduxstoreproviderreducerhandler--this) ⇒ `this`
    * [.end()](#reduxstoreproviderend--this) ⇒ `this`
    * [.getAction()](#reduxstoreprovidergetaction--object) ⇒ `function`
    * [.getReducer()](#reduxstoreprovidergetreducer--function) ⇒ `function`



### `static` type(name) ⇒ `string`
生成一个在 Action 中使用的 `type` 字符串

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | name value |


### `static` config(options) ⇒ `this`
全局配置，设置后将会覆盖默认设置并且在全局生效

| Param | Type | Description |
| --- | --- | --- |
| [options] | `Object` | 数据 |
| options.initialState | `Object` | 单一型配置 |
| options.initialStateList | `Object` | 列表型配置 |

```javascript
// 单一型 Store 配置
ReduxStoreProvider.config({
  initialState: {
    value: {}
  }
});

// 列表型 Store 配置
ReduxStoreProvider.config({
  initialState: {
    list: [],
    total: 0,
    value: {}
  }
});
```


### `static` ReduxStoreProvider.getInitialState() ⇒ `Object`
获取单一型全局默认 Store 值


### `static` ReduxStoreProvider.getInitialStateList() ⇒ `Object`
获取列表型全局默认 Store 值


### new ReduxStoreProvider()
初始化一个 Store 值

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | `Object` | `{}` | 数据 |
| options.key | `string` | 自动生成 | 初始化 Store 的 KEY，必须具有单一性 |
| options.type | `string` | `single` | `single` 单一型，`list` 列表型 |
| options.initialState | `Object` |  | 初始化 Store，将会覆盖全局默认设置 |

```javascript
const UserStore = new ReduxStoreProvider({ key: 'USER' });
```


### ReduxStoreProvider.setInitialState(value) ⇒ `this`
覆盖默认 Store，仅在当前 Store 生效

| Param | Type | Description |
| --- | --- | --- |
| value | `Object` | 数据 |


### ReduxStoreProvider.getInitialState() ⇒ `Object`
获取当前 Store 的值
```javascript
UserStore.getInitialState();
// 返回值
// {
//   name: 'Sanonz',
//   email: 'sanonz@126.com'
//   ...
// }
```


### ReduxStoreProvider.begin(name) ⇒ `this`
开始定义扩展会话，支持链式操作，例如：`instance.begin('like').action(fun).reducer(fun).end()`

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | 扩展方法名 |


### ReduxStoreProvider.action(handler) ⇒ `this`
在当前会话定义一个 Action，可以触发 Reducer

| Param | Type | Description |
| --- | --- | --- |
| handler | `function` | 扩展方法 |


### ReduxStoreProvider.reducer(handler) ⇒ `this`
在当前会话定义一个 Reducer，可以在 Action 中触发

| Param | Type | Description |
| --- | --- | --- |
| handler | `function` | 扩展方法 |


### ReduxStoreProvider.end() ⇒ `this`
关闭定义扩展会话


### ReduxStoreProvider.getAction() ⇒ `Object`
获取当前 Store 的 Action，包括默认和自定义

#### 默认的 Action 列表
* `action.set(path, value)`
* `action.merge(value)`

#### 列表型同时包含一下方法
* `action.fill(value, total)`
* `action.shift()`
* `action.unshift(value)`
* `action.pop()`
* `action.push(value)`
* `action.insert(index, value)`
* `action.replace(index, value)`
* `action.remove(index)`


### ReduxStoreProvider.getReducer() ⇒ `function`
获取当前 Store 的 Reducer，包括默认和自定义



## 例子

查看博客：[使用 redux-store-provider 简化 react 开发流程](https://sanonz.github.io/2018/redux-store-provider-example-v2/)
