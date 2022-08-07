import moment from 'moment';

export class PageObject extends Object {
  constructor(
    page_name,
    page_code,
    create_date,
    release_date,
    duration,
    nextScreen,
    topenId,
    deviceName
  ) {
    super();
    this.page_name = page_name || '';
    this.page_code = page_code || '';
    this.create_date = create_date || moment().format();
    this.release_date = release_date || moment().format();
    this.duration = duration || 0;
    this.nextScreen = nextScreen || '';
    this.deviceId = deviceName || '';
    this.topenId = topenId || '';
  }
}
