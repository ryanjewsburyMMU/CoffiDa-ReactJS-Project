import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import HomeTab from './homeTab';
import Settings from '../Comps/Screens/Settings/settings';
import ProfileStack from './profileStack';

const Drawer = createDrawerNavigator();

export default class MainNav extends Component {
  render() {
    return (
      <NavigationContainer>
        <Drawer.Navigator
          detachInactiveScreens
        >
          <Drawer.Screen name="Home" component={HomeTab} />
          <Drawer.Screen name="Profile" component={ProfileStack} />
          <Drawer.Screen name="Settings" component={Settings} />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
}
