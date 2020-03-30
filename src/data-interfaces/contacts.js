import { get } from 'svelte/store';
import { and, or, equals } from 'arql-ops';

import { arweave, ThisApp, From, Type } from './arweave/arweave';
import { getItem, setItem, wrap, createStore } from './persistentCache';
import { user } from './user';

const { getContacts, setContacts } = wrap('Contacts', getItem, setItem);
export const contacts = createStore(getContacts, setContacts, []);
user.subscribe(newUser => {
  if (newUser && newUser.address) {
    loadContacts(newUser.address)
  }
});

export async function loadContacts(address) {
  const contactsDataQuery = and(ThisApp, From(address), Type('contact'));
  arweave.arql(contactsDataQuery).then(txIds => {
    const newContacts = [];
    contacts.set(newContacts);
  });
}
