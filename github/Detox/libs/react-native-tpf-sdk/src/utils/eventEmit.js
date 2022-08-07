import { TpfSdkClient } from '../../';

export function emitEvent(obj) {
  try {
    TpfSdkClient?.eventHandlers?.onEventChange(obj);
  } catch (err) {}
}
