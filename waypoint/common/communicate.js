import { Deferred } from './defer.js';
import { normalizeWaypointError, WaypointErrorMap } from './waypoint-error.js';
import { v as v4 } from '../v4-CU-e4i5S.js';
import '../rpc-BGk0htDU.js';
import '../base-CC-Hj7CW.js';

const DELAY_INTERVAL = 1_000;
class CommunicateHelper {
  pendingEvents = new Map();
  windowMonitorIntervals = new Map();
  origin;
  eventHandler;
  constructor(origin) {
    if (typeof window === "undefined") {
      // eslint-disable-next-line no-console
      console.warn("CommunicateHelper can only be used in browser environment");
      return;
    }
    this.origin = origin;
    this.eventHandler = this.createEventHandler();
    this.initializeEventListeners();
  }
  createEventHandler() {
    return event => {
      if (event.origin !== this.origin) return;
      const callbackMessage = event.data;
      if (!this.isValidCallbackMessage(callbackMessage)) return;
      this.handleResponse(callbackMessage);
    };
  }
  isValidCallbackMessage(message) {
    return typeof message === "object" && message !== null && "state" in message && "type" in message;
  }
  initializeEventListeners() {
    window.addEventListener("message", this.eventHandler);
    window.addEventListener("beforeunload", () => {
      this.cleanup();
    });
  }
  handleResponse(message) {
    const {
      state: requestId,
      type
    } = message;
    const deferredPromise = this.pendingEvents.get(requestId);
    const monitorInterval = this.windowMonitorIntervals.get(requestId);
    if (!deferredPromise || !(typeof deferredPromise !== "function")) return;
    if (monitorInterval) {
      this.windowMonitorIntervals.delete(requestId);
      clearInterval(monitorInterval);
    }
    this.pendingEvents.delete(requestId);
    switch (type) {
      case "fail":
        {
          const err = normalizeWaypointError(message.error);
          return deferredPromise.reject(err);
        }
      default:
        {
          const objectOrStringData = this.parseSuccessResponse(message.data);
          return deferredPromise.resolve(objectOrStringData);
        }
    }
  }
  parseSuccessResponse(data) {
    try {
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch {
      return data;
    }
  }
  monitorWindowClosing(params) {
    const {
      requestId,
      window: targetWindow
    } = params;
    const monitorInterval = setInterval(() => {
      if (targetWindow?.closed && this.hasPendingRequest(requestId)) {
        this.handleResponse({
          state: requestId,
          type: "fail",
          error: WaypointErrorMap.WALLET_USER_CANCEL
        });
      }
    }, DELAY_INTERVAL);
    this.windowMonitorIntervals.set(requestId, monitorInterval);
  }
  hasPendingRequest(requestId) {
    return this.pendingEvents.has(requestId) && this.windowMonitorIntervals.has(requestId);
  }
  sendRequest(action) {
    const id = v4();
    const responseHandler = new Deferred();
    this.pendingEvents.set(id, responseHandler);
    const referencedWindow = action(id);
    if (referencedWindow) {
      this.monitorWindowClosing({
        window: referencedWindow,
        requestId: id
      });
    }
    return responseHandler.promise;
  }
  cleanup() {
    window.removeEventListener("message", this.eventHandler);
    this.windowMonitorIntervals.forEach(interval => clearInterval(interval));
    this.windowMonitorIntervals.clear();
    this.pendingEvents.clear();
  }
}

export { CommunicateHelper };
