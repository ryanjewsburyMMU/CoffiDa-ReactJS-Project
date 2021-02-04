import 'react-native-gesture-handler'
import { NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator()

import Feed from './feed'

export default class FeedStack extends Component{
    render(){
        return(
            <Stack.Navigator>
                <Stack.Screen name="Feed" component={Feed}/> 
            </Stack.Navigator>

        )
    }
}