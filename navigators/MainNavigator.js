import LoginScreen from '../screens/Login'
import HomeScreen from '../screens/Home'
import Colors from "../constants/Colors";
import CheckOutScreen from '../screens/CheckOut'

import {
    createSwitchNavigator,
    createAppContainer,
  } from 'react-navigation';
  import { createStackNavigator } from "react-navigation-stack";
import CartScreen from '../screens/Cart'

const AuthNavigator = createStackNavigator(
    {
      // Login: LoginScreen,
      Home: HomeScreen,
      Cart: CartScreen,
      CheckOut: CheckOutScreen,
    },
    {
        backgroundColor:Colors.primary,
    }
);

  const MainNavigator = createSwitchNavigator({
    Auth:  AuthNavigator,
  }
);

export default createAppContainer(MainNavigator);