import { getItem, setItem, wrap, createStore } from '../persistentCache';
import { arweave } from '../arweave'
import { LookupUserIdentifierAsync } from '../arweave/applications/arweaveId';

const { getUser, setUser } = wrap('User', getItem, setItem);

export function updateUser(currentUser, store) {
  if (currentUser === null) return;
  if (currentUser.address && currentUser.identifier) return;
  arweave.wallets
    .jwkToAddress(currentUser.wallet)
    .then(address => {
      return {
        ...currentUser,
        address
      };
    })
    .then(newUser => {
      return LookupUserIdentifierAsync(newUser).then(identifier => ({
        ...newUser,
        identifier
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
