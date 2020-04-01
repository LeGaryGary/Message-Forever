import { get } from 'svelte/store';
import { and, or, equals } from 'arql-ops';
import Transaction from 'arweave/web/lib/transaction';

import { arweave, FromWalletAddress, HasType, AddType, GenerateRandomBytes, EncryptViaAddress } from '../arweave';
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

  
  const aesKeyByteArray = await GenerateRandomBytes(256); // random AES-256 key
  const selfEncryptedAesKeyBuffer = await EncryptViaAddress(aesKeyByteArray, currentUser.address);
  const contactEncryptedAesKeyBuffer = await EncryptViaAddress(aesKeyByteArray, address);

  const contactTx = await createContactTx(selfEncryptedAesKeyBuffer);
  const contactRequestTx = await createContactRequestTx(contactEncryptedAesKeyBuffer);

  
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
