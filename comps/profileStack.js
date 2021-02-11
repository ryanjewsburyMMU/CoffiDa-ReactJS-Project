import 'react-native-gesture-handler'
import { NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';
import { createStackNavigator } from '@react-navigation/stack';


import {Text, View, Button,TouchableOpacity} from 'react-native';

import Profile from './profile'
import SignUp from './signup'
import Login from './login'
import Profile_Details from './profile_details'
import App from './test_page'
import EditReview from './editReviewPage'

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
                <Stack.Screen name="Profile_Details" component={Profile_Details}/> 
                <Stack.Screen name="App" component={App}/> 
                <Stack.Screen name="EditReview" component={EditReview}/> 
            </Stack.Navigator>

        )
    }
}
