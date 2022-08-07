const testIDs = require('./testIDs');

describe('5. Shop Cart', () => {
  it('1. should render Shop Cart screen', async () => {
    await element(by.id(testIDs.TABBAR.SHOP)).tap();
    await element(by.id(testIDs.SHOP.CART.ICON)).tap();
    await expect(element(by.id(testIDs.SHOP.CART.SCREEN))).toBeVisible();
    await element(by.id('TOP_BAR')).tapAtPoint({ x: 10, y: 10 });
  });

  it('2. should add up Shop Cart item with same product', async () => {
    await element(by.id(testIDs.SHOP.BANNER)).tap();
    await element(by.id(`${testIDs.SHOP.CART.PRODUCT}_6`)).tap();
    await element(by.id(testIDs.SHOP.CART.PRODUCT_SCROLL_VIEW)).scrollTo('bottom');
    await element(by.id(testIDs.SHOP.CART.ADD)).tap();
    await element(by.id(testIDs.SHOP.CART.ADD_PRODUCT_SCREEN)).tapAtPoint({x: 180, y: 440});
    await element(by.id(testIDs.SHOP.CART.ADD)).tap();
    await element(by.id(testIDs.SHOP.CART.ADD_PRODUCT_SCREEN)).tapAtPoint({x: 180, y: 440});
    await element(by.id(testIDs.SHOP.CART.BACK)).tap();
    await element(by.id(testIDs.SHOP.CART.ICON)).tap();
    await expect(element(by.id(`${testIDs.SHOP.CART.SWIPE_ITEM}_0`))).toBeVisible();
    await expect(element(by.id(`${testIDs.SHOP.CART.QUANTITY}_0`))).toHaveText('2');
  });

  it('3. should add and subtract product quantity', async () => {
    await element(by.id(`${testIDs.SHOP.CART.ADD_QUANTITY}_0`)).tap();
    await element(by.id(`${testIDs.SHOP.CART.ADD_QUANTITY}_0`)).tap();
    await expect(element(by.id(`${testIDs.SHOP.CART.QUANTITY}_0`))).toHaveText('4');
    
    await element(by.id(`${testIDs.SHOP.CART.SUBTRACT_QUANTITY}_0`)).tap();
    await element(by.id(`${testIDs.SHOP.CART.SUBTRACT_QUANTITY}_0`)).tap();
    await expect(element(by.id(`${testIDs.SHOP.CART.QUANTITY}_0`))).toHaveText('2');
  });

  it('4. should delete product item', async () => {
    await element(by.id(`${testIDs.SHOP.CART.SWIPE_ITEM}_0`)).swipe('left', 'slow', 0.5);
    await element(by.id(`${testIDs.SHOP.CART.SWIPE_ITEM_CANCEL}_0`)).tap();
    await expect(element(by.id(`${testIDs.SHOP.CART.SWIPE_ITEM}_0`))).toBeNotVisible();
    await expect(element(by.id(testIDs.SHOP.CART.SUBTOTAL))).toHaveText('$0');
    await element(by.id('TOP_BAR')).tapAtPoint({ x: 10, y: 10 });
  });

  it('5. should add different product item', async () => {
    await element(by.id(`${testIDs.SHOP.CART.PRODUCT}_0`)).tap();
    await element(by.id(testIDs.SHOP.CART.PRODUCT_SCROLL_VIEW)).scrollTo('bottom');
    await element(by.id(testIDs.SHOP.CART.ADD)).tap();
    await element(by.id(testIDs.SHOP.CART.ADD_PRODUCT_SCREEN)).tapAtPoint({x: 180, y: 440});
    await element(by.id(testIDs.SHOP.CART.BACK)).tap();

    await element(by.id(`${testIDs.SHOP.CART.PRODUCT}_2`)).tap();
    await element(by.id(testIDs.SHOP.CART.PRODUCT_SCROLL_VIEW)).scrollTo('bottom');
    await element(by.id(testIDs.SHOP.CART.ADD)).tap();
    await element(by.id(testIDs.SHOP.CART.ADD_PRODUCT_SCREEN)).tapAtPoint({x: 180, y: 440});
    await element(by.id(testIDs.SHOP.CART.BACK)).tap();

    await element(by.id(`${testIDs.SHOP.CART.PRODUCT}_3`)).tap();
    await element(by.id(testIDs.SHOP.CART.PRODUCT_SCROLL_VIEW)).scrollTo('bottom');
    await element(by.id(testIDs.SHOP.CART.ADD)).tap();
    await element(by.id(testIDs.SHOP.CART.ADD_PRODUCT_SCREEN)).tapAtPoint({x: 180, y: 440});
    await element(by.id(testIDs.SHOP.CART.BACK)).tap();

    await element(by.id(testIDs.SHOP.CART.ICON)).tap();
    await element(by.id(`${testIDs.SHOP.CART.SWIPE_ITEM}_0`)).swipe('left', 'slow', 0.5);
    await element(by.id(`${testIDs.SHOP.CART.SWIPE_ITEM_CANCEL}_0`)).tap();
    await expect(element(by.id(`${testIDs.SHOP.CART.SWIPE_ITEM}_2`))).toBeNotVisible();

    await element(by.id(testIDs.SHOP.CART.CHECK_OUT)).tap();
    await element(by.id(testIDs.SHOP.CART.SCREEN)).tapAtPoint({x: 180, y: 340});
    await expect(element(by.id(testIDs.SHOP.CART.SUBTOTAL))).toHaveText('$0');
  });
});
