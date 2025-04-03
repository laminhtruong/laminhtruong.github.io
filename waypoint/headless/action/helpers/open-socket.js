import { HeadlessClientError, HeadlessClientErrorCode } from '../../error/client.js';
import { FrameSchema } from '../../proto/rpc.js';
import { a as fromBinary } from '../../../file-8Ag42MRZ.js';
import '../../../enum-DxRJVtGK.js';

const DEFAULT_TIMEOUT = 20_000;
const openSocket = (url, timeout = DEFAULT_TIMEOUT) => {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    socket.binaryType = "arraybuffer";
    socket.onopen = () => {
      resolve(socket);
    };
    setTimeout(() => {
      reject(new HeadlessClientError({
        cause: undefined,
        code: HeadlessClientErrorCode.OpenSocketError,
        message: `Unable to open WebSocket with url="${url}". The connection has reached the timeout="${timeout}ms".`
      }));
    }, timeout);
  });
};
const createFrameQueue = socket => {
  const messageQueue = [];
  const messageQueueEvent = new EventTarget();
  const enqueueCallback = event => {
    messageQueue.push(new Uint8Array(event.data));
    messageQueueEvent.dispatchEvent(new Event("enqueue"));
  };
  socket.onmessage = enqueueCallback;
  const waitAndDequeue = (timeout = DEFAULT_TIMEOUT) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new HeadlessClientError({
          cause: undefined,
          code: HeadlessClientErrorCode.ListenSocketMessageError,
          message: `Unable to retrieve message from WebSocket. The progress has reached the timeout="${timeout}ms".`
        }));
      }, timeout);
      // * already have message in queue
      const first = messageQueue.shift();
      if (first !== undefined) {
        const stepFrame = fromBinary(FrameSchema, first);
        resolve(stepFrame);
        return;
      }
      // * listen for new message
      const onEnqueue = () => {
        const first = messageQueue.shift();
        if (first !== undefined) {
          messageQueueEvent.removeEventListener("enqueue", onEnqueue);
          const stepFrame = fromBinary(FrameSchema, first);
          resolve(stepFrame);
        }
      };
      messageQueueEvent.addEventListener("enqueue", onEnqueue);
    });
  };
  return {
    waitAndDequeue,
    messageQueue
  };
};

export { createFrameQueue, openSocket };
