import React, { Component, useEffect, useState } from 'react';

import { Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './login'
import SignUp from './signup'



export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user_details: []
		}
	}

	componentDidMount() {
		this.get_getInfo()
	}

	async get_getInfo() {
		console.log("Get Request Made For details")
		return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + await AsyncStorage.getItem('@user_id'),
			{
				method: 'get',
				headers: { 'Content-Type': 'application/json', 'X-Authorization': await AsyncStorage.getItem('@session_token')},
			})

			.then((response) => response.json())
			.then(async (responseJson) => {
				console.log(responseJson)
				this.setState({
					user_details: responseJson
				})
			})
			.catch((error) => {
				console.log(error)
			})
	}

	render() {
		const user_data = this.state.user_details
		console.log("User details: ")
		console.log(this.state.user_details.reviews)



		return (
			<View>
				<FlatList
					data={this.state.user_details.reviews}
					renderItem={({ item, index }) => (
						<View>
							<Text>Review ID: {item.review.review_id}</Text>
							<Text> Review Body: {item.review.review_body}</Text>

							<Text>{item.location.location_id}</Text>
							<Text>{item.location.location_name}</Text>

						</View>
					)}
					keyExtractor={(item, index) => index.toString()}
				/>
			</View>
		)
	}
}



