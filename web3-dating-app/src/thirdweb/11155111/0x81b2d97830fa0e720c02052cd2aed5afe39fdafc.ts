import {
  prepareEvent,
  prepareContractCall,
  readContract,
  type BaseTransactionOptions,
  type AbiParameterToPrimitiveType,
} from "thirdweb";

/**
* Contract read functions
*/

/**
 * Represents the parameters for the "isUserVerified" function.
 */
export type IsUserVerifiedParams = {
  user: AbiParameterToPrimitiveType<{"internalType":"address","name":"user","type":"address"}>
};

/**
 * Calls the "isUserVerified" function on the contract.
 * @param options - The options for the isUserVerified function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isUserVerified } from "TODO";
 *
 * const result = await isUserVerified({
 *  user: ...,
 * });
 *
 * ```
 */
export async function isUserVerified(
  options: BaseTransactionOptions<IsUserVerifiedParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xace417e0",
  [
    {
      "internalType": "address",
      "name": "user",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.user]
  });
};


/**
 * Represents the parameters for the "isVerified" function.
 */
export type IsVerifiedParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"address","name":"","type":"address"}>
};

/**
 * Calls the "isVerified" function on the contract.
 * @param options - The options for the isVerified function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isVerified } from "TODO";
 *
 * const result = await isVerified({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function isVerified(
  options: BaseTransactionOptions<IsVerifiedParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xb9209e33",
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.arg_0]
  });
};


/**
* Contract write functions
*/

/**
 * Represents the parameters for the "verifyUser" function.
 */
export type VerifyUserParams = {
  user: AbiParameterToPrimitiveType<{"internalType":"address","name":"user","type":"address"}>
};

/**
 * Calls the "verifyUser" function on the contract.
 * @param options - The options for the "verifyUser" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { verifyUser } from "TODO";
 *
 * const transaction = verifyUser({
 *  user: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function verifyUser(
  options: BaseTransactionOptions<VerifyUserParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x4d813120",
  [
    {
      "internalType": "address",
      "name": "user",
      "type": "address"
    }
  ],
  []
],
    params: [options.user]
  });
};


