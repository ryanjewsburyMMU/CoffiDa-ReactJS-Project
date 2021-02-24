/* eslint-disable react/jsx-filename-extension */
/* eslint-disable linebreak-style */
import 'react-native-gesture-handler'
import { NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer'
import AsyncStorage from '@react-native-async-storage/async-storage';
import login_temp from './comps/login_temp'
import Home_Tab from './src/Nav/home_tab'
import Settings from './src/Comps/Screens/Settings/settings'

import ProfileStack from './src/Nav/profileStack'

const Drawer = createDrawerNavigator();
export default class DB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false
    };
  }

  componentDidMount() {
    this.checkLoggedIn();
  }

  async checkLoggedIn() {
    if (await AsyncStorage.getItem("@session_token") === null) {
      this.setState({ signedIn: true })
    } else {
      this.setState({ signedIn: false })
    }
  }

  render() {
    return (
      <NavigationContainer>
        <Drawer.Navigator
        // initial={Home_Tab}
        // initialRouteName={this.state.signedIn ? ProfileStack : Home_Tab}
        // screenOptions={{ headerShown: false }}
        >
          <Drawer.Screen name="Home" component={Home_Tab} />
          <Drawer.Screen name="Profile" component={ProfileStack} />
          <Drawer.Screen name="Login" component={login_temp} />
          <Drawer.Screen name="Settings" component={Settings} />

        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
}