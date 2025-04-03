import { j as jwtDecode } from '../../../index-B3KPQWEG.js';
import { s as stringToBytes } from '../../../toBytes-rCiiThej.js';
import '../../../base-CC-Hj7CW.js';
import '../../../size-CssOTqqV.js';

const createDerivedKey = async (password, salt) => {
  const baseKey = await window.crypto.subtle.importKey("raw", password, {
    name: "PBKDF2"
  }, false, ["deriveKey"]);
  const derivedKey = await window.crypto.subtle.deriveKey({
    name: "PBKDF2",
    salt,
    iterations: 4096,
    hash: "SHA-256"
  }, baseKey, {
    name: "AES-GCM",
    length: 256
  }, true, ["encrypt", "decrypt"]);
  return derivedKey;
};
const DEFAULT_ISS = "https://athena.skymavis.com/";
const deriveKey = async (waypointToken, recoveryPassword) => {
  const {
    sub
  } = jwtDecode(waypointToken);
  const salt = stringToBytes(`${DEFAULT_ISS}:${sub}`);
  const password = stringToBytes(`${DEFAULT_ISS}:${sub}:${recoveryPassword}`);
  return await createDerivedKey(password, salt);
};

export { deriveKey };
