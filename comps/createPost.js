import 'react-native-gesture-handler'
import React, {Component} from 'react';

import {Text, View} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default class CreatePost extends Component{
	render(){
        const navigation = this.props.navigation;
		return(
            <View>
                <Text>CreatePost</Text>
                <Button title="Go to details" onPress={() => navigation.navigate('CreatePost_Details')}/>
            </View>
	)}
}

