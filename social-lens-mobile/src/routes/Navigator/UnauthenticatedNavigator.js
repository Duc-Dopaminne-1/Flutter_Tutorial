import { createStackNavigator } from 'react-navigation-stack';

import LoginScreen from 'app/routes/Authentication/Login';
import PasswordResetScreen from 'app/routes/Authentication/PasswordReset';
import SignupScreen from 'app/routes/Authentication/Signup';
import VerificationScreen from 'app/routes/Authentication/Verification';
import SetProfileScreen from 'app/routes/Authentication/Profile';

export default createStackNavigator(
  {
    login: {
      screen: LoginScreen
    },
    signup: {
      screen: SignupScreen
    },
    verification: {
      screen: VerificationScreen
    },
    reset: {
      screen: PasswordResetScreen
    },
    setprofile: {
      screen: SetProfileScreen
    }
  },
  {
    headerMode: 'none',
    initialRouteName: 'login'
  }
);