const STORAGE_ADDRESS_KEY = "ADDRESS";
const STORAGE_SHARD_TRANSFER_KEY = "SHARD_TRANSFER";
const STORAGE_PREFIX = "RONIN.WAYPOINT";
const isStorageAvailable = () => typeof window !== "undefined" && "localStorage" in window;
const getStorage = name => isStorageAvailable() && localStorage.getItem(`${STORAGE_PREFIX}:${name}`);
const setStorage = (name, value) => isStorageAvailable() && localStorage.setItem(`${STORAGE_PREFIX}:${name}`, value);
const removeStorage = name => isStorageAvailable() && localStorage.removeItem(`${STORAGE_PREFIX}:${name}`);

export { STORAGE_ADDRESS_KEY, STORAGE_PREFIX, STORAGE_SHARD_TRANSFER_KEY, getStorage, removeStorage, setStorage };
