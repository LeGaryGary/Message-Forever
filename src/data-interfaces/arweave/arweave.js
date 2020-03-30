import Arweave from 'arweave/web';
import {equals, ArqlOp} from 'arql-ops'

// Since v1.5.1 you're now able to call the init function for the web version without options. The current path will be used by default, recommended.
export const arweave = Arweave.init();

export const AppName = 'message-forever'
export const AppVersion = '0.1.0'

// Layer 1

export function From(address){
    return equals('from', address)
}


// Layer 2

/**
 * FromApp uses the App-Name tag to locate transactions which are for the app described in the tag value.
 *
 * @export
 * @param {string} appName
 */
export function FromApp(appName){
    return equals('App-Name', appName)
}

export const ThisApp = FromApp(AppName)


/**
 * Type uses the Type tag to locate transactions with a type local to the app as described in the tag value.
 *
 * @export
 * @param {string} type
 */
export function Type(type){
    return equals('Type', type)
}