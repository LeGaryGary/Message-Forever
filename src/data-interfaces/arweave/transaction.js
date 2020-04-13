import Transaction, { Tag } from 'arweave/web/lib/transaction';

import { GetOrSetFuncAsync, Wrap } from '../persistentCache';
import { arweave } from './';

const cacheName = 'TxCache';
const [getTxFromCache, setTxToCache] = Wrap(cacheName);
const getSetTaxCacheAsync = GetOrSetFuncAsync(cacheName, id => arweave.transactions.get(id));

const PreventNewTransactions = true;

/**
 * GetTxCachedAsync gets a single transaction from the Arweave network with the provided transaction ID when the cache is missed.
 *
 * @export
 * @param {string} txId
 * @returns {Transaction}
 */
export async function GetTxCachedAsync(txId) {
  const tx = await getSetTaxCacheAsync(txId);
  Object.setPrototypeOf(tx, Transaction.prototype);
  if (tx) {
    tx.get('tags').forEach(tag => {
      Object.setPrototypeOf(tag, Tag.prototype);
    })
  }
  return tx;
}

/**
 * GetMultipleTxCachedAsync gets transactions from the Arweave network with the provided transaction IDs whenever the cache is missed.
 *
 * @export
 * @param {string[]} txIds
 */
export function GetMultipleTxCachedAsync(txIds) {
  return Promise.all(txIds.map(GetTxCachedAsync));;
}

/**
 *
 *
 * @export
 * @param {Transaction} tx
 * @param {import('arweave/web/lib/wallet').JWKInterface} wallet
 * @returns 
 */
export async function SignAndSubmitTransactionAsync(tx, wallet){
  await arweave.transactions.sign(tx, wallet);
  setTxToCache(tx, tx.id);
  if(PreventNewTransactions) return;
  await arweave.transactions.post(tx);
}