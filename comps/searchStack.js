import 'react-native-gesture-handler'
import { NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator()

import Search from './search'

export default class SearchStack extends Component{
    render(){
        return(
            <Stack.Navigator>
                <Stack.Screen name="Search" component={Search}/> 
            </Stack.Navigator>

        )
    }
}