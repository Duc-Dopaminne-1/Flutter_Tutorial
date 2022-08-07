import moment from 'moment';

export class ActionObject extends Object {
  constructor({
    route_name: screen_name,
    event_name: action_name,
    component,
    coordinate,
    topenId,
    deviceName
  }) {
    super();
    this.screen_name = screen_name || '';
    this.action_name = action_name || '';
    // this.coordinate = Array.isArray(coordinate)
    //   ? coordinate.join()
    //   : typeof coordinate === 'object'
    //   ? JSON.stringify(coordinate)
    //   : coordinate;
    this.component = component || '';
    this.create_date = moment().format();
    this.release_date = moment().format();
    this.topenId = topenId;
    this.deviceId = deviceName || '';
  }
}

export class ItemActionObject extends ActionObject {
  constructor({ route_name, event_name, component, coordinate, item, topenId }) {
    super({ route_name, event_name, component, coordinate, topenId });
    this.item = item || '';
  }
}
