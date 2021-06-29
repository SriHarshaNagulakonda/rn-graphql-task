import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainNavigator from './navigators/MainNavigator';

export default function App() {
  return (
    // <View>
      <MainNavigator />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:    '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
