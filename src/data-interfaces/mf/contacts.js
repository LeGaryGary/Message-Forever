import { get } from 'svelte/store';
import { and, or, equals } from 'arql-ops';
import Transaction from 'arweave/web/lib/transaction';

import { arweave, FromWalletAddress, HasType, AddType } from '../arweave';
import { getItem, setItem, wrap, createStore } from '../persistentCache';

import { ThisApp, StampTx } from './';
import { user } from './user';

const TypeContact = 'Contact';
const TypeContactRequest = 'ContactRequest';

let currentUser = null;

const { getContacts, setContacts } = wrap('Contacts', getItem, setItem);
export const contacts = createStore(getContacts, setContacts, []);
user.subscribe(newUser => {
  if (newUser && newUser.address) {
    currentUser = newUser;
    LoadContacts(newUser.address);
  }
});

export async function CreateContact(address) {
  if (currentUser === null) return;

  // TODO: Check contact and request already exists

  
  const aesKeyByteArray = await generateRandomBytes(256); // random AES-256 key
  const selfEncryptedAesKeyBuffer = await encryptViaAddress(aesKeyByteArray, currentUser.address);
  const contactEncryptedAesKeyBuffer = await encryptViaAddress(aesKeyByteArray, address);

  await createContactTx(selfEncryptedAesKeyBuffer);

  await createContactRequestTx(contactEncryptedAesKeyBuffer);
}

async function createContactTx(encryptedAesKey) {
  const contactTx = await arweave.createTransaction({
    data: arweave.utils.concatBuffers([encryptedAesKey])
  }, currentUser.wallet);
  StampTx(contactTx);
  AddType(contactTx, TypeContact);
  console.log('contact tx: ', contactTx);
  return contactTx;
}

async function createContactRequestTx(encryptedAesKey) {
  const contactRequestTx = await arweave.createTransaction({
    data: arweave.utils.concatBuffers([encryptedAesKey])
  }, currentUser.wallet);
  StampTx(contactRequestTx);
  AddType(contactRequestTx, TypeContactRequest);
  console.log('contact request tx: ', contactRequestTx);
  return contactRequestTx;
}

/**
 *
 *
 * @param {Uint8Array} bytes
 * @param {string} address
 * @returns
 */
async function encryptViaAddress(bytes, address) {
  const pubKey = await getPublicKey(address);
  const encyptedBuffer = await encryptRsa(pubKey, bytes);
  return encyptedBuffer;
}

/**
 *
 *
 * @param {CryptoKey} pubKey
 * @param {Uint8Array} byteArray
 */
async function encryptRsa(pubKey, byteArray) {
  return await window.crypto.subtle.encrypt(
    // encrypt AES-256 key with own RSA public key using RSA-OAEP https://github.com/ArweaveTeam/weavemail/blob/master/crypto.js
    {
      name: 'RSA-OAEP'
    },
    pubKey,
    byteArray
  );
}

async function decryptRsa(wallet, byteArray){
  const key = await walletToKey(wallet);
  return await window.crypto.subtle.decrypt({ name: 'RSA-OAEP' }, key, byteArray)
}

async function walletToKey(wallet) {
  var w = Object.create(wallet);
  w.alg = 'RSA-OAEP-256';
  w.ext = true;

  var algo = { name: 'RSA-OAEP', hash: { name: 'SHA-256' } };

  return await crypto.subtle.importKey('jwk', w, algo, false, ['decrypt']);
}

function generateRandomBytes(length) {
  var array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return array;
}

async function getPublicKey(address) {
  var txid = await arweave.wallets.getLastTransactionID(address);

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

export async function LoadContacts(address) {
  const contactsDataQuery = and(
    ThisApp,
    FromWalletAddress(address),
    HasType(TypeContact)
  );
  arweave.arql(contactsDataQuery).then(txIds => {
    const newContacts = [];
    contacts.set(newContacts);
  });
}

/**
 *
 *
 * @export
 * @param {Transaction} transaction
 * @returns {Promise}
 */
export async function TransactionContactConverter(transaction) {
  const contact = {
    address: transaction.get('data', { decode: true, string: true })
  };
  return contact;
}

export async function ContactTransactionConverter(transaction) {}
