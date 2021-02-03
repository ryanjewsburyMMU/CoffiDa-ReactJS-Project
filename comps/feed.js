import 'react-native-gesture-handler'
import React, {Component} from 'react';

import {Text, View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default class Feed extends Component{
	render(){
        const icon = <Ionicons name="md-menu" size={50} color="#eaca97" />;

		return(
            <View>
                <TouchableOpacity>
                    <Text>{icon}</Text>
                    </TouchableOpacity>
            </View>
	)}
}
