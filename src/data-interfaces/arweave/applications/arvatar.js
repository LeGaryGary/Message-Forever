import { and } from 'arql-ops';

import { arweave, FromAppName, FromWalletAddress, HasType } from '../';

import { GetTxCachedAsync } from '../transaction';

const AppNameArqlFilter = FromAppName('arvatar');

/**
 * LookupAvatarAsync uses arql to lookup the arweave ID name of the wallet address
 *
 * @export
 * @param {string} walletAddress
 * @returns {string}
 */
export async function LookupAvatarAsync(walletAddress) {
    const query = and(
      AppNameArqlFilter,
      FromWalletAddress(walletAddress)
    );
    const txIds = await arweave.arql(query);
    if (txIds.length === 0) return null;
    const profilePictureTxId = txIds[0];
    const tx = await GetTxCachedAsync(profilePictureTxId);
    const data = tx.get('data', { decode: true, string: true });
    return data;
  }