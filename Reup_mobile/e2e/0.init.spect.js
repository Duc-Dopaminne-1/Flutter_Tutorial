const testIDs = require('./testIDs');
const faker = require('faker');

const wait = (time) => new Promise(rs => setTimeout(rs, time));

describe('0. App init - welcome screen', () => {
  before(async () => {
    await device.launchApp({permissions: {
      notifications: 'YES',
      contacts: 'YES',
    }});
  });

  beforeEach(async () => {
    // await device.reloadReactNative();
  });

  it('1. should render welcome screen', async () => {
    await expect(element(by.id(testIDs.WELCOME.SCREEN))).toBeVisible();
    await expect(element(by.id(testIDs.WELCOME.IMAGE_LOGO))).toBeVisible();
    await expect(element(by.id(testIDs.WELCOME.TEXT_WELCOME))).toBeVisible();
    await expect(element(by.id(testIDs.WELCOME.BUTTON_LOGIN))).toBeVisible();
    await expect(element(by.id(testIDs.WELCOME.BUTTON_SIGNUP))).toBeVisible();
  });
});
