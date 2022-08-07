import branch from 'react-native-branch';

class DeepLinkListener {
  constructor(triggerHandle: (data: any) => void) {
    branch.skipCachedEvents();
    branch.initSessionTtl = 10000;
    this.init(triggerHandle);
    this.checkDeepLink(triggerHandle);
  }

  checkDeepLink = async (triggerHandle: (data: any) => void) => {
    const params = await branch.getLatestReferringParams();
    if (params) {
      // t is type of screen you want to navigate to
      // id is data identified in your screen navigate to
      triggerHandle(params);
    }
  };

  init(triggerHandle: (data: any) => void) {
    branch.subscribe(({ error, params }: { error: any; params: any }) => {
      if (error) {
        return;
      }
      if (params) {
        // t is type of screen you want to navigate to
        // id is data identified in your screen navigate to
        triggerHandle(params);
      }
    });
  }
}

export default DeepLinkListener;
