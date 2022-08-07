import { createSwitchNavigator, createAppContainer } from "react-navigation";

import LoadingScreen from "app/routes/Loading";
import UnauthenticatedNavigator from "./UnauthenticatedNavigator";
import AuthenticatedNavigator from "./AuthenticatedNavigator";

const AppNavigator = createSwitchNavigator(
  {
    loading: LoadingScreen,
    unauthenticated: UnauthenticatedNavigator,
    authenticated: AuthenticatedNavigator,
  },
  {
    initialRouteName: "loading",
  }
);

export default createAppContainer(AppNavigator);
