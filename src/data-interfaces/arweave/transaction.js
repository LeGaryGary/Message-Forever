import Transaction from 'arweave/web/lib/transaction';

import {getItem, setItem, wrap, getOrSetFuncAsync} from '../persistentCache'
import { arweave, } from './arweave';

const {getTxCache, setTxCache} = wrap('TxCache', getItem, setItem, Transaction.prototype)
const getSetTaxCacheAsync = getOrSetFuncAsync((id) => arweave.transactions.get(id), getTxCache, setTxCache)

/**
 * GetTxCachedAsync gets a single transaction from the Arweave network with the provided transaction ID when the cache is missed.
 * 
 * @export
 * @param {string} txId
 * @returns {Transaction}
 */
export function GetTxCachedAsync(txId){
    return getSetTaxCacheAsync(txId)
}