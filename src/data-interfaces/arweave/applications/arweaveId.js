import { and } from 'arql-ops';

import { arweave, FromAppName, FromWalletAddress, HasType } from '../';

import { GetTxCachedAsync, GetMultipleTxCachedAsync } from '../transaction';

const AppNameArqlFilter = FromAppName('arweave-id');
const TypeNameArqlFilter = HasType('name');

/**
 * FindUserIdentifierAsync performs FindIdentifierAsync for the currently logged in user
 *
 * @export
 * @param {any} user
 * @returns {string}
 */
export async function LookupUserIdentifierAsync(user) {
  return LookupIdentifierAsync(user.address);
}

/**
 * FindIdentifierAsync uses arql to lookup the unique username identifier in the format ArweaveidName#XXXX where XXXX is the first 4 characters of the address in lowercase
 *
 * @export
 * @param {string} walletAddress
 * @returns {string}
 */
export async function LookupIdentifierAsync(walletAddress) {
  const name = await LookupNameAsync(walletAddress);
  return `${name}#${walletAddress.slice(0, 4).toLowerCase()}`;
}

/**
 * FindNameAsync uses arql to lookup the arweave ID name of the wallet address
 *
 * @export
 * @param {string} walletAddress
 * @returns {string}
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

/**
 *
 *
 * @export
 * @param {string} userIdentifier
 * @returns {string}
 */
export async function LookupWalletAddress(userIdentifier) {
  if (!userIdentifier || userIdentifier.length < 5) return null;

  const query = and(AppNameArqlFilter, TypeNameArqlFilter);
  const txIds = await arweave.arql(query);
  const txs = await GetMultipleTxCachedAsync(txIds);
  const names = await Promise.all(
    txs.map(async tx => ({
      ownerAddress: await arweave.wallets.ownerToAddress(tx.owner),
      name: tx.get('data', { decode: true, string: true })
    }))
  );

  const name = userIdentifier.slice(0, userIdentifier.length - 5);
  const addressPrefix = userIdentifier.slice(userIdentifier.length - 4, userIdentifier.length);

  const matchingNames = names.filter(v => v.name === name && v.ownerAddress.slice(0,4) === addressPrefix);

  if (matchingNames.length === 0) return null
  return matchingNames[matchingNames.length-1].ownerAddress;
}
