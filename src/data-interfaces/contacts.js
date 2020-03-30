import {getItem, setItem, wrap, createStore} from './persistentCache'
import { and, or, equals } from 'arql-ops';
import {arweave, ThisApp} from './arweave/arweave'

const {getContacts, setContacts} = wrap('Contacts', getItem, setItem)
export const contacts = createStore(getContacts, setContacts, [])

export async function loadContacts(){
    const contactsDataQuery = and(ThisApp, From)
    txids = await arweave.arql(contactsDataQuery)
    const newContacts = [];
    contacts.set(newContacts)
}