import { set, merge, cloneDeep, isNumber, isFunction } from 'lodash';


const _cacheKeys = [];
const initialState = { value: {} };
const initialStateList = merge({ list: [], total: 0 }, initialState);

/**
 * Store provider.
 *
 * @export ReduxStoreProvider
 * @class ReduxStoreProvider
 */
export default class ReduxStoreProvider {

  /**
   * config global settings.
   * @static
   * @param {Object} options settings
   * @returns {this}
   */
  static config(options) {
    if (options.initialState) {
      merge(initialState, options.initialState);
    }
    if (options.initialStateList) {
      merge(initialStateList, options.initialStateList);
    }

    return this;
  }

  /**
   * get initial state.
   * @static
   * @returns {Object}
   * @memberof ReduxStoreProvider
   */
  static getInitialState() {
    return cloneDeep(initialState);
  }

  /**
   * get initial state list.
   * @static
   * @returns {Object}
   * @memberof ReduxStoreProvider
   */
  static getInitialStateList() {
    return merge(cloneDeep(initialStateList), initialState);
  }

  /**
   * Creates an instance of ReduxStoreProvider.
   * @param {Object} [options={}] The options is initial config.
   * @param {string} options.key store key.
   * @param {string} options.type store type.
   * @param {Object} options.initialState store initial state.
   * @memberof ReduxStoreProvider
   */
  constructor(options = {}) {
    if (_cacheKeys.indexOf(this._key) > -1) {
      throw new TypeError(`Reducer: key '${name}' already exists`);
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
  begin(name) {
    name = String(name).toUpperCase();

    if (this._handlers[name]) {
      throw new TypeError(`Duplicate '${name}' exists on the begin method`);
    }

    this._name = name;

    return this;
  }

  /**
   * add action
   * @param  {Funtion} handler handler function
   * @return {this}
   */
  action(handler) {
    if (!this._name) {
      throw new TypeError(`Please call the function action before begin`);
    }

    if (!isFunction(handler)) {
      throw new TypeError(`${typeof handler} is not a function`);
    }

    if (!this._handlers[this._name]) {
      this._handlers[this._name] = {};
    }

    if (this._handlers[this._name].action) {
      throw new TypeError(`Action: '${this._name}' already registered`);
    } else {
      this._handlers[this._name].action = handler.bind(null, this.type(this._name));
    } 

    return this;
  }

  /**
   * add listener in event handler
   * @method
   * @param {Function} handler handler function.
   * @returns {this}
   * @memberof ReduxStoreProvider
   * @description add handler.
   */
  reducer(handler) {
    if (!this._name) {
      throw new TypeError(`Please call the function reducer before begin`);
    }

    if (!isFunction(handler)) {
      throw new TypeError(`${typeof handler} is not a function`);
    }

    if (!this._handlers[this._name]) {
      this._handlers[this._name] = {};
    }

    if (this._handlers[this._name].reducer) {
      throw new TypeError(`Reducer: '${this._name}' already registered`);
    } else {
      this._handlers[this._name].reducer = handler.bind(null, this.type(this._name));
    }

    return this;
  }


  /**
   * done
   * @return {this}
   */
  end() {
    this._name = null;

    return this;
  }

  get key() {
    return this._key;
  }

  set key(value) {
    throw new TypeError(`set value not allowed for key`);
  }

  /**
   * generate key
   * @param {string} name value
   * @returns {string}
   */
  type(name = this._name) {
    return `${this._key}_${String(name).toUpperCase()}`;
  }

  /**
   * set initial state
   * @method
   * @param {Object} value default initial state.
   * @returns {this}
   * @memberof ReduxStoreProvider
   * @description set default initial state.
   */
  setInitialState(value) {
    merge(this._initialState, value);

    return this;
  }

  /**
   * get initial state.
   * @method
   * @returns {Object}
   * @memberof ReduxStoreProvider
   * @description get default initial state.
   */
  getInitialState() {
    return this._initialState;
  }

  /**
   * get action.
   * @returns {Function}
   * @memberof ReduxStoreProvider
   */
  getAction() {
    if (!this._action) {
      if (this._type === 'list') {
        this._action = this._actionList();
      } else {
        this._action = this._actionSingle();
      }
    }

    return this._action;
  }

  /**
   * get reducer.
   * @returns {Function}
   * @memberof ReduxStoreProvider
   */
  getReducer() {
    return this._reducer;
  }

  _reducerSingle(state = this._initialState, action) {
    const prefix = this._key + '_';
    if (action.type.indexOf(prefix) !== 0) {
      return state;
    }

    let newState = state;
    switch (action.type) {
      case this.type('SET'):
        newState = cloneDeep(state);
        set(newState.value, action.path, action.value);
        break;
      case this.type('MERGE'):
        newState = cloneDeep(state);
        merge(newState.value, action.value);
        break;
      default:
        const key = action.type.substr(prefix.length);
        if (this._handlers[key] && this._handlers[key].reducer) {
          newState = this._handlers[key].reducer(state, action);
        }
    }

    return newState;
  }

  _reducerList(state = this._initialState, action) {
    if (action.type.indexOf(this._key + '_') !== 0) {
      return state;
    }

    let newState = state;
    switch (action.type) {
      case this.type('FILL'):
        newState = cloneDeep(state);
        newState.list = action.value;
        newState.total = isNumber(+action.total) ? action.total : action.value.length;
        break;
      case this.type('SHIFT'):
        newState = cloneDeep(state);
        newState.list.shift();
        break;
      case this.type('UNSHIFT'):
        newState = cloneDeep(state);
        newState.list.unshift(...action.value);
        break;
      case this.type('POP'):
        newState = cloneDeep(state);
        newState.list.pop();
        break;
      case this.type('PUSH'):
        newState = cloneDeep(state);
        newState.list.push(...action.value);
        break;
      case this.type('INSERT'):
        newState = cloneDeep(state);
        newState.list.splice(action.index, 0, ...action.value);
        break;
      case this.type('REPLACE'):
        newState = cloneDeep(state);
        if (isFunction(action.index)) {
          newState.list = newState.list.map(action.index);
        } else {
          newState.list.splice(action.index, 1, action.value);
        }
        break;
      case this.type('REMOVE'):
        newState = cloneDeep(state);
        if (isFunction(action.index)) {
          newState.list = newState.list.filter(action.index);
        } else {
          newState.list.splice(action.index, 1);
        }
        break;
      default:
        newState = this._reducerSingle(state, action);
    }

    return newState;
  }

  /**
   * create action.
   * @returns {Object}
   * @memberof ReduxStoreProvider
   */
  _actionSingle() {
    const key = this._key;
    const actions = {};

    for(let key in this._handlers) {
      actions[key.toLowerCase()] = this._handlers[key].action;
    }

    return {
      key,
      set: function (path, value) {
        return {
          path,
          value,
          type: `${key}_SET`,
        };
      },
      merge: function (value) {
        return {
          value,
          type: `${key}_MERGE`,
        };
      },

      ...actions,
    };
  }

  /**
   * create action list.
   * @returns {Object}
   * @memberof ReduxStoreProvider
   */
  _actionList() {
    const key = this._key;

    return {
      fill: function (value, total) {
        return {
          total,
          value,
          type: `${key}_FILL`,
        };
      },
      shift: function () {
        return {
          type: `${key}_SHIFT`,
        };
      },
      unshift: function (...value) {
        return {
          value,
          type: `${key}_UNSHIFT`,
        };
      },
      pop: function () {
        return {
          type: `${key}_POP`,
        };
      },
      push: function (...value) {
        return {
          value,
          type: `${key}_PUSH`,
        };
      },
      insert: function (index, ...value) {
        return {
          index,
          value,
          type: `${key}_INSERT`,
        };
      },
      replace: function (index, value) {
        return {
          index,
          value,
          type: `${key}_REPLACE`,
        };
      },
      remove: function (index) {
        return {
          index,
          type: `${key}_REMOVE`,
        };
      },

      ...this._actionSingle(),
    };
  }

}
