import { arweave } from '../';
const Arvatars = {};

/**
 * LookupAvatarAsync uses arql to lookup the arweave ID name of the wallet address
 *
 * @export
 * @param {string} walletAddress
 * @returns {string}
 */
export async function LookupAvatarAsync(walletAddress) {
  if (Arvatars[walletAddress]) return Arvatars[walletAddress];
  const results = await arweave.api.post('/graphql', {
    query: `{
      transactions(
        tags: [
          {
            name: "App-Name",
            values: ["arweave-avatar"]
          }
        ],
        owners: ["${walletAddress}"]
      ) {
        edges {
          node {
            id
          }
        }
      }
    }`})
  let edges = results.data.data.transactions.edges;
  let txIds = edges.map(e => e.node.id);
  if (txIds.length === 0){
    var url = 'https://arweave.net/PylCrHjd8cq1V-qO9vsgKngijvVn7LAVLB6apdz0QK0';
    Arvatars[walletAddress] = url;
    return url;
  }
  const profilePictureTxId = txIds[0];
  // const tx = await GetTxCachedAsync(profilePictureTxId);
  // const data = tx.get('data');
  // console.log('pfp:', data);
  Arvatars[walletAddress] = 'https://arweave.net/' + profilePictureTxId;
  return Arvatars[walletAddress];
}
