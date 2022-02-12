import { and } from 'arql-ops';

import { arweave, FromAppName, FromWalletAddress, HasType } from '../';

import { GetTxCachedAsync } from '../transaction';

const AppNameArqlFilter = FromAppName('arvatar');

const Arvatars = {};

/**
 * LookupAvatarAsync uses arql to lookup the arweave ID name of the wallet address
 *
 * @export
 * @param {string} walletAddress
 * @returns {string}
 */
export async function LookupAvatarAsync(walletAddress) {
  if (Arvatars[walletAddress]) return Arvatars[walletAddress];
  const query = and(AppNameArqlFilter, FromWalletAddress(walletAddress));
  const txIds = await arweave.arql(query);
  if (txIds.length === 0){
    var url = 'https://arweave.net/PylCrHjd8cq1V-qO9vsgKngijvVn7LAVLB6apdz0QK0';
    Arvatars[walletAddress] = url;
    return url;
  }
  const profilePictureTxId = txIds[0];
  const tx = await GetTxCachedAsync(profilePictureTxId);
  const data = tx.get('data', { decode: true, string: true });
  Arvatars[walletAddress] = data;
  return data;
}
