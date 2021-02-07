import 'react-native-gesture-handler'
import { NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';

import {Text, View, Button,TouchableOpacity} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createDrawerNavigator} from '@react-navigation/drawer'
import Ionicons from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from './comps/splashScreen'
import login_temp from './comps/login_temp'
import SignUp from './comps/signup'
import CreatePost from './comps/createPost'
import Home_Tab from './comps/home_tab'
import Profile from './comps/profile'
import Search from './comps/search'
import Feed from './comps/feed'
//import Login from './comps/login'

import ProfileStack from './comps/profileStack'

const Stack = createStackNavigator()

const OpenAppStack = createStackNavigator()

const Tab = createBottomTabNavigator()

const Drawer = createDrawerNavigator()


export default class DB extends Component{
	render(){
		return(
            <NavigationContainer>
                <Drawer.Navigator>
                    <Drawer.Screen name="Home" component={Home_Tab}/>
                    <Drawer.Screen name="Profile" component={ProfileStack}/>
                    <Drawer.Screen name="Settings" component={Settings}/>
                    <Drawer.Screen name="Login" component={login_temp}/>
                </Drawer.Navigator>
                </NavigationContainer>
	)}
}







class Settings extends Component{

    async testFunction(){
        const token = await AsyncStorage.getItem('@session_token')

        console.log("token is === " + token)

        if (token === null) {
          console.log("empty")
        } else {
          console.log("Not empty")
        }
    }
	render(){
		return(
            <View>
            <Button title="Test Async" onPress={() => this.testFunction()} ></Button>
            </View>
	)}
}

