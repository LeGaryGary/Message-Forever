import { GetItem, SetItem, Wrap, CreateStore } from '../persistentCache';
import { arweave } from '../arweave'
import { LookupNameAsync } from '../arweave/applications/arweaveId';

export const user = CreateStore('User', null, updateUser);

export function updateUser(currentUser, store) {
  if (currentUser === null) return;
  if (currentUser.address && currentUser.name) return;
  arweave.wallets
    .jwkToAddress(currentUser.wallet)
    .then(address => {
      return {
        ...currentUser,
        address
      };
    })
    .then(newUser => {
      return LookupNameAsync(newUser.address).then(name => ({
        ...newUser,
        name
      }));
    })
    .then(newUser => {
      store.set(newUser);
    });
}
