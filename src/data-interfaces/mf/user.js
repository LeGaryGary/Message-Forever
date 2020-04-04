import { getItem, setItem, wrap, createStore } from '../persistentCache';
import { arweave } from '../arweave'
import { LookupNameAsync } from '../arweave/applications/arweaveId';

const { getUser, setUser } = wrap('User');

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

// async function FindIdentifier(user){
//   return await FindUserIdentifierAsync
// }

export const user = createStore(getUser, setUser, null, updateUser);
