const testIDs = require('./testIDs');
const faker = require('faker');

const wait = (time) => new Promise(rs => setTimeout(rs, time));

describe('2. Newsfeed', () => {
  // it('1. should render newsfeed screen', async () => {
  //   await expect(element(by.id(testIDs.HOME.SCREEN))).toBeVisible();
  // });

  // it('1. should render newsfeed item', async () => {
  //   const itemID = `${testIDs.NEWSFEED.NEWSFEED_ITEM}-0`;
  //   await waitFor(element(by.id(itemID))).toBeVisible().withTimeout(2000);
  //   await expect(element(by.id(testIDs.NEWSFEED.IMAGE_AVATAR).withAncestor(by.id(itemID)))).toBeVisible();
  //   await expect(element(by.id(testIDs.NEWSFEED.TEXT_NAME).withAncestor(by.id(itemID)))).toBeVisible();
  //   await expect(element(by.id(testIDs.NEWSFEED.TEXT_CONTENT).withAncestor(by.id(itemID)))).toBeVisible();
  //   await expect(element(by.id(testIDs.NEWSFEED.BUTTON_LIKE).withAncestor(by.id(itemID)))).toBeVisible();
  //   await expect(element(by.id(testIDs.NEWSFEED.BUTTON_COMMENT).withAncestor(by.id(itemID)))).toBeVisible();
  //   await expect(element(by.id(testIDs.NEWSFEED.BUTTON_REPORT).withAncestor(by.id(itemID)))).toBeVisible();
  // });

  // it('1. should navigate to detail when press newsfeed item', async () => {
  //   const itemID = `${testIDs.NEWSFEED.NEWSFEED_ITEM}-0`;
  //   await element(by.id(itemID)).tapAtPoint({ x: 100, y: 60 });
  //   await expect(element(by.id(testIDs.NEWSFEED_DETAIL.SCREEN))).toBeVisible();
  //   await element(by.id('navigation-header')).tapAtPoint({ x: 50, y: 30 });
  // });
});
