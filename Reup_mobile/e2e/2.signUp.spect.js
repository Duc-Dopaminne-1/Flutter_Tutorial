const testIDs = require('./testIDs');
const faker = require('faker');

const wait = (time) => new Promise(rs => setTimeout(rs, time));

describe('2. Sign up', () => {

  // it('1. should render sign up screen', async () => {
  //   await element(by.id(testIDs.TABBAR.SETTING)).tap();
  //   await element(by.id(testIDs.SETTING.BUTTON_LOGOUT)).tap();
  //   await element(by.id(testIDs.WELCOME.BUTTON_SIGNUP)).tap();
  //   await expect(element(by.id(testIDs.SIGNUP.SCREEN))).toBeVisible();
  //   await expect(element(by.id(testIDs.SIGNUP.INPUT_FIRST_NAME))).toBeVisible();
  //   await expect(element(by.id(testIDs.SIGNUP.INPUT_LAST_NAME))).toBeVisible();
  //   await expect(element(by.id(testIDs.SIGNUP.INPUT_EMAIL))).toBeVisible();
  //   await expect(element(by.id(testIDs.SIGNUP.INPUT_PASSWORD))).toBeVisible();
  //   await expect(element(by.id(testIDs.SIGNUP.INPUT_CONFIRM_PASSWORD))).toBeVisible();
  //   await expect(element(by.id(testIDs.SIGNUP.BUTTON_SIGNUP))).toBeVisible();
  // });

  // it('2. should sign up success', async () => {
  //   const newEmail = faker.internet.email();
  //   await element(by.id(testIDs.SIGNUP.INPUT_FIRST_NAME)).typeText('Johnsonamy');
  //   await element(by.id(testIDs.SIGNUP.INPUT_LAST_NAME)).typeText('Wilson');
  //   await element(by.id(testIDs.SIGNUP.INPUT_EMAIL)).typeText('johnsonamy@wilson.com');
  //   await element(by.id(testIDs.SIGNUP.INPUT_PASSWORD)).typeText('12345678@X');
  //   await element(by.id(testIDs.SIGNUP.INPUT_CONFIRM_PASSWORD)).typeText('12345678@X');
  //   await element(by.id(testIDs.SIGNUP.BUTTON_SIGNUP)).tap();
  //   await element(by.id(testIDs.SIGNUP.BUTTON_SIGNUP)).tap();
  //   await expect(element(by.text('A user is already registered with this e-mail address.'))).toExist();
  //   await element(by.text('OK')).tap();
  //   await element(by.id(testIDs.SIGNUP.INPUT_EMAIL)).clearText();
  //   await element(by.id(testIDs.SIGNUP.INPUT_EMAIL)).typeText(newEmail);
  //   await element(by.id(testIDs.SIGNUP.INPUT_PASSWORD)).clearText();
  //   await element(by.id(testIDs.SIGNUP.INPUT_PASSWORD)).replaceText('12345678@X');
  //   await element(by.id(testIDs.SIGNUP.INPUT_CONFIRM_PASSWORD)).clearText();
  //   await element(by.id(testIDs.SIGNUP.INPUT_CONFIRM_PASSWORD)).replaceText('12345678@X');
  //   await element(by.id(testIDs.SIGNUP.BUTTON_SIGNUP)).tap();
  //   await expect(element(by.id(testIDs.ONBOARD.SCREEN))).toExist();
  //   await element(by.id(testIDs.ONBOARD.BUTTON_SKIP)).tap();
  //   await expect(element(by.id(testIDs.HOME.SCREEN))).toExist();
  // });
});
