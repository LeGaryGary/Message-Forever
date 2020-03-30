import { getItem, setItem, wrap, createStore } from './persistentCache';
import { FindUserIdentifierAsync } from './arweave/arweaveId';
import { arweave } from './arweave/arweave';

const { getUser, setUser } = wrap('User', getItem, setItem);

function storeInitiliser(currentUser, store) {
  updateUser(currentUser).then(newUser => store.set(newUser));
}

export async function updateUser(currentUser) {
  console.log(currentUser);
  if (currentUser === null) return null;
  const address = await arweave.wallets.jwkToAddress(currentUser.wallet);
  const newUser = {
    ...currentUser,
    address
  };
  newUser.identifier = await FindUserIdentifierAsync(newUser);
  return newUser;
}

export const user = createStore(getUser, setUser, null, storeInitiliser);