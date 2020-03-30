import { get } from "svelte/store";
import { and } from "arql-ops";

import { arweave, FromApp, From, Type } from "./arweave";


import { GetTxCachedAsync } from "./transaction";

const AppName = "arweave-id";
const NameType = Type("name");

/**
 * FindUserIdentifierAsync performs FindIdentifierAsync for the currently logged in user
 *
 * @export
 * @param {any} user
 * @returns {string}
 */
export async function FindUserIdentifierAsync(user) {
  return FindIdentifierAsync(user.address);
}

/**
 * FindIdentifierAsync uses arql to lookup the unique username identifier in the format ArweaveidName#XXXX where XXXX is the first 4 characters of the address in lowercase
 *
 * @export
 * @param {string} walletAddress
 * @returns {string}
 */
export async function FindIdentifierAsync(walletAddress) {
  const name = await FindNameAsync(walletAddress)
  return `${name}#${walletAddress.slice(0, 4).toLowerCase()}`
}

/**
 * FindNameAsync uses arql to lookup the arweave ID name of the wallet address
 *
 * @export
 * @param {string} walletAddress
 * @returns {string}
 */
export async function FindNameAsync(walletAddress) {
    const query = and(FromApp(AppName), From(walletAddress), NameType);
    const txIds = await arweave.arql(query);
    if (txIds.length === 0) return null;
    const nameTxId = txIds[0];
    const tx = await GetTxCachedAsync(nameTxId);
    const data = tx.get("data", { decode: true, string: true });
    return data;
}
