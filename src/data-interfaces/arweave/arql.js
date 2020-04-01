import {getItem, setItem, wrap, getOrSetFuncAsync} from '../persistentCache'
import { arweave } from './';
import {ArqlOp} from 'arql-ops'

const {getArqlCache, setArqlCache} = wrap('ArqlCache', getItem, setItem)
const getSetArqlCacheAsync = getOrSetFuncAsync((arql) => arweave.arql(arql), getArqlCache, setArqlCache)

/**
 * ArqlCachedAsync queries the Arweave network for transactions that match the provided ArQL query when the cache is missed.
 *
 * @export
 * @param {ArqlOp} arql
 * @returns {string[]}
 */
export function ArqlCachedAsync(arql){
    return getSetArqlCacheAsync(arql)
}