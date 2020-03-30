import { getItem, setItem, wrap, createStore } from './persistentCache';
import { FindUserIdentifierAsync } from './arweave/arweaveId';
import { arweave } from './arweave/arweave';

const { getUser, setUser } = wrap('User', getItem, setItem);

export function updateUser(currentUser, store) {
  console.log(arguments)
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
      return FindUserIdentifierAsync(newUser).then(identifier => ({
        ...newUser,
        identifier
      }));
    })
    .then(newUser => {
      store.set(newUser);
    });
}

export const user = createStore(getUser, setUser, null, updateUser);
