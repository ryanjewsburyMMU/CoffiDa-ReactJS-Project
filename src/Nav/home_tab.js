import 'react-native-gesture-handler'
import { NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';

import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons';



const Tab = createBottomTabNavigator()

import FeedStack from './feedStack'
import Search from '../Comps/Screens/Main/search'
import NearMe from '../Comps/Screens/Main/nearMe'


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
                    }else if (route.name == 'Near Me'){
                        iconName = focused ? 'radio' : 'radio-outline'
                    }
                    return <Ionicons name={iconName} size={size} color={color}/>
                },
                navigationOptions: { safeAreaInsets: { top: 0 } }


            })}
            tabBarOptions={{
                activeTintColor : '#eaca97',
                inactiveTintColor : 'gray'
            }}
            >
                <Tab.Screen name="Feed" component={FeedStack}/>
                <Tab.Screen name="Search" component={Search}/>
                <Tab.Screen name="Near Me" component={NearMe}/>


            </Tab.Navigator>
    )
}}
