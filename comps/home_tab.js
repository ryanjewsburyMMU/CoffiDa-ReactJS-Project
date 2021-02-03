import 'react-native-gesture-handler'
import { NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';

import {Text, View, Button,TouchableOpacity} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createDrawerNavigator} from '@react-navigation/drawer'
import Ionicons from 'react-native-vector-icons/Ionicons';


const Tab = createBottomTabNavigator()


export default class Home_Tab extends Component(){
    render(){
    return(
        <NavigationContainer>
            <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;

                    if (route.name == 'FeedStack'){
                        iconName = focused ? 'home' : 'home-outline'
                    }else if (route.name == 'Search'){
                        iconName = focused ? 'search' : 'search-outline'
                    }else if (route.name == 'CreatePostStack'){
                        iconName = focused ? 'create' : 'create-outline'
                    }

                    return <Ionicons name={iconName} size={size} color={color} />
                },
            })}
            tabBarOptions={{
                activeTintColor: '#eaca97',
                inactiveTintColor: 'gray'
                    }}
            >
                <Tab.Screen name="FeedStack" component={FeedStack}/>
                <Tab.Screen name="Search" component={SearchStack}/>
                <Tab.Screen name="CreatePostStack" component={CreatePostStack}/>

            </Tab.Navigator>
        </NavigationContainer>
    )
}}