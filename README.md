## ReduxStoreProvider
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
import ReduxStoreProvider from 'redux-store-provider'
```

### 成员

* [ReduxStoreProvider](#new-reduxstoreprovider)
    * `static` [type(id)](#static-typeid--string) ⇒ `string`
    * `static` [config(options)](#static-configoptions--this) ⇒ `this`
    * `static` [.getInitialState()](#reduxstoreprovidergetinitialstate--object) ⇒ `Object`
    * `static` [.getInitialStateList()](#reduxstoreprovidergetinitialstatelist--object) ⇒ `Object`
    * [new ReduxStoreProvider()](#new-reduxstoreprovider)
    * [.addHandler(name, handler)](#reduxstoreprovideraddhandlername-handler--this) ⇒ `this`
    * [.setInitialState(value)](#reduxstoreprovidersetinitialstatevalue--this) ⇒ `this`
    * [.getInitialState()](#reduxstoreprovidergetinitialstate--object-1) ⇒ `Object`
    * [.getReducer()](#reduxstoreprovidergetreducer--function) ⇒ `function`
    * [.createAction([actions])](#reduxstoreprovidercreateactionactions--object) ⇒ `Object`
    * [.createActionList([actions])](#reduxstoreprovidercreateactionlistactions--object) ⇒ `Object`



### `static` type(id) ⇒ `string`
生成一个在 Action 中使用的 `type` 字符串

| Param | Type | Description |
| --- | --- | --- |
| id | `string` | id value |


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
| options.key | `string` |  | 初始化 Store 的 KEY，必须具有单一性，不传的话会自动生成 |
| options.type | `string` |  | `single` 单一型，`list` 列表型 |
| options.initialState | `Object` |  | 初始化 Store，将会覆盖全局默认设置 |

```javascript
const UserStore = new ReduxStoreProvider({ key: 'POSTS' });
```


### ReduxStoreProvider.addHandler(name, handler) ⇒ `this`
扩展一个方法，可以在 Action 中触发

| Param | Type | Description |
| --- | --- | --- |
| name | `string` | 扩展方法名 |
| handler | `function` | 扩展方法 |


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


### ReduxStoreProvider.getReducer() ⇒ `function`
获取当前 Store 的 Reducer，包括默认和自定义



### ReduxStoreProvider.createAction([actions]) ⇒ `Object`
创建单一型 Action，在需要更新 Store 的地方调用进行更新操作


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [actions] | `Object` | `{}` | 自定义 Action 对象 |

#### 默认的 Action 列表
* `action.set(path, value)`
* `action.merge(value)`

自定义 Action
```javascript
// 首先定义 Reducer 执行设置用户名的逻辑
UserStore.addHandler('set_name', (state, action) => {
  const newState = {...state};
  // 设置用户名
  newState.name = action.value;

  return newState;
});
// 然后定义触发 Reducer 逻辑的 Action
const userAction = UserStore.createAction({
  setName: function (value) {
    return {
      value,
      type: UserStore.type('set_name'),
    };
  },
});
// 进行设置操作
store.dispatch(userAction.setName('Sanonz'));
```


### ReduxStoreProvider.createActionList([actions]) ⇒ `Object`
创建列表型 Action，在需要更新 Store 的地方调用进行更新操作

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [actions] | `Object` | `{}` | 自定义 Action 对象 |

#### 默认的 Action 列表
* `action.fill(value, total)`
* `action.shift()`
* `action.unshift(value)`
* `action.pop()`
* `action.push(value)`
* `action.insert(index, value)`
* `action.replace(index, value)`
* `action.remove(index)`
* 以及 [.createAction([actions])](#reduxstoreprovidercreateactionactions--object)  的所有 Action 列表


## 例子

查看博客：[使用 redux-store-provider 简化 react 开发流程](https://sanonz.github.io/2018/redux-store-provider-example/)
