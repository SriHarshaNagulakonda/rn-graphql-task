import LoginScreen from '../screens/Login'
import HomeScreen from '../screens/Home'

import {
    createSwitchNavigator,
    createAppContainer,
  } from 'react-navigation';
  import { createStackNavigator } from "react-navigation-stack";

const AuthNavigator = createStackNavigator(
    {
      // Login: LoginScreen,
      Home: HomeScreen,
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