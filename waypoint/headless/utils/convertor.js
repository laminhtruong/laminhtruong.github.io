import { b as bytesToHex, c as hexToBytes } from '../../toBytes-rCiiThej.js';
import '../../base-CC-Hj7CW.js';
import '../../size-CssOTqqV.js';

// * STRING
// ! WHY: stringToBytes from "viem" do NOT working with base64
// * wasm & socket working with base64 string
const stringToBytes = value => {
  const charCode = Array.from(value, m => m.codePointAt(0));
  return Uint8Array.from(charCode);
};
const bytesToString = bytes => {
  return Array.from(bytes, b => String.fromCodePoint(b)).join("");
};
// * BASE64
const bytesToBase64 = bytes => btoa(bytesToString(bytes));
const base64ToBytes = base64 => stringToBytes(atob(base64));
const base64ToHex = base64 => bytesToHex(base64ToBytes(base64));
const hexToBase64 = hex => bytesToBase64(hexToBytes(hex));
// * JSON
// ! WHY: wasm using base64 string for json
// TODO: should refactor
const bytesToJson = bytes => {
  const jsonInStr = bytesToString(bytes);
  return JSON.parse(jsonInStr);
};
const jsonToBytes = json => {
  const jsonInStr = JSON.stringify(json, null, 0);
  return stringToBytes(jsonInStr);
};

export { base64ToBytes, base64ToHex, bytesToBase64, bytesToJson, hexToBase64, jsonToBytes };
