const ALGORITHM = {
  name: "RSA-OAEP",
  hash: "SHA-256"
};
const encodeArrayBufferToBase64 = arrayBuffer => {
  const binary = [];
  const bytes = new Uint8Array(arrayBuffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary.push(String.fromCharCode(bytes[i]));
  }
  return btoa(binary.join(""));
};
const decodeBase64ToArrayBuffer = encoded => {
  const data = atob(encoded);
  const len = data.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = data.charCodeAt(i);
  }
  return bytes.buffer;
};
const generateKeyPair = async () => {
  return window.crypto.subtle.generateKey({
    ...ALGORITHM,
    modulusLength: 4096,
    publicExponent: new Uint8Array([1, 0, 1])
  }, true, ["encrypt", "decrypt"]);
};
const stringifyKeyPair = async keys => {
  const [publicKeyBuffer, privateKeyBuffer] = await Promise.all([window.crypto.subtle.exportKey("spki", keys.publicKey), window.crypto.subtle.exportKey("pkcs8", keys.privateKey)]);
  const keyPair = {
    publicKey: encodeArrayBufferToBase64(publicKeyBuffer),
    privateKey: encodeArrayBufferToBase64(privateKeyBuffer)
  };
  return keyPair;
};
const decryptClientShard = async (encryptedShard, privateKey) => {
  const decryptedClientShard = await window.crypto.subtle.decrypt({
    name: ALGORITHM.name
  }, privateKey, decodeBase64ToArrayBuffer(encryptedShard));
  const clientShard = new TextDecoder().decode(decryptedClientShard);
  return clientShard;
};
const buildPrivateKey = async privateKey => {
  return window.crypto.subtle.importKey("pkcs8", decodeBase64ToArrayBuffer(privateKey), ALGORITHM, true, ["decrypt"]);
};

export { ALGORITHM, buildPrivateKey, decodeBase64ToArrayBuffer, decryptClientShard, encodeArrayBufferToBase64, generateKeyPair, stringifyKeyPair };
