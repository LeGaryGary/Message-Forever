import { getItem, setItem, wrap, createStore } from './persistentCache';

const { getPage, setPage } = wrap('Page', getItem, setItem);
export const page = createStore(getPage, setPage, 'Home');