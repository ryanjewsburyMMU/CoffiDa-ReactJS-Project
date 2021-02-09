import 'react-native-gesture-handler'
import { NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator()

import Feed from './feed'
import ReviewPage from './reviewPage'
import CreateReviewPage from './createReviewPage'

export default class FeedStack extends Component{
    render(){
        return(
            <Stack.Navigator>
                <Stack.Screen name="Feed" component={Feed}/> 
                <Stack.Screen name="ReviewPage" component={ReviewPage}/> 
                <Stack.Screen name="CreateReviewPage" component={CreateReviewPage}/> 
            </Stack.Navigator>

        )
    }
}