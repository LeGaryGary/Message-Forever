import { and, or, equals } from 'arql-ops';

import { get } from 'svelte/store';

import {
  arweave,
  FromWalletAddress,
  HasType,
  FromTag
} from '../data-interfaces/arweave';
import { GetMultipleTxCachedAsync } from '../data-interfaces/arweave/transaction';

import { user } from '../data-interfaces/mf/user';
import { ThisApp } from '../data-interfaces/mf';

let currentUser;
user.subscribe((newUser) => {
  if (newUser && newUser.address) {
    currentUser = newUser;
  }
});

import {
  PrivateMessageStores,
  TypePrivateMessage,
  HasRecipent,
  RecipientTag,
  ConstructMessageObject,
  GetPrivateMessageKey,
  AddPrivateMessageToStore
} from '../data-interfaces/mf/messages';

export async function UpdatePrivateMessages() {
  if (!currentUser) return;

  const contactsDataQuery = and(
    ThisApp,
    HasType(TypePrivateMessage),
    or(FromWalletAddress(currentUser.address), HasRecipent(currentUser.address))
  );
  let txs = await GetMultipleTxCachedAsync(
    await arweave.arql(contactsDataQuery)
  );

  for (let messageStore in PrivateMessageStores) {
    var messages = get(PrivateMessageStores[messageStore]);
    txs = txs.filter((tx) => !messages.some((m) => m.txId == tx.id));
  }

  console.log('Txs to process into messages:', txs);

  await txs.forEach(async (txToProcess) => {
    const txData = {};
    txToProcess.get('tags').forEach((tag) => {
      let key = tag.get('name', { decode: true, string: true });
      let value = tag.get('value', { decode: true, string: true });
      if (key === RecipientTag) txData.toAddress = value;
    });
    const txFrom = await arweave.wallets.ownerToAddress(txToProcess.owner);
    let contactAddress;
    if (txFrom == currentUser.address) contactAddress = txData.toAddress;
    else contactAddress = txFrom;
    var aesKey = GetPrivateMessageKey(contactAddress);
    if (!aesKey) {
      console.log("Couldn't load AES key for contact " + contactAddress);
      return;
    }
    var messageObject = await ConstructMessageObject(txToProcess, aesKey);
    AddPrivateMessageToStore(messageObject, contactAddress);
  });
}
