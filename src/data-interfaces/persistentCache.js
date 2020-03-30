import { writable, Writable } from 'svelte/store';
import 'regenerator-runtime/runtime';

export function getItem(stateNames, objectPrototype) {
  const cacheName = getLocalStorageName(stateNames);
  const object = JSON.parse(localStorage.getItem(cacheName));
  if (objectPrototype && object) Object.setPrototypeOf(object, objectPrototype);
  return object;
}

export function setItem(item, stateNames) {
  const cacheName = getLocalStorageName(stateNames);
  localStorage.setItem(cacheName, JSON.stringify(item));
}

export function wrap(stateName, get, set, objectPrototype) {
  const result = {};
  result[`get${stateName}`] = (...stateNames) =>
    get([stateName, ...(stateNames || [])], objectPrototype);
  result[`set${stateName}`] = (item, ...stateNames) =>
    set(item, [stateName, ...(stateNames || [])]);
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
