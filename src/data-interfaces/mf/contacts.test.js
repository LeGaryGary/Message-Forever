import {DecryptRsa, arweave, EncryptViaAddress, } from '../arweave'

// describe("Encrypt and decrypt RSA", () => {
//     test('a generated wallet can encrypt and dectpye back to the same value', () => {
//         const wallet = await arweave.wallets.generate();
//         const encryptedText = EncryptViaAddress(await arweave.wallets.jwkToAddress(wallet))
//         expect(DecryptRsa(wallet, encryptedText)).toEqual(output);
//     })
// })