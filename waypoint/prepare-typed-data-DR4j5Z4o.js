import { s as size } from './size-CssOTqqV.js';
import { B as BaseError } from './base-CC-Hj7CW.js';
import { i as isAddress, I as InvalidAddressError } from './isAddress-BUhRlNtM.js';
import { j as numberToHex, p as padHex, k as boolToHex, d as stringToHex, t as toHex } from './toBytes-rCiiThej.js';
import { a as concat } from './concat-CZcWoY2n.js';
import { s as slice } from './slice-zoF_Vuu1.js';
import { k as keccak256 } from './keccak256-B1CwQAsk.js';

class AbiEncodingArrayLengthMismatchError extends BaseError {
  constructor({
    expectedLength,
    givenLength,
    type
  }) {
    super([`ABI encoding array length mismatch for type ${type}.`, `Expected length: ${expectedLength}`, `Given length: ${givenLength}`].join('\n'), {
      name: 'AbiEncodingArrayLengthMismatchError'
    });
  }
}
class AbiEncodingBytesSizeMismatchError extends BaseError {
  constructor({
    expectedSize,
    value
  }) {
    super(`Size of bytes "${value}" (bytes${size(value)}) does not match expected size (bytes${expectedSize}).`, {
      name: 'AbiEncodingBytesSizeMismatchError'
    });
  }
}
class AbiEncodingLengthMismatchError extends BaseError {
  constructor({
    expectedLength,
    givenLength
  }) {
    super(['ABI encoding params/values length mismatch.', `Expected length (params): ${expectedLength}`, `Given length (values): ${givenLength}`].join('\n'), {
      name: 'AbiEncodingLengthMismatchError'
    });
  }
}
class BytesSizeMismatchError extends BaseError {
  constructor({
    expectedSize,
    givenSize
  }) {
    super(`Expected bytes${expectedSize}, got bytes${givenSize}.`, {
      name: 'BytesSizeMismatchError'
    });
  }
}
class InvalidAbiEncodingTypeError extends BaseError {
  constructor(type, {
    docsPath
  }) {
    super([`Type "${type}" is not a valid encoding type.`, 'Please provide a valid ABI type.'].join('\n'), {
      docsPath,
      name: 'InvalidAbiEncodingType'
    });
  }
}
class InvalidArrayError extends BaseError {
  constructor(value) {
    super([`Value "${value}" is not a valid array.`].join('\n'), {
      name: 'InvalidArrayError'
    });
  }
}

/**
 * @description Encodes a list of primitive values into an ABI-encoded hex value.
 *
 * - Docs: https://viem.sh/docs/abi/encodeAbiParameters#encodeabiparameters
 *
 *   Generates ABI encoded data using the [ABI specification](https://docs.soliditylang.org/en/latest/abi-spec), given a set of ABI parameters (inputs/outputs) and their corresponding values.
 *
 * @param params - a set of ABI Parameters (params), that can be in the shape of the inputs or outputs attribute of an ABI Item.
 * @param values - a set of values (values) that correspond to the given params.
 * @example
 * ```typescript
 * import { encodeAbiParameters } from 'viem'
 *
 * const encodedData = encodeAbiParameters(
 *   [
 *     { name: 'x', type: 'string' },
 *     { name: 'y', type: 'uint' },
 *     { name: 'z', type: 'bool' }
 *   ],
 *   ['wagmi', 420n, true]
 * )
 * ```
 *
 * You can also pass in Human Readable parameters with the parseAbiParameters utility.
 *
 * @example
 * ```typescript
 * import { encodeAbiParameters, parseAbiParameters } from 'viem'
 *
 * const encodedData = encodeAbiParameters(
 *   parseAbiParameters('string x, uint y, bool z'),
 *   ['wagmi', 420n, true]
 * )
 * ```
 */
function encodeAbiParameters(params, values) {
  if (params.length !== values.length) throw new AbiEncodingLengthMismatchError({
    expectedLength: params.length,
    givenLength: values.length
  });
  // Prepare the parameters to determine dynamic types to encode.
  const preparedParams = prepareParams({
    params: params,
    values: values
  });
  const data = encodeParams(preparedParams);
  if (data.length === 0) return '0x';
  return data;
}
function prepareParams({
  params,
  values
}) {
  const preparedParams = [];
  for (let i = 0; i < params.length; i++) {
    preparedParams.push(prepareParam({
      param: params[i],
      value: values[i]
    }));
  }
  return preparedParams;
}
function prepareParam({
  param,
  value
}) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return encodeArray(value, {
      length,
      param: {
        ...param,
        type
      }
    });
  }
  if (param.type === 'tuple') {
    return encodeTuple(value, {
      param: param
    });
  }
  if (param.type === 'address') {
    return encodeAddress(value);
  }
  if (param.type === 'bool') {
    return encodeBool(value);
  }
  if (param.type.startsWith('uint') || param.type.startsWith('int')) {
    const signed = param.type.startsWith('int');
    return encodeNumber(value, {
      signed
    });
  }
  if (param.type.startsWith('bytes')) {
    return encodeBytes(value, {
      param
    });
  }
  if (param.type === 'string') {
    return encodeString(value);
  }
  throw new InvalidAbiEncodingTypeError(param.type, {
    docsPath: '/docs/contract/encodeAbiParameters'
  });
}
function encodeParams(preparedParams) {
  // 1. Compute the size of the static part of the parameters.
  let staticSize = 0;
  for (let i = 0; i < preparedParams.length; i++) {
    const {
      dynamic,
      encoded
    } = preparedParams[i];
    if (dynamic) staticSize += 32;else staticSize += size(encoded);
  }
  // 2. Split the parameters into static and dynamic parts.
  const staticParams = [];
  const dynamicParams = [];
  let dynamicSize = 0;
  for (let i = 0; i < preparedParams.length; i++) {
    const {
      dynamic,
      encoded
    } = preparedParams[i];
    if (dynamic) {
      staticParams.push(numberToHex(staticSize + dynamicSize, {
        size: 32
      }));
      dynamicParams.push(encoded);
      dynamicSize += size(encoded);
    } else {
      staticParams.push(encoded);
    }
  }
  // 3. Concatenate static and dynamic parts.
  return concat([...staticParams, ...dynamicParams]);
}
function encodeAddress(value) {
  if (!isAddress(value)) throw new InvalidAddressError({
    address: value
  });
  return {
    dynamic: false,
    encoded: padHex(value.toLowerCase())
  };
}
function encodeArray(value, {
  length,
  param
}) {
  const dynamic = length === null;
  if (!Array.isArray(value)) throw new InvalidArrayError(value);
  if (!dynamic && value.length !== length) throw new AbiEncodingArrayLengthMismatchError({
    expectedLength: length,
    givenLength: value.length,
    type: `${param.type}[${length}]`
  });
  let dynamicChild = false;
  const preparedParams = [];
  for (let i = 0; i < value.length; i++) {
    const preparedParam = prepareParam({
      param,
      value: value[i]
    });
    if (preparedParam.dynamic) dynamicChild = true;
    preparedParams.push(preparedParam);
  }
  if (dynamic || dynamicChild) {
    const data = encodeParams(preparedParams);
    if (dynamic) {
      const length = numberToHex(preparedParams.length, {
        size: 32
      });
      return {
        dynamic: true,
        encoded: preparedParams.length > 0 ? concat([length, data]) : length
      };
    }
    if (dynamicChild) return {
      dynamic: true,
      encoded: data
    };
  }
  return {
    dynamic: false,
    encoded: concat(preparedParams.map(({
      encoded
    }) => encoded))
  };
}
function encodeBytes(value, {
  param
}) {
  const [, paramSize] = param.type.split('bytes');
  const bytesSize = size(value);
  if (!paramSize) {
    let value_ = value;
    // If the size is not divisible by 32 bytes, pad the end
    // with empty bytes to the ceiling 32 bytes.
    if (bytesSize % 32 !== 0) value_ = padHex(value_, {
      dir: 'right',
      size: Math.ceil((value.length - 2) / 2 / 32) * 32
    });
    return {
      dynamic: true,
      encoded: concat([padHex(numberToHex(bytesSize, {
        size: 32
      })), value_])
    };
  }
  if (bytesSize !== Number.parseInt(paramSize)) throw new AbiEncodingBytesSizeMismatchError({
    expectedSize: Number.parseInt(paramSize),
    value
  });
  return {
    dynamic: false,
    encoded: padHex(value, {
      dir: 'right'
    })
  };
}
function encodeBool(value) {
  if (typeof value !== 'boolean') throw new BaseError(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
  return {
    dynamic: false,
    encoded: padHex(boolToHex(value))
  };
}
function encodeNumber(value, {
  signed
}) {
  return {
    dynamic: false,
    encoded: numberToHex(value, {
      size: 32,
      signed
    })
  };
}
function encodeString(value) {
  const hexValue = stringToHex(value);
  const partsLength = Math.ceil(size(hexValue) / 32);
  const parts = [];
  for (let i = 0; i < partsLength; i++) {
    parts.push(padHex(slice(hexValue, i * 32, (i + 1) * 32), {
      dir: 'right'
    }));
  }
  return {
    dynamic: true,
    encoded: concat([padHex(numberToHex(size(hexValue), {
      size: 32
    })), ...parts])
  };
}
function encodeTuple(value, {
  param
}) {
  let dynamic = false;
  const preparedParams = [];
  for (let i = 0; i < param.components.length; i++) {
    const param_ = param.components[i];
    const index = Array.isArray(value) ? i : param_.name;
    const preparedParam = prepareParam({
      param: param_,
      value: value[index]
    });
    preparedParams.push(preparedParam);
    if (preparedParam.dynamic) dynamic = true;
  }
  return {
    dynamic,
    encoded: dynamic ? encodeParams(preparedParams) : concat(preparedParams.map(({
      encoded
    }) => encoded))
  };
}
function getArrayComponents(type) {
  const matches = type.match(/^(.*)\[(\d+)?\]$/);
  return matches ?
  // Return `null` if the array is dynamic.
  [matches[2] ? Number(matches[2]) : null, matches[1]] : undefined;
}

// `bytes<M>`: binary type of `M` bytes, `0 < M <= 32`
// https://regexr.com/6va55
const bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
// `(u)int<M>`: (un)signed integer type of `M` bits, `0 < M <= 256`, `M % 8 == 0`
// https://regexr.com/6v8hp
const integerRegex = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;

// Implementation forked and adapted from https://github.com/MetaMask/eth-sig-util/blob/main/src/sign-typed-data.ts
function hashTypedData(parameters) {
  const {
    domain = {},
    message,
    primaryType
  } = parameters;
  const types = {
    EIP712Domain: getTypesForEIP712Domain({
      domain
    }),
    ...parameters.types
  };
  // Need to do a runtime validation check on addresses, byte ranges, integer ranges, etc
  // as we can't statically check this with TypeScript.
  validateTypedData({
    domain,
    message,
    primaryType,
    types
  });
  const parts = ['0x1901'];
  if (domain) parts.push(hashDomain({
    domain,
    types: types
  }));
  if (primaryType !== 'EIP712Domain') parts.push(hashStruct$1({
    data: message,
    primaryType,
    types: types
  }));
  return keccak256(concat(parts));
}
function hashDomain({
  domain,
  types
}) {
  return hashStruct$1({
    data: domain,
    primaryType: 'EIP712Domain',
    types
  });
}
function hashStruct$1({
  data,
  primaryType,
  types
}) {
  const encoded = encodeData$1({
    data,
    primaryType,
    types
  });
  return keccak256(encoded);
}
function encodeData$1({
  data,
  primaryType,
  types
}) {
  const encodedTypes = [{
    type: 'bytes32'
  }];
  const encodedValues = [hashType$1({
    primaryType,
    types
  })];
  for (const field of types[primaryType]) {
    const [type, value] = encodeField$1({
      types,
      name: field.name,
      type: field.type,
      value: data[field.name]
    });
    encodedTypes.push(type);
    encodedValues.push(value);
  }
  return encodeAbiParameters(encodedTypes, encodedValues);
}
function hashType$1({
  primaryType,
  types
}) {
  const encodedHashType = toHex(encodeType$1({
    primaryType,
    types
  }));
  return keccak256(encodedHashType);
}
function encodeType$1({
  primaryType,
  types
}) {
  let result = '';
  const unsortedDeps = findTypeDependencies$1({
    primaryType,
    types
  });
  unsortedDeps.delete(primaryType);
  const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
  for (const type of deps) {
    result += `${type}(${types[type].map(({
      name,
      type: t
    }) => `${t} ${name}`).join(',')})`;
  }
  return result;
}
function findTypeDependencies$1({
  primaryType: primaryType_,
  types
}, results = new Set()) {
  const match = primaryType_.match(/^\w*/u);
  const primaryType = match?.[0];
  if (results.has(primaryType) || types[primaryType] === undefined) {
    return results;
  }
  results.add(primaryType);
  for (const field of types[primaryType]) {
    findTypeDependencies$1({
      primaryType: field.type,
      types
    }, results);
  }
  return results;
}
function encodeField$1({
  types,
  name,
  type,
  value
}) {
  if (types[type] !== undefined) {
    return [{
      type: 'bytes32'
    }, keccak256(encodeData$1({
      data: value,
      primaryType: type,
      types
    }))];
  }
  if (type === 'bytes') {
    const prepend = value.length % 2 ? '0' : '';
    value = `0x${prepend + value.slice(2)}`;
    return [{
      type: 'bytes32'
    }, keccak256(value)];
  }
  if (type === 'string') return [{
    type: 'bytes32'
  }, keccak256(toHex(value))];
  if (type.lastIndexOf(']') === type.length - 1) {
    const parsedType = type.slice(0, type.lastIndexOf('['));
    const typeValuePairs = value.map(item => encodeField$1({
      name,
      type: parsedType,
      types,
      value: item
    }));
    return [{
      type: 'bytes32'
    }, keccak256(encodeAbiParameters(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v)))];
  }
  return [{
    type
  }, value];
}

function validateTypedData(parameters) {
  const {
    domain,
    message,
    primaryType,
    types
  } = parameters;
  const validateData = (struct, data) => {
    for (const param of struct) {
      const {
        name,
        type
      } = param;
      const value = data[name];
      const integerMatch = type.match(integerRegex);
      if (integerMatch && (typeof value === 'number' || typeof value === 'bigint')) {
        const [_type, base, size_] = integerMatch;
        // If number cannot be cast to a sized hex value, it is out of range
        // and will throw.
        numberToHex(value, {
          signed: base === 'int',
          size: Number.parseInt(size_) / 8
        });
      }
      if (type === 'address' && typeof value === 'string' && !isAddress(value)) throw new InvalidAddressError({
        address: value
      });
      const bytesMatch = type.match(bytesRegex);
      if (bytesMatch) {
        const [_type, size_] = bytesMatch;
        if (size_ && size(value) !== Number.parseInt(size_)) throw new BytesSizeMismatchError({
          expectedSize: Number.parseInt(size_),
          givenSize: size(value)
        });
      }
      const struct = types[type];
      if (struct) validateData(struct, value);
    }
  };
  // Validate domain types.
  if (types.EIP712Domain && domain) validateData(types.EIP712Domain, domain);
  // Validate message types.
  if (primaryType !== 'EIP712Domain') validateData(types[primaryType], message);
}
function getTypesForEIP712Domain({
  domain
}) {
  return [typeof domain?.name === 'string' && {
    name: 'name',
    type: 'string'
  }, domain?.version && {
    name: 'version',
    type: 'string'
  }, typeof domain?.chainId === 'number' && {
    name: 'chainId',
    type: 'uint256'
  }, domain?.verifyingContract && {
    name: 'verifyingContract',
    type: 'address'
  }, domain?.salt && {
    name: 'salt',
    type: 'bytes32'
  }].filter(Boolean);
}

/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
// * This function cloned from "hashTypedData" function in "viem" package
// ! "hashTypedData" is keccak256 typedData by default
// ! => could NOT send result to server
function prepareTypedData(parameters) {
  const {
    domain = {},
    message,
    primaryType
  } = parameters;
  const types = {
    EIP712Domain: getTypesForEIP712Domain({
      domain
    }),
    ...parameters.types
  };
  // Need to do a runtime validation check on addresses, byte ranges, integer ranges, etc
  // as we can't statically check this with TypeScript.
  validateTypedData({
    domain,
    message,
    primaryType,
    types
  });
  const parts = ["0x1901"];
  if (domain) parts.push(hashDomain({
    domain,
    types: types
  }));
  if (primaryType !== "EIP712Domain") parts.push(hashStruct({
    data: message,
    primaryType,
    types: types
  }));
  return concat(parts);
}
function hashStruct({
  data,
  primaryType,
  types
}) {
  const encoded = encodeData({
    data,
    primaryType,
    types
  });
  return keccak256(encoded);
}
function encodeData({
  data,
  primaryType,
  types
}) {
  const encodedTypes = [{
    type: "bytes32"
  }];
  const encodedValues = [hashType({
    primaryType,
    types
  })];
  for (const field of types[primaryType]) {
    const [type, value] = encodeField({
      types,
      name: field.name,
      type: field.type,
      value: data[field.name]
    });
    encodedTypes.push(type);
    encodedValues.push(value);
  }
  return encodeAbiParameters(encodedTypes, encodedValues);
}
function hashType({
  primaryType,
  types
}) {
  const encodedHashType = toHex(encodeType({
    primaryType,
    types
  }));
  return keccak256(encodedHashType);
}
function encodeType({
  primaryType,
  types
}) {
  let result = "";
  const unsortedDeps = findTypeDependencies({
    primaryType,
    types
  });
  unsortedDeps.delete(primaryType);
  const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
  for (const type of deps) {
    result += `${type}(${types[type].map(({
      name,
      type: t
    }) => `${t} ${name}`).join(",")})`;
  }
  return result;
}
function findTypeDependencies({
  primaryType: primaryType_,
  types
}, results = new Set()) {
  const match = primaryType_.match(/^\w*/u);
  const primaryType = match?.[0];
  if (results.has(primaryType) || types[primaryType] === undefined) {
    return results;
  }
  results.add(primaryType);
  for (const field of types[primaryType]) {
    findTypeDependencies({
      primaryType: field.type,
      types
    }, results);
  }
  return results;
}
function encodeField({
  types,
  name,
  type,
  value
}) {
  if (types[type] !== undefined) {
    return [{
      type: "bytes32"
    }, keccak256(encodeData({
      data: value,
      primaryType: type,
      types
    }))];
  }
  if (type === "bytes") {
    const prepend = value.length % 2 ? "0" : "";
    value = `0x${prepend + value.slice(2)}`;
    return [{
      type: "bytes32"
    }, keccak256(value)];
  }
  if (type === "string") return [{
    type: "bytes32"
  }, keccak256(toHex(value))];
  if (type.lastIndexOf("]") === type.length - 1) {
    const parsedType = type.slice(0, type.lastIndexOf("["));
    const typeValuePairs = value.map(item => encodeField({
      name,
      type: parsedType,
      types,
      value: item
    }));
    return [{
      type: "bytes32"
    }, keccak256(encodeAbiParameters(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v)))];
  }
  return [{
    type
  }, value];
}

export { hashStruct as a, encodeType as e, hashTypedData as h, prepareTypedData as p };
