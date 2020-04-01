import Arweave from 'arweave/web';
import Transaction from 'arweave/web/lib/transaction';
import { equals } from 'arql-ops';

// Since v1.5.1 you're now able to call the init function for the web version without options. The current path will be used by default, recommended.
export const arweave = Arweave.init();

// LAYER 1
// TAG: FROM
export const FromTag = 'from';

/**
 * FromWalletAddress uses the 'from' tag to locate transactions which have been created by the parameter wallet address.
 *
 * @export
 * @param {string} address
 */
export function FromWalletAddress(address) {
  return equals('from', address);
}

// LAYER 2
// TAG: App-Name
export const AppNameTag = 'App-Name';

/**
 * FromApp uses the 'App-Name' tag to locate transactions which are for the app described in the tag value.
 *
 * @export
 * @param {string} appName
 */
export function FromAppName(appName) {
  return equals(AppNameTag, appName);
}

/**
 * AddAppName adds a 'App-Name' tag to the transaction with the name parameter as the value
 *
 * @export
 * @param {Transaction} tx
 * @param {string} name
 */
export function AddAppName(tx, name) {
  tx.addTag(AppNameTag, name);
}

// TAG: App-Version
export const AppVersionTag = 'App-Version';

/**
 * FromVersion uses the 'App-Version' to locate transactions which are created by a particular version of an app described in the tag value.
 *
 * @export
 * @param {string} version
 */
export function FromVersion(version) {
  return equals(AppVersionTag, version);
}

/**
 * AddVersion adds a 'App-Version' tag to the transaction with the version parameter as the value
 *
 * @export
 * @param {Transaction} tx
 * @param {string} version
 */
export function AddVersion(tx, version) {
  tx.addTag(AppVersionTag, version);
}

// TAG: Type
export const TypeTag = 'Type';

/**
 * HasType uses the 'Type' tag to locate transactions with a type local to the app as described in the tag value.
 *
 * @export
 * @param {string} type
 */
export function HasType(type) {
  return equals('Type', type);
}

/**
 * AddType adds a 'Type' tag to the transaction with the type parameter as the value
 *
 * @export
 * @param {Transaction} tx
 * @param {string} type
 */
export function AddType(tx, type) {
  tx.addTag(TypeTag, type);
}

// TAG: Unix-Time
export const UnixTimeTag = 'Unix-Time';

/**
 * HasUnixTime uses the 'Unix-Time' tag to locate transactions with a unix time as described in the tag value.
 *
 * @export
 * @param {number} time
 */
export function HasUnixTime(time) {
  return equals('Type', time.toString(10));
}

/**
 * AddUnixTime adds a 'Unix-Time' tag to the transaction with the time parameter as the value
 *
 * @export
 * @param {Transaction} tx
 * @param {number} time
 */
export function AddUnixTime(tx, time) {
  tx.addTag(TypeTag, time.toString(10));
}
