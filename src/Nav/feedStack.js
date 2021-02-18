import 'react-native-gesture-handler'
import React, {Component} from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator()

import Feed from '../Comps/Screens/Main/feed'
import ReviewPage from '../Comps/Screens/Reviews/reviewPage'
import CreateReviewPage from '../Comps/Screens/Reviews/createReviewPage'
import CameraPage from '../Comps/Screens/Reviews/cameraPage'
import ViewPhoto from '../Comps/Screens/Reviews/viewPhoto'


export default class FeedStack extends Component{
    render(){
        return(
            <Stack.Navigator>
                <Stack.Screen name="Feed" component={Feed}/>
                <Stack.Screen name="ReviewPage" component={ReviewPage}/> 
                <Stack.Screen name="CreateReviewPage" component={CreateReviewPage}/> 
                <Stack.Screen name="CameraPage" component={CameraPage}/> 
                <Stack.Screen name="ViewPhoto" component={ViewPhoto}/> 
            </Stack.Navigator>

        )
    }
}