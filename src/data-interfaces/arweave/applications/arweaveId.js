import { and } from 'arql-ops';

import { arweave, FromAppName, FromWalletAddress, HasType } from '../';

import { GetTxCachedAsync } from '../transaction';

const AppNameArqlFilter = FromAppName('arweave-id');
const TypeNameArqlFilter = HasType('name');

/**
 * LookupNameAsync uses arql to lookup the arweave ID name of the wallet address
 *
 * @export
 * @param {string} walletAddress
 */
export async function LookupNameAsync(walletAddress) {
  const query = and(
    AppNameArqlFilter,
    FromWalletAddress(walletAddress),
    TypeNameArqlFilter
  );
  const txIds = await arweave.arql(query);
  if (txIds.length === 0) return null;
  const nameTxId = txIds[0];
  const tx = await GetTxCachedAsync(nameTxId);
  const data = tx.get('data', { decode: true, string: true });
  return data;
}