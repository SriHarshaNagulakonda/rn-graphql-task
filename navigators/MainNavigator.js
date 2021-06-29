import LoginScreen from '../screens/Login'
import VerifyScreen from '../screens/Verify'

import {
    createSwitchNavigator,
    createAppContainer,
  } from 'react-navigation';
  import { createStackNavigator } from "react-navigation-stack";

const AuthNavigator = createStackNavigator(
    {
      Login: LoginScreen,
      Verify: VerifyScreen,
    },
    {
        navigationOptions:{
            headerShown: false,
        }
    }
);

  const MainNavigator = createSwitchNavigator({
    Auth:  AuthNavigator,
  }
);

export default createAppContainer(MainNavigator);