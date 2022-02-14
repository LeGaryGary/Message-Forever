import { and, or, equals } from 'arql-ops';
import Transaction from 'arweave/web/lib/transaction';

import { CreateStore } from '../persistentCache';
import {
  arweave,
  FromWalletAddress,
  HasType,
  AddType,
  GenerateRandomBytes,
  EncryptViaAddress,
  DecryptRsa,
  UnixTimeTag
} from '../arweave';
import {
  GetMultipleTxCachedAsync,
  SignAndSubmitTransactionAsync
} from '../arweave/transaction';

import { ThisApp, StampTx, AppVersion } from './';
import { user } from './user';
import { LookupNameAsync } from '../arweave/applications/arweaveId';
import { LookupAvatarAsync } from '../arweave/applications/arvatar.js';

const TypeContact = 'Contact';
const ContactAddressTag = 'Contact-Address';

export const contacts = CreateStore('Contacts', []);

let currentUser = null;
user.subscribe((newUser) => {
  if (newUser && newUser.address) {
    currentUser = newUser;
    LoadContacts(newUser.address);
  }
});

export const selectedContact = CreateStore('ContactSelected', null);

export async function CreateContact(address) {
  if (currentUser === null) return;

  // TODO: Check contact and request already exists

  const aesKeyByteArray = await GenerateRandomBytes(256); // random AES-256 key

  const selfEncryptedAesKeyBuffer = await EncryptViaAddress(
    aesKeyByteArray,
    currentUser.address
  );
  const contactEncryptedAesKeyBuffer = await EncryptViaAddress(
    aesKeyByteArray,
    address
  );

  const contactTx = await createContactTx(
    selfEncryptedAesKeyBuffer,
    contactEncryptedAesKeyBuffer,
    address
  );

  await SignAndSubmitTransactionAsync(contactTx, currentUser.wallet);
  console.log('contact tx: ', contactTx.id);
}

async function createContactTx(
  selfEncryptedAesKey,
  contactEncryptedAesKey,
  contactAddress
) {
  const contactTx = await arweave.createTransaction(
    {
      data: arweave.utils.concatBuffers([
        selfEncryptedAesKey,
        contactEncryptedAesKey
      ])
    },
    currentUser.wallet
  );
  StampTx(contactTx);
  AddType(contactTx, TypeContact);
  AddContactAddress(contactTx, contactAddress);
  console.log('contact tx: ', contactTx);
  return contactTx;
}

/**
 *
 *
 * @param {Transaction} tx
 * @param {string} address
 */
function AddContactAddress(tx, address) {
  tx.addTag(ContactAddressTag, address);
}

/**
 * @param {string} address
 */
function HasContactAddress(address) {
  return equals(ContactAddressTag, address);
}

export async function LoadContacts(address) {
  const contactsDataQuery = and(
    ThisApp,
    HasType(TypeContact),
    or(FromWalletAddress(address), HasContactAddress(address))
  );
  const txs = await GetMultipleTxCachedAsync(
    await arweave.arql(contactsDataQuery)
  );
  let newContacts = await Promise.all(
    txs.map(async (tx) => {
      const dataBuffer = arweave.utils.b64UrlToBuffer(tx.data);
      if (dataBuffer.length != 1024) return null;

      const txFrom = await arweave.wallets.ownerToAddress(tx.owner);
      const txData = {};
      txData.address = txFrom;
      tx.get('tags').forEach((tag) => {
        let key = tag.get('name', { decode: true, string: true });
        let value = tag.get('value', { decode: true, string: true });
        if (key === UnixTimeTag) txData.unixTime = value;
        if (key === ContactAddressTag) txData.contactAddress = value;
      });

      let keyBytes;
      let contactAddress;
      if (address === txData.address) {
        keyBytes = new Uint8Array(dataBuffer.slice(0, 512));
        contactAddress = txData.contactAddress;
      } else {
        keyBytes = new Uint8Array(dataBuffer.slice(512));
        contactAddress = txData.address;
      }
      const key = await DecryptRsa(currentUser.wallet, keyBytes);
      return {
        address: contactAddress,
        aesKey: key,
        name: await LookupNameAsync(contactAddress),
        iconUrl: await LookupAvatarAsync(contactAddress)
      };
    })
  );
  newContacts = newContacts.filter((contact) => contact !== null);
  contacts.set(newContacts);
}

export async function ContactTransactionConverter(transaction) {}
