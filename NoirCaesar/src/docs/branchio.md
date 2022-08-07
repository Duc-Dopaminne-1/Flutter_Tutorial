### - Handle deeplink & navigate screen when open BranchIO link.

### - Handle navigate screen when tapped on push notifications.

### Usage

- Subscribe & listen link opened(App in background by home pressed):

  ```
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
  ```

- Check when app open from background(Exit app completely):

  ```
  checkDeepLink = async (triggerHandle: (data: any) => void) => {
    const params = await branch.getLatestReferringParams();
    if (params) {
      // t is type of screen you want to navigate to
      // id is data identified in your screen navigate to
      triggerHandle(params);
    }
  };
  ```

- Navigate screen:
  Your Component. Ex: Home/index.js

  ```
  //Call in your component
  handleNavigateScreen = (data: any) => {
    NavigateLinkHandler.handleScreen(data.t, data.id);
  };
  ```

  NavigateLinkHandler.ts

  ```
  //Handle navigation screen
  handleScreen(screen: number, id: string) {
    if (screen == CHANNEL_DETAIL) {
      this.openChat(id);
    }
    //add others case here. EX: Open Shop, Open Comment,...
  }
  ```

  - Reader more here: https://github.com/BranchMetrics/react-native-branch-deep-linking-attribution
