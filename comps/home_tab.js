import 'react-native-gesture-handler'
import { NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';

import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator()

import Feed from './feed'
import Search from './search'
import CreatePost from './createPost'


export default class Home_Tab extends Component{
    render(){
    return(
            <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;

                    if (route.name == 'Feed'){
                        iconName = focused ? 'home' : 'home-outline'
                    }else if (route.name == 'Search'){
                        iconName = focused ? 'search' : 'search-outline'
                    }else if (route.name == 'CreatePost'){
                        iconName = focused ? 'create' : 'create-outline'
                    }
                    return <Ionicons name={iconName} size={size} color={color}/>
                },


            })}
            tabBarOptions={{
                activeTintColor : '#eaca97',
                inactiveTintColor : 'gray'
            }}
            
            
            >
                <Tab.Screen name="Feed" component={Feed}/>
                <Tab.Screen name="Search" component={Search}/>
                <Tab.Screen name="CreatePost" component={CreatePost}/>

            </Tab.Navigator>
    )
}}
