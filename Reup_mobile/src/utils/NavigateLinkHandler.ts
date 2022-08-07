import NavigationActionsService from "@src/navigation/navigation";
import { HOME_TENANT, NOTIFICATIONS, NOTIFICATIONS_TENANT, MAIN_SCREEN, MAIN_SCREEN_TENANT } from "@src/constants/screenKeys";
import { isManagerApp } from "@utils/index";

export enum screenCode {
  NOTIFICATION_SCREEN = "1"
};


class NavigateLinkHandler {
  handleScreen(
    screen?: string,
    my_id?: string,
    company_id?: string,
  ) {
    if (isManagerApp()) {
      if (screen === screenCode.NOTIFICATION_SCREEN) {
        NavigationActionsService.setRoot(MAIN_SCREEN);
        NavigationActionsService.push(NOTIFICATIONS);
      }
    } else {
      if (screen === screenCode.NOTIFICATION_SCREEN) {
        NavigationActionsService.setRoot(MAIN_SCREEN_TENANT);
        NavigationActionsService.push(NOTIFICATIONS_TENANT);
      }
    }
  }
}

export default new NavigateLinkHandler();
