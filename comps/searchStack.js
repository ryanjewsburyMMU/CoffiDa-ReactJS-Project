import 'react-native-gesture-handler'
import { NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';

import {Text, View, Button,TouchableOpacity} from 'react-native';


export default class SearchStack extends Component{
    render(){
        return(
            <Stack.Navigator>
                <Stack.Screen name="Search" component={Search}/> 
            </Stack.Navigator>

        )
    }
}