import Transaction from 'arweave/web/lib/transaction';
import { get } from 'svelte/store'

import { arweave, AddType } from '../arweave';
import { SignAndSubmitTransactionAsync } from '../arweave/transaction';

import { StampTx } from './';

import { UnixTimeTag } from '../arweave';
import { LookupNameAsync } from '../arweave/applications/arweaveId';

import {user} from './user'
import {contacts} from './contacts';
import { CreateStore } from '../persistentCache';


const RecipientTag = 'Recipient';
const IsEncryptedTag = 'Encrypted';

const TypePrivateMessage = 'Private-Message';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

let currentUser;
user.subscribe(newUser => {
  if (newUser && newUser.address) {
    currentUser = newUser
  }
});

let currentContacts;
contacts.subscribe((newContacts) => {
  currentContacts = newContacts;
});

export async function SendPrivateMessage(message, address) {
  const aesKey = await getPrivateMessageKey(address);
  const tx = await createMessageTransaction(message, TypePrivateMessage, address, aesKey);
  await SignAndSubmitTransactionAsync(tx, currentUser.wallet);
  const messageObject = await constructMessageObject(tx, aesKey);
  addPrivateMessageToStore(messageObject, address);
}

/**
 * 
 *
 * @export
 * @param {Transaction} tx
 * @param {ArrayBuffer} aesKey
 * @returns 
 */
async function constructMessageObject(tx, aesKey){
  const txFrom = await arweave.wallets.ownerToAddress(tx.owner);
  const txData = {};
  txData.address = txFrom;

  tx.get('tags').forEach(tag => {
    let key = tag.get('name', { decode: true, string: true });
    let value = tag.get('value', { decode: true, string: true });
    if (key === UnixTimeTag) txData.unixTime = value;
    if (key === RecipientTag) txData.recipient = value;
  });
  let messageContent;
  if (aesKey) messageContent = await arweave.crypto.decrypt(tx.data, aesKey);
  else messageContent = tx.data;
  messageContent = decoder.decode(messageContent);
  var fromName = await LookupNameAsync(txData.address);
  var toName = await LookupNameAsync(txData.recipient);
  return {content: messageContent, time: parseInt(txData.unixTime), fromAddress: txData.address, fromName, toAddress: txData.recipient, toName}
}


function addPrivateMessageToStore(messageObject, address){
  const store = GetPrivateMessageStore(address)
  var messages = get(store);
  messages.push(messageObject)
  messages.sort((a,b) => a.time-b.time);
  store.set(messages);
  // Need to insert message into store in the right location
}

const privateMessageStores = {};

export function GetPrivateMessageStore(address){
  console.log(address);
  var store;
  if (privateMessageStores[address]) store = privateMessageStores[address];
  else 
  {
    store = CreateStore('PrivateMessages.' + address, [])
    privateMessageStores[address] = store;
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
function getPrivateMessageKey(address) {
  const locatedContact = currentContacts.find((contact) => contact.address === address);
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
export async function createMessageTransaction(message, type, address, aesKey){
  let data = encoder.encode(message);
  if (aesKey) data = await arweave.crypto.encrypt(data, aesKey);

  const tx = await arweave.createTransaction(
    {data},
    currentUser.wallet
  )
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
export function addRecipient(tx, address){
  tx.addTag(RecipientTag, address)
}

/**
 *
 *
 * @export
 * @param {Transaction} tx
 * @param {boolean} isEncrypted
 */
export function addIsEncrypted(tx, isEncrypted){
  tx.addTag(IsEncryptedTag, isEncrypted.toString())
}