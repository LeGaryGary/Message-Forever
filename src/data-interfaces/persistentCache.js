import { writable, Writable } from 'svelte/store';
import 'regenerator-runtime/runtime';

export function GetItem(key) {
  const object = JSON.parse(localStorage.getItem(key));
  return object;
}

export function SetItem(item, key) {
  localStorage.setItem(key, JSON.stringify(item));
}

export function Wrap(key) {
  function getParamsKey(params){
    return [key, ...(params.map(JSON.stringify))].join('.')
  }
  const result = [];
  result.push((...params) => GetItem(getParamsKey(params)));
  result.push((item, ...params) => SetItem(item, getParamsKey(params)));
  return result;
}

/**
 *
 *
 * @export
 * @param {string} name
 * @param {any} defaultValue
 * @param {(currentValue: any, store: Writable<any>) => void} storeInitiliser
 * @returns
 */
export function CreateStore(name, defaultValue, storeInitiliser) {
  const [get, set] = Wrap(name);
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
export function GetOrSetFunc(name, func) {
  const [get, set] = Wrap(name);
  return (...params) => {
    const cached = get(...params);
    if (cached) return cached;
    const value = func(...params);
    set(value, ...params);
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
export function GetOrSetFuncAsync(name, asyncFunc) {
  const [get, set] = Wrap(name);
  return async (...params) => {
    const cached = get(...params);
    if (cached) return cached;
    const value = await asyncFunc(...params);
    set(value, ...params);
    return value;
  };
}
