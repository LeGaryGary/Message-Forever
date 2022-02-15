import { equals } from 'arql-ops';

import { Base64 } from 'js-base64';

import Transaction from 'arweave/web/lib/transaction';
import { get } from 'svelte/store';

import { arweave, AddType, UnixTimeTag } from '../arweave';
import { SignAndSubmitTransactionAsync } from '../arweave/transaction';

import { StampTx } from './';

import { LookupNameAsync } from '../arweave/applications/arweaveId';

import { user } from './user';
import { contacts } from './contacts';
import { CreateStore } from '../persistentCache';

export const RecipientTag = 'Recipient';
const IsEncryptedTag = 'Encrypted';

export const TypePrivateMessage = 'Private-Message';

/**
 * @param {string} address
 */
export function HasRecipent(address) {
  return equals(RecipientTag, address);
}

const encoder = new TextEncoder('utf-8');
const decoder = new TextDecoder('utf-8');

let currentUser;
user.subscribe((newUser) => {
  if (newUser && newUser.address) {
    currentUser = newUser;
  }
});

let currentContacts;
contacts.subscribe((newContacts) => {
  currentContacts = newContacts;
});

export async function SendPrivateMessage(message, address) {
  const aesKey = await GetPrivateMessageKey(address);
  const tx = await createMessageTransaction(
    message,
    TypePrivateMessage,
    address,
    aesKey
  );
  await SignAndSubmitTransactionAsync(tx, currentUser.wallet);
  const messageObject = await ConstructMessageObject(tx, aesKey);
  AddPrivateMessageToStore(messageObject, address);
}

/**
 *
 *
 * @export
 * @param {Transaction} tx
 * @param {ArrayBuffer} aesKey
 * @returns
 */
export async function ConstructMessageObject(tx, aesKey) {
  const txFrom = await arweave.wallets.ownerToAddress(tx.owner);
  const txData = {};
  txData.address = txFrom;

  tx.get('tags').forEach((tag) => {
    let key = tag.get('name', { decode: true, string: true });
    let value = tag.get('value', { decode: true, string: true });
    if (key === UnixTimeTag) txData.unixTime = value;
    if (key === RecipientTag) txData.recipient = value;
  });
  let messageContent;
  let data = tx.data;
  if (typeof data != 'string') data = decoder.decode(data);
  try {data = Base64.decode(data);} catch {}
  data = encoder.encode(data);
  try{
    if (aesKey) messageContent = await arweave.crypto.decrypt(data, aesKey);
    else messageContent = data;
  }
  catch(e){
    console.log('Error decrypting message:', e);
    messageContent = 'Error decrypting message'
  }

  if (typeof messageContent != 'string') messageContent = decoder.decode(messageContent);
  var fromName = await LookupNameAsync(txData.address);
  var toName = await LookupNameAsync(txData.recipient);
  return {
    txId: tx.id,
    content: messageContent,
    time: parseInt(txData.unixTime),
    fromAddress: txData.address,
    fromName,
    toAddress: txData.recipient,
    toName
  };
}

export function AddPrivateMessageToStore(messageObject, address) {
  const store = GetPrivateMessageStore(address);
  var messages = get(store);
  messages.push(messageObject);
  messages.sort((a, b) => a.time - b.time);
  store.set(messages);
  console.log('Messages with ' + address, messages);
  // Need to insert message into store in the right location
}

export const PrivateMessageStores = {};

export function GetPrivateMessageStore(address) {
  var store;
  if (PrivateMessageStores[address]) store = PrivateMessageStores[address];
  else {
    store = CreateStore('PrivateMessages.' + address, []);
    PrivateMessageStores[address] = store;
  }
  return store;
}

/**
 *
 *
 * @export
 * @param {string} address
 * @returns {ArrayBuffer}
 */
export function GetPrivateMessageKey(address) {
  const locatedContact = currentContacts.find(
    (contact) => contact.address === address
  );
  return locatedContact.aesKey;
}

/**
 *
 *
 * @export
 * @param {Uint8Array} data
 * @param {Boolean} encrypt
 * @param {string} address
 * @param {string} type
 * @returns
 */
async function createMessageTransaction(message, type, address, aesKey) {
  let data = encoder.encode(message);
  if (aesKey) data = await arweave.crypto.encrypt(data, aesKey);

  data = decoder.decode(data);
  data = Base64.encode(data);

  console.log(data);

  const tx = await arweave.createTransaction({ data }, currentUser.wallet);

  let decrypted = tx.data;
  decrypted = Base64.decode(decrypted);
  decrypted = encoder.encode(decrypted);
  decrypted = arweave.crypto.decrypt(decrypted, aesKey);
  console.log(decrypted);

  StampTx(tx);
  AddType(tx, type);
  addIsEncrypted(tx, aesKey != null);
  if (address) addRecipient(tx, address);
  console.log('message tx: ', tx);
  return tx;
}

/**
 *
 *
 * @export
 * @param {Transaction} tx
 * @param {string} address
 */
function addRecipient(tx, address) {
  tx.addTag(RecipientTag, address);
}

/**
 *
 *
 * @export
 * @param {Transaction} tx
 * @param {boolean} isEncrypted
 */
function addIsEncrypted(tx, isEncrypted) {
  tx.addTag(IsEncryptedTag, isEncrypted.toString());
}
