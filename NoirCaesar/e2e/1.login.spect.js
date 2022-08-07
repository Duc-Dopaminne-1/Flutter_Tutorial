const testIDs = require('./testIDs');
const faker = require('faker');

const wait = (time) => new Promise(rs => setTimeout(rs, time));

describe('1. Login', () => {
  it('1. should render login screen', async () => {
    await element(by.id(testIDs.WELCOME.BUTTON_LOGIN)).tap();
    await expect(element(by.id(testIDs.LOGIN.SCREEN))).toBeVisible();
    await expect(element(by.id(testIDs.LOGIN.IMAGE_LOGO))).toBeVisible();
    await expect(element(by.id(testIDs.LOGIN.TEXT_LOGIN))).toBeVisible();
    await expect(element(by.id(testIDs.LOGIN.INPUT_USERNAME))).toBeVisible();
    await expect(element(by.id(testIDs.LOGIN.INPUT_PASSWORD))).toBeVisible();
    await expect(element(by.id(testIDs.LOGIN.BUTTON_LOGIN))).toBeVisible();
  });

  it('2. should login success', async () => {
    await element(by.id(testIDs.LOGIN.INPUT_USERNAME)).typeText('johnsonamy@wilson.com');
    await element(by.id(testIDs.LOGIN.INPUT_PASSWORD)).typeText('12345678@X');
    await element(by.id(testIDs.LOGIN.BUTTON_LOGIN)).tap();
    await element(by.id(testIDs.LOGIN.BUTTON_LOGIN)).tap();
    await expect(element(by.id(testIDs.ONBOARD.SCREEN))).toExist();
    await element(by.id(testIDs.ONBOARD.BUTTON_SKIP)).tap();
    await expect(element(by.id(testIDs.HOME.SCREEN))).toExist();
  });
});
