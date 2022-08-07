

function waitForSubscription(query) {
  const subscription = query.subscribe();
  return new Promise((resolve, reject) => {
    subscription.addListener((sub, state) => {
      switch (state) {
        case Realm.Sync.SubscriptionState.Complete:
          subscription.removeAllListeners();
          resolve();
          break;
        case Realm.Sync.SubscriptionState.Error:
          subscription.removeAllListeners();
          reject();
          break;
      }
    });
  });
}

module.exports = {
  waitForSubscription
}