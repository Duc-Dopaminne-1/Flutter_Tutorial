import { Platform, EmitterSubscription, AlertButton, AlertOptions } from 'react-native';
import {
  initConnection,
  purchaseUpdatedListener,
  purchaseErrorListener,
  PurchaseError,
  finishTransaction,
  InAppPurchase,
  SubscriptionPurchase,
  requestPurchase,
  requestSubscription,
  endConnection,
  getProducts,
  getSubscriptions,
  getAvailablePurchases,
  consumeAllItemsAndroid,
} from 'react-native-iap';
import store from '@src/redux/store';
import { getListIAPProduct, getActivePlan, getListIAPSubscription, doUpdateSubscription, doBuyCoins } from './actions';
import NavigationActionsService from '@src/navigation/navigation';
import {
  ICoinsPackage,
  ICoinsPackageProvider,
  ISubscriptionPackage,
  ISubscriptionPackageProvider,
  ISubscription,
} from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { SubscriptionProviderEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop';
import translate from '@src/localize';
import moment from 'moment';
import { IError } from '../base';

export type IPurchase = InAppPurchase | SubscriptionPurchase;

export class IAPService {
  private static _instance: IAPService;

  private purchaseUpdateSubscription?: EmitterSubscription;
  private purchaseErrorSubscription?: EmitterSubscription;
  private latestAvailablePurchase?: IPurchase;
  private purchaseInProcess = false;
  private buyCoinPkgId = '';

  private constructor() {}

  static getInstance(): IAPService {
    if (!IAPService._instance) {
      IAPService._instance = new IAPService();
    }
    return IAPService._instance;
  }

  async initService() {
    try {
      const initSuccess = await initConnection();
      if (initSuccess) {
        this.fetchProducts();
        this.registerPurchaseEventListener();
      }
    } catch (error) {
      console.log('IAPService.initService(): error=', error);
    }
  }

  removeService() {
    this.unRegisterPurchaseEventListener();
  }

  async tryRestorePurchaseIfNeed() {
    if (this.purchaseInProcess) return;

    try {
      const listPurchase = await getAvailablePurchases();
      if (listPurchase && listPurchase.length > 0) {
        listPurchase.sort((p1, p2) => p2.transactionDate - p1.transactionDate);
        const purchase = listPurchase[0];
        this.latestAvailablePurchase = purchase;

        const subscriptions = store.getState().iap.subscriptions;
        let subscriptionPlan: ISubscriptionPackage | undefined;
        subscriptions.some((sub: ISubscriptionPackage) => {
          if (sub.providers.filter((pvd: ISubscriptionPackageProvider) => pvd.provider_id === purchase.productId).length > 0) {
            subscriptionPlan = sub;
            return true;
          }
        });
        if (subscriptionPlan) {
          const { month } = subscriptionPlan;
          const nextTime = moment()
            .add(month, 'M')
            .valueOf();
          if (nextTime > moment().valueOf()) {
            this.showRestorePurchaseAlert();
          }
        }
      }
    } catch (error) {
      console.log('IAPService.tryRestorePurchaseIfNeed(): fail with error=', error);
    }
  }

  doRestorePurchase() {
    const { latestAvailablePurchase } = this;
    if (latestAvailablePurchase) {
      const { productId } = latestAvailablePurchase;
      const provider = Platform.OS === 'ios' ? SubscriptionProviderEnum.iOS : SubscriptionProviderEnum.Android;
      store.dispatch(
        doUpdateSubscription({
          data: {
            subscription_package_id: productId,
            provider: provider,
            provider_id: productId,
            payload: latestAvailablePurchase,
          },
          onFail: (error?: IError) => {
            NavigationActionsService.showErrorPopup(error);
          },
        }),
      );
    }
  }

  onPurchaseProcess() {
    this.purchaseInProcess = true;
    NavigationActionsService.showLoading();
  }

  onPurchaseDone() {
    this.purchaseInProcess = false;
    this.buyCoinPkgId = '';
    NavigationActionsService.hideLoading();
  }

  fetchProducts() {
    this.getListCoins();
    this.getListSubscription();
    this.getActivePlan();
  }

  getListCoins() {
    store.dispatch(
      getListIAPProduct({
        onSuccess: (coinsPackage: ICoinsPackage[]) => {
          const listProviders = coinsPackage.map((pk: ICoinsPackage) => {
            const provider = pk.providers.filter((provider: ICoinsPackageProvider) => {
              return provider.provider === Platform.OS;
            })[0];
            return provider;
          });
          const listProductsId = listProviders.map((provider: ICoinsPackageProvider) => {
            return provider.provider_id;
          });
          getProducts(listProductsId);
        },
      }),
    );
  }

  getListSubscription() {
    store.dispatch(
      getListIAPSubscription({
        onSuccess: (subscriptionsPackage: ISubscriptionPackage[]) => {
          const listProviders = subscriptionsPackage.map((pk: ISubscriptionPackage) => {
            const provider = pk.providers.filter((provider: ISubscriptionPackageProvider) => {
              return provider.provider === Platform.OS;
            })[0];
            return provider;
          });
          const listSubscriptionsId = listProviders.map((provider: ISubscriptionPackageProvider) => {
            return provider.provider_id;
          });
          getSubscriptions(listSubscriptionsId);
        },
      }),
    );
  }

  getActivePlan() {
    store.dispatch(
      getActivePlan({
        onSuccess: (activePlan: ISubscription) => {
          if (!activePlan.subscription) {
            this.tryRestorePurchaseIfNeed();
          }
        },
      }),
    );
  }

  async doRequestPurchase(productId: string, pkgId: string) {
    if (this.purchaseInProcess) return;
    try {
      this.buyCoinPkgId = pkgId;
      this.onPurchaseProcess();
      requestPurchase(productId);
    } catch (error) {
      this.onPurchaseDone();
      console.log('IAPService.doRequestPurchase(): failed with error=', error);
    }
  }

  async doRequestSubscription(productId: string) {
    if (this.purchaseInProcess) return;
    try {
      this.onPurchaseProcess();
      requestSubscription(productId);
    } catch (error) {
      this.onPurchaseDone();
      console.log('IAPService.doRequestPurchase(): failed with error=', error);
    }
  }

  async handlePurchase(purchase: IPurchase) {
    console.log('IAPService.handlePurchase(): purchaser=', purchase);
    const { productId, transactionReceipt } = purchase;
    if (transactionReceipt) {
      await finishTransaction(purchase);

      const provider = Platform.OS === 'ios' ? SubscriptionProviderEnum.iOS : SubscriptionProviderEnum.Android;
      const isSubscriptionPurchase = purchase.productId.includes('subscription');
      if (isSubscriptionPurchase) {
        store.dispatch(
          doUpdateSubscription({
            data: {
              subscription_package_id: productId,
              provider: provider,
              provider_id: productId,
              payload: purchase,
            },
            onSuccess: () => {
              this.onPurchaseDone();
            },
            onFail: () => {
              this.onPurchaseDone();
            },
          }),
        );
      } else {
        store.dispatch(
          doBuyCoins({
            data: {
              coin_package_id: this.buyCoinPkgId,
              provider: provider,
              provider_id: productId,
              payload: purchase,
            },
            onSuccess: () => {
              this.onPurchaseDone();
            },
            onFail: err => {
              this.onPurchaseDone();
            },
          }),
        );
        await consumeAllItemsAndroid();
      }
    }
  }

  handlePurchaseError(error: PurchaseError) {
    const { code, responseCode, message } = error;
    switch (code) {
      case 'E_ALREADY_OWNED':
        this.showRestorePurchaseAlert();
        break;
      case 'E_UNKNOWN':
        this.showErrorAlert(message);
        break;
    }
  }

  registerPurchaseEventListener() {
    this.purchaseUpdateSubscription = purchaseUpdatedListener((purchase: IPurchase) => {
      this.purchaseInProcess = true;
      this.handlePurchase(purchase);
    });

    this.purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
      console.log('IAPService.purchaseErrorListener(): error=', error);
      this.onPurchaseDone();
      if (error) {
        this.handlePurchaseError(error);
      }
    });
  }

  unRegisterPurchaseEventListener() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = undefined;
    }

    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = undefined;
    }

    endConnection();
  }

  showRestorePurchaseAlert() {
    setTimeout(() => {
      NavigationActionsService.showCustomPopup({
        text: translate('subscription.re_subscribe_message'),
        buttonRedTitle: translate('global.yes'),
        buttonGrayTitle: translate('global.cancel'),
        onPressRedButton: () => {
          NavigationActionsService.hideCustomPopup();
          this.doRestorePurchase();
        },
      });
    }, 300);
  }

  showErrorAlert(message?: string) {
    setTimeout(() => {
      message &&
        NavigationActionsService.showCustomPopup({
          text: message,
          buttonRedTitle: translate('alert.ok'),
        });
    }, 300);
  }
}
