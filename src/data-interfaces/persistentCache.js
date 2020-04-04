import { writable, Writable } from 'svelte/store';
import 'regenerator-runtime/runtime';

export function getItem(key, objectPrototype) {
  const object = JSON.parse(localStorage.getItem(key));
  if (objectPrototype && object) Object.setPrototypeOf(object, objectPrototype);
  return object;
}

export function setItem(item, key) {
  localStorage.setItem(key, JSON.stringify(item));
}

export function wrap(key, objectPrototype) {
  const result = {};
  result[`get${key}`] = (...params) =>
    getItem([key, ...(params.map(JSON.stringify))].join('.'), objectPrototype);
  result[`set${key}`] = (item, ...params) =>
    setItem(item, [key, ...(params.map(JSON.stringify))].join('.'));
  return result;
}

/**
 *
 *
 * @export
 * @param {(key: string) => any} get
 * @param {(value: any, key: string) => void} set
 * @param {any} defaultValue
 * @param {(currentValue: any, store: Writable<any>) => void} storeInitiliser
 * @returns
 */
export function createStore(get, set, defaultValue, storeInitiliser) {
  var currentValue = get();
  if (currentValue === null) {
    currentValue = defaultValue;
  }
  const store = writable(currentValue);
  store.subscribe(set);
  if (storeInitiliser) {
    storeInitiliser(currentValue, store);
  }
  return store;
}

/**
 * @export
 * @param {() => T} func
 * @param {(key: string) => T} get
 * @param {(value: T, key: string) => void} set
 * @returns
 */
export function getOrSetFunc(func, get, set) {
  return (...params) => {
    const paramsKey = JSON.stringify(params);
    const cached = get(paramsKey);
    if (cached) return cached;
    const value = func(...params);
    set(value, paramsKey);
    return value;
  };
}

/**
 * @export
 * @param {() => Promise<T>} asyncFunc
 * @param {(key: string) => T} get
 * @param {(value: T, key: string) => void} set
 * @returns
 */
export function getOrSetFuncAsync(asyncFunc, get, set) {
  return async (...params) => {
    const paramsKey = JSON.stringify(params);
    const cached = get(paramsKey);
    if (cached) return cached;
    const value = await asyncFunc(...params);
    set(value, paramsKey);
    return value;
  };
}

function getLocalStorageName(stateNames) {
  return stateNames.join('.');
}
