import 'react-native-gesture-handler'
import { NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';
import { createStackNavigator } from '@react-navigation/stack';


import {Text, View, Button,TouchableOpacity} from 'react-native';

import Profile from './profile'
import SignUp from './signup'
import Login from './login'


const Stack = createStackNavigator()

export default class ProfileStack extends Component{
    render(){
        return(
            <Stack.Navigator 
            screenOptions={{
                headerShown: false
              }}>
                <Stack.Screen name="Profile" component={Profile}/> 
                <Stack.Screen name="SignUp" component={SignUp}/> 
                <Stack.Screen name="Login" component={Login}/> 
            </Stack.Navigator>

        )
    }
}
