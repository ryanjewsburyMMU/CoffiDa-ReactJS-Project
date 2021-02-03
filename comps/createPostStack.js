import 'react-native-gesture-handler'
import { NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';
import { createStackNavigator } from '@react-navigation/stack';


import {Text, View, Button,TouchableOpacity} from 'react-native';

import CreatePost from '/comps/createPost'

const Stack = createStackNavigator()

class CreatePostStack extends Component{
    render(){
        return(
            <Stack.Navigator>
                <Stack.Screen name="CreatePost" component={CreatePost}/> 
            </Stack.Navigator>

        )
    }
}