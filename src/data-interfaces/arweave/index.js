import Arweave from 'arweave/web';
import Transaction from 'arweave/web/lib/transaction';
import { equals } from 'arql-ops';

// Since v1.5.1 you're now able to call the init function for the web version without options. The current path will be used by default, recommended.
export const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

// LAYER 1
// TAG: FROM
const FromTag = 'from';

/**
 * FromWalletAddress uses the 'from' tag to locate transactions which have been created by the parameter wallet address.
 *
 * @export
 * @param {string} address
 */
export function FromWalletAddress(address) {
  return equals(FromTag, address);
}

/**
 *
 *
 * @param {Uint8Array} bytes
 * @param {string} address
 * @returns
 */
export async function EncryptViaAddress(bytes, address) {
  const pubKey = await getPublicKey(address);
  console.log('Pub key for ' + address + ' is:', pubKey);
  const encyptedBuffer = await EncryptRsa(pubKey, bytes);
  return encyptedBuffer;
}

/**
 *
 *
 * @param {CryptoKey} pubKey
 * @param {Uint8Array} byteArray
 */
async function EncryptRsa(pubKey, byteArray) {
  console.log(pubKey)
  return await window.crypto.subtle.encrypt(
    // encrypt AES-256 key with own RSA public key using RSA-OAEP https://github.com/ArweaveTeam/weavemail/blob/master/crypto.js
    {
      name: 'RSA-OAEP'
    },
    pubKey,
    byteArray
  );
}

/**
 *
 *
 * @export
 * @param {import('arweave/web/lib/wallet').JWKInterface} wallet
 * @param {Uint8Array} byteArray
 */
export async function DecryptRsa(wallet, byteArray){
  const key = await walletToKey(wallet);
  return await window.crypto.subtle.decrypt({ name: 'RSA-OAEP' }, key, byteArray)
}

export function GenerateRandomBytes(length) {
  var array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return array;
}

export async function AddressExists(address){
  return await arweave.wallets.getLastTransactionID(address) != '';
}

async function walletToKey(wallet) {
  var w = Object.create(wallet);
  w.alg = 'RSA-OAEP-256';
  w.ext = true;

  var algo = { name: 'RSA-OAEP', hash: { name: 'SHA-256' } };

  return await crypto.subtle.importKey('jwk', w, algo, false, ['decrypt']);
}

async function getPublicKey(address) {
  var txid = await arweave.wallets.getLastTransactionID(address);

  if (!txid) alert('The wallet ' + address + ' has never sent a transaction. \r\n In order to add contact contact must have atleast 1 transaction, it is recommened to set your name on ArweaveID')

  if (txid == '') {
    return undefined;
  }

  var tx = await arweave.transactions.get(txid);

  if (tx == undefined) {
    return undefined;
  }

  var keyData = {
    kty: 'RSA',
    e: 'AQAB',
    n: tx.owner,
    alg: 'RSA-OAEP-256',
    ext: true
  };

  var algo = { name: 'RSA-OAEP', hash: { name: 'SHA-256' } };

  return await crypto.subtle.importKey('jwk', keyData, algo, false, [
    'encrypt'
  ]);
}

// LAYER 2
// TAG: App-Name
export const AppNameTag = 'App-Name';

/**
 * FromApp uses the 'App-Name' tag to locate transactions which are for the app described in the tag value.
 *
 * @export
 * @param {string} appName
 */
export function FromAppName(appName) {
  return equals(AppNameTag, appName);
}

/**
 * AddAppName adds a 'App-Name' tag to the transaction with the name parameter as the value
 *
 * @export
 * @param {Transaction} tx
 * @param {string} name
 */
export function AddAppName(tx, name) {
  tx.addTag(AppNameTag, name);
}

// TAG: App-Version
export const AppVersionTag = 'App-Version';

/**
 * FromVersion uses the 'App-Version' to locate transactions which are created by a particular version of an app described in the tag value.
 *
 * @export
 * @param {string} version
 */
export function FromVersion(version) {
  return equals(AppVersionTag, version);
}

/**
 * AddVersion adds a 'App-Version' tag to the transaction with the version parameter as the value
 *
 * @export
 * @param {Transaction} tx
 * @param {string} version
 */
export function AddVersion(tx, version) {
  tx.addTag(AppVersionTag, version);
}

// TAG: Type
export const TypeTag = 'Type';

/**
 * HasType uses the 'Type' tag to locate transactions with a type local to the app as described in the tag value.
 *
 * @export
 * @param {string} type
 */
export function HasType(type) {
  return equals('Type', type);
}

/**
 * AddType adds a 'Type' tag to the transaction with the type parameter as the value
 *
 * @export
 * @param {Transaction} tx
 * @param {string} type
 */
export function AddType(tx, type) {
  tx.addTag(TypeTag, type);
}

// TAG: Unix-Time
export const UnixTimeTag = 'Unix-Time';

/**
 * HasUnixTime uses the 'Unix-Time' tag to locate transactions with a unix time as described in the tag value.
 *
 * @export
 * @param {number} time
 */
export function HasUnixTime(time) {
  return equals('Type', time.toString(10));
}

/**
 * AddUnixTime adds a 'Unix-Time' tag to the transaction with the time parameter as the value
 *
 * @export
 * @param {Transaction} tx
 * @param {number} time
 */
export function AddUnixTime(tx, time) {
  tx.addTag(UnixTimeTag, time.toString(10));
}

export function AddDateIndexing(tx){
  const now = new Date()
}
