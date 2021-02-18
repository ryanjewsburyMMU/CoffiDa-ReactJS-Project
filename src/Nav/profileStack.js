import 'react-native-gesture-handler'
import { NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';
import { createStackNavigator } from '@react-navigation/stack';


import {Text, View, Button,TouchableOpacity} from 'react-native';

import Profile from '../Comps/Screens/Profile/profile'
import SignUp from '../Comps/Screens/Profile/signup'
import Login from '../Comps/Screens/Profile/login'
import Profile_Details from '../Comps/Screens/Profile/profile_details'
import App from '../Comps/Screens/Profile/test_page'
import EditReview from '../Comps/Screens/Profile/editReviewPage'
import FavouriteLocations from '../Comps/Screens/Profile/favouriteLocations'

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
                <Stack.Screen name="FavouriteLocations" component={FavouriteLocations}/> 
            </Stack.Navigator>

        )
    }
}
