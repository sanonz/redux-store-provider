(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('lodash')) :
  typeof define === 'function' && define.amd ? define(['lodash'], factory) :
  (global.ReduxStoreProvider = factory(global._));
}(this, (function (lodash) { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var _cacheKeys = [];
  var initialState = {
    value: {}
  };
  var initialStateList = lodash.merge({
    list: [],
    total: 0
  }, initialState);
  /**
   * Store provider.
   *
   * @export ReduxStoreProvider
   * @class ReduxStoreProvider
   */

  var ReduxStoreProvider =
  /*#__PURE__*/
  function () {
    /**
     * config global settings.
     * @static
     * @param {Object} options settings
     * @returns {this}
     */
    ReduxStoreProvider.config = function config(options) {
      if (options.initialState) {
        lodash.merge(initialState, options.initialState);
      }

      if (options.initialStateList) {
        lodash.merge(initialStateList, options.initialStateList);
      }

      return this;
    };
    /**
     * get initial state.
     * @static
     * @returns {Object}
     * @memberof ReduxStoreProvider
     */


    ReduxStoreProvider.getInitialState = function getInitialState() {
      return lodash.cloneDeep(initialState);
    };
    /**
     * get initial state list.
     * @static
     * @returns {Object}
     * @memberof ReduxStoreProvider
     */


    ReduxStoreProvider.getInitialStateList = function getInitialStateList() {
      return lodash.merge(lodash.cloneDeep(initialStateList), initialState);
    };
    /**
     * Creates an instance of ReduxStoreProvider.
     * @param {Object} [options={}] The options is initial config.
     * @param {string} options.key store key.
     * @param {string} options.type store type.
     * @param {Object} options.initialState store initial state.
     * @memberof ReduxStoreProvider
     */


    function ReduxStoreProvider(options) {
      if (options === void 0) {
        options = {};
      }

      if (_cacheKeys.indexOf(this._key) > -1) {
        throw new TypeError("Reducer: key '" + name + "' already exists");
      }

      this._key = options.key;
      this._type = options.type;
      this._time = Date.now();
      this._name = null;

      if (!this._key) {
        this._key = this._time.toString(36).toUpperCase();
        ++this._time;
      }

      this._action = null;
      this._handlers = {};

      if (this._type === 'list') {
        this._reducer = this._reducerList.bind(this);
        this._initialState = ReduxStoreProvider.getInitialStateList();
      } else {
        this._reducer = this._reducerSingle.bind(this);
        this._initialState = ReduxStoreProvider.getInitialState();
      }

      if (options.initialState) {
        this.setInitialState(options.initialState);
      }

      _cacheKeys.push(this._key);
    }
    /**
     * set action and reducer now
     * @param  {string} name [description]
     * @return {this}
     */


    var _proto = ReduxStoreProvider.prototype;

    _proto.begin = function begin(name) {
      name = String(name).toUpperCase();

      if (this._handlers[name]) {
        throw new TypeError("Duplicate '" + name + "' exists on the begin method");
      }

      this._name = name;
      return this;
    };
    /**
     * add action
     * @param  {Funtion} handler handler function
     * @return {this}
     */


    _proto.action = function action(handler) {
      if (!this._name) {
        throw new TypeError("Please call the function action before begin");
      }

      if (!lodash.isFunction(handler)) {
        throw new TypeError(_typeof(handler) + " is not a function");
      }

      if (!this._handlers[this._name]) {
        this._handlers[this._name] = {};
      }

      if (this._handlers[this._name].action) {
        throw new TypeError("Action: '" + this._name + "' already registered");
      } else {
        this._handlers[this._name].action = handler.bind(null, this.type(this._name));
      }

      return this;
    };
    /**
     * add listener in event handler
     * @method
     * @param {Function} handler handler function.
     * @returns {this}
     * @memberof ReduxStoreProvider
     * @description add handler.
     */


    _proto.reducer = function reducer(handler) {
      if (!this._name) {
        throw new TypeError("Please call the function reducer before begin");
      }

      if (!lodash.isFunction(handler)) {
        throw new TypeError(_typeof(handler) + " is not a function");
      }

      if (!this._handlers[this._name]) {
        this._handlers[this._name] = {};
      }

      if (this._handlers[this._name].reducer) {
        throw new TypeError("Reducer: '" + this._name + "' already registered");
      } else {
        this._handlers[this._name].reducer = handler.bind(null, this.type(this._name));
      }

      return this;
    };
    /**
     * done
     * @return {this}
     */


    _proto.end = function end() {
      this._name = null;
      return this;
    };

    /**
     * generate key
     * @param {string} name value
     * @returns {string}
     */
    _proto.type = function type(name) {
      if (name === void 0) {
        name = this._name;
      }

      return this._key + "_" + String(name).toUpperCase();
    };
    /**
     * set initial state
     * @method
     * @param {Object} value default initial state.
     * @returns {this}
     * @memberof ReduxStoreProvider
     * @description set default initial state.
     */


    _proto.setInitialState = function setInitialState(value) {
      lodash.merge(this._initialState, value);
      return this;
    };
    /**
     * get initial state.
     * @method
     * @returns {Object}
     * @memberof ReduxStoreProvider
     * @description get default initial state.
     */


    _proto.getInitialState = function getInitialState() {
      return this._initialState;
    };
    /**
     * get action.
     * @returns {Function}
     * @memberof ReduxStoreProvider
     */


    _proto.getAction = function getAction() {
      if (!this._action) {
        if (this._type === 'list') {
          this._action = this._actionList();
        } else {
          this._action = this._actionSingle();
        }
      }

      return this._action;
    };
    /**
     * get reducer.
     * @returns {Function}
     * @memberof ReduxStoreProvider
     */


    _proto.getReducer = function getReducer() {
      return this._reducer;
    };

    _proto._reducerSingle = function _reducerSingle(state, action) {
      if (state === void 0) {
        state = this._initialState;
      }

      var prefix = this._key + '_';

      if (action.type.indexOf(prefix) !== 0) {
        return state;
      }

      var newState = state;

      switch (action.type) {
        case this.type('SET'):
          newState = lodash.cloneDeep(state);
          lodash.set(newState.value, action.path, action.value);
          break;

        case this.type('MERGE'):
          newState = lodash.cloneDeep(state);
          lodash.merge(newState.value, action.value);
          break;

        default:
          var key = action.type.substr(prefix.length);

          if (this._handlers[key] && this._handlers[key].reducer) {
            newState = this._handlers[key].reducer(state, action);
          }

      }

      return newState;
    };

    _proto._reducerList = function _reducerList(state, action) {
      var _newState$list, _newState$list2, _newState$list3;

      if (state === void 0) {
        state = this._initialState;
      }

      if (action.type.indexOf(this._key + '_') !== 0) {
        return state;
      }

      var newState = state;

      switch (action.type) {
        case this.type('FILL'):
          newState = lodash.cloneDeep(state);
          newState.list = action.value;
          newState.total = lodash.isNumber(+action.total) ? action.total : action.value.length;
          break;

        case this.type('SHIFT'):
          newState = lodash.cloneDeep(state);
          newState.list.shift();
          break;

        case this.type('UNSHIFT'):
          newState = lodash.cloneDeep(state);

          (_newState$list = newState.list).unshift.apply(_newState$list, action.value);

          break;

        case this.type('POP'):
          newState = lodash.cloneDeep(state);
          newState.list.pop();
          break;

        case this.type('PUSH'):
          newState = lodash.cloneDeep(state);

          (_newState$list2 = newState.list).push.apply(_newState$list2, action.value);

          break;

        case this.type('INSERT'):
          newState = lodash.cloneDeep(state);

          (_newState$list3 = newState.list).splice.apply(_newState$list3, [action.index, 0].concat(action.value));

          break;

        case this.type('REPLACE'):
          newState = lodash.cloneDeep(state);

          if (lodash.isFunction(action.index)) {
            newState.list = newState.list.map(action.index);
          } else {
            newState.list.splice(action.index, 1, action.value);
          }

          break;

        case this.type('REMOVE'):
          newState = lodash.cloneDeep(state);

          if (lodash.isFunction(action.index)) {
            newState.list = newState.list.filter(action.index);
          } else {
            newState.list.splice(action.index, 1);
          }

          break;

        default:
          newState = this._reducerSingle(state, action);
      }

      return newState;
    };
    /**
     * create action.
     * @returns {Object}
     * @memberof ReduxStoreProvider
     */


    _proto._actionSingle = function _actionSingle() {
      var key = this._key;
      var actions = {};

      for (var _key in this._handlers) {
        actions[_key.toLowerCase()] = this._handlers[_key].action;
      }

      return Object.assign({
        key: key,
        set: function set(path, value) {
          return {
            path: path,
            value: value,
            type: key + "_SET"
          };
        },
        merge: function merge(value) {
          return {
            value: value,
            type: key + "_MERGE"
          };
        }
      }, actions);
    };
    /**
     * create action list.
     * @returns {Object}
     * @memberof ReduxStoreProvider
     */


    _proto._actionList = function _actionList() {
      var key = this._key;
      return Object.assign({
        fill: function fill(value, total) {
          return {
            total: total,
            value: value,
            type: key + "_FILL"
          };
        },
        shift: function shift() {
          return {
            type: key + "_SHIFT"
          };
        },
        unshift: function unshift() {
          for (var _len = arguments.length, value = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
            value[_key2] = arguments[_key2];
          }

          return {
            value: value,
            type: key + "_UNSHIFT"
          };
        },
        pop: function pop() {
          return {
            type: key + "_POP"
          };
        },
        push: function push() {
          for (var _len2 = arguments.length, value = new Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
            value[_key3] = arguments[_key3];
          }

          return {
            value: value,
            type: key + "_PUSH"
          };
        },
        insert: function insert(index) {
          for (var _len3 = arguments.length, value = new Array(_len3 > 1 ? _len3 - 1 : 0), _key4 = 1; _key4 < _len3; _key4++) {
            value[_key4 - 1] = arguments[_key4];
          }

          return {
            index: index,
            value: value,
            type: key + "_INSERT"
          };
        },
        replace: function replace(index, value) {
          return {
            index: index,
            value: value,
            type: key + "_REPLACE"
          };
        },
        remove: function remove(index) {
          return {
            index: index,
            type: key + "_REMOVE"
          };
        }
      }, this._actionSingle());
    };

    _createClass(ReduxStoreProvider, [{
      key: "key",
      get: function get() {
        return this._key;
      },
      set: function set(value) {
        throw new TypeError("set value not allowed for key");
      }
    }]);

    return ReduxStoreProvider;
  }();

  return ReduxStoreProvider;

})));
