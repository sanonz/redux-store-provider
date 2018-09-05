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

    if (!this._key) {
      this._key = this._time.toString(36).toUpperCase();
      ++this._time;
    }

    this._handlers = {};
    if (this._type === 'list') {
      this.reducer = this._reducerList.bind(this);
      this._initialState = ReduxStoreProvider.getInitialStateList();
    } else {
      this.reducer = this._reducer.bind(this);
      this._initialState = ReduxStoreProvider.getInitialState();
    }

    if (options.initialState) {
      this.setInitialState(options.initialState);
    }

    _cacheKeys.push(this._key);
  }

  /**
   * add listener in event handler
   * @method
   * @param {string} name handler name.
   * @param {Function} handler handler function.
   * @returns {this}
   * @memberof ReduxStoreProvider
   * @description add handler.
   */
  addHandler(name, handler) {
    if (!isFunction(handler)) {
      throw new TypeError(`${typeof handler} is not a function`);
    }

    if (this._handlers[name]) {
      throw new TypeError(`Reducer: '${name}' already registered`);
    } else {
      this._handlers[name] = handler;
    }

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
   * @param {string} id id value
   * @returns {string}
   */
  type(id) {
    return `${this._key}_${id}`;
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
   * get reducer.
   * @returns {Function}
   * @memberof ReduxStoreProvider
   */
  getReducer() {
    return this.reducer;
  }

  _reducer(state = this._initialState, action) {
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
        if (this._handlers[key]) {
          newState = this._handlers[key](state, action);
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
        newState = this._reducer(state, action);
    }

    return newState;
  }

  /**
   * create action.
   * @param {Object} [actions={}]
   * @returns {Object}
   * @memberof ReduxStoreProvider
   */
  createAction(actions = {}) {
    const key = this._key;

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
   * @param {Object} [actions={}]
   * @returns {Object}
   * @memberof ReduxStoreProvider
   */
  createActionList(actions = {}) {
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

      ...this.createAction(actions),
    };
  }

}
