import React from 'react';
import LoginScreen from '../screens/Login'
import HomeScreen from '../screens/Home'
import Colors from "../constants/Colors";
import CheckOutScreen from '../screens/CheckOut'
import OrdersScreen from '../screens/Orders'
import { Platform, SafeAreaView, Button, View } from 'react-native';
import OrderProductsScreen from '../screens/OrderProducts'


import {
    createSwitchNavigator,
    createAppContainer,
  } from 'react-navigation';
  import { createStackNavigator } from "react-navigation-stack";
import CartScreen from '../screens/Cart'
import { createDrawerNavigator } from 'react-navigation-drawer';
import { DrawerItems } from 'react-navigation-drawer';

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

const OrdersNavigator = createStackNavigator(
  {
    Orders: OrdersScreen,
    OrderProducts: OrderProductsScreen
  },
  {
      backgroundColor:Colors.primary,
  }
);


const ProfileNavigator = createDrawerNavigator({
    Auth: AuthNavigator,
    Orders: OrdersNavigator,
  },
  {
    contentOptions: {
      activeTintColor: 'blue'
    },
    contentComponent: props => {
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerItems {...props} />
            <Button
              title="Logout"
              color='blue'
              onPress={() => {
                // dispatch(authActions.logout());
                // props.navigation.navigate('Login')
              }}
            />
          </SafeAreaView>
        </View>
      );
    }
  }
)


  const MainNavigator = createSwitchNavigator({
    Auth:  ProfileNavigator,
  }
);



export default createAppContainer(MainNavigator);