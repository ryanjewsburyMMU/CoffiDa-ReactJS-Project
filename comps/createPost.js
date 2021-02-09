import React, { Component, useEffect, useState } from 'react';

import { Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions, TouchableOpacity, } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default class CreatePost extends Component {

	constructor(props) {
		super(props)
		this.state = {
			value: null,
			items: ["Location 1", "Location 2"],
			location_data: [],
			countries: 'uk',
			selected : "key1"

		}

		this.controller;
	}
	

	componentDidMount() {
		this.get_locations();
	}

	async get_locations() {
		console.log("Finding Locations")
		return fetch("http://10.0.2.2:3333/api/1.0.0/find",
			{
				// method: 'get',
				headers: { 'Content-Type': 'application/json', 'X-Authorization': await AsyncStorage.getItem('@session_token') },
			})

			.then((response) => {
				//200 400 401 else
				if (response.status == "200") {
					return response.json()
				}
				if (response.status == "400") {
					console.log("error 400")
				}
				if (response.status == "401") {
					console.log("error 401")
				}
				else {
					console.log("ELSE TRIGGERED")
				}
			})

			.then(async (responseJson) => {
				console.log(responseJson)

				this.setState({ location_data: responseJson })
			})
			.catch((error) => {
				console.log("errrr = " + error)
			})
	}
	render() {
		const navigation = this.props.navigation;
		const location_data = this.state.location_data

		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>Create a Review</Text>
				</View>
				<View style={styles.footer}>

			</View>
			</View >
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eaca97',
	},
	guest: {
		marginTop: 10,
		textAlign: 'center'
	},
	header: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'


	},
	footer: {
		flex: 5,
		backgroundColor: '#fff',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingHorizontal: 30,
		paddingVertical: 50
	},
	text: {
		color: '#fff',
		marginBottom: 20
	},
	title: {
		display: 'flex',

		color: '#fff',
		fontSize: 30,
		fontWeight: "bold",
	},
	loginTitle: {
		color: '#502b10',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10
	},
	subtitle: {
		marginBottom: 20
	},
	loginButton: {
		alignItems: "center",
		width: "100%",
		height: 40,
		backgroundColor: "#eaca97",
		padding: 10,
		marginTop: 20,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	},
	signupButton: {
		alignItems: "center",
		width: "100%",
		height: 40,
		backgroundColor: "#fff",
		padding: 10,
		marginTop: 20,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		borderColor: '#eaca97',
		borderWidth: 1,
	},
	textinput: {
		marginBottom: 10,
		borderColor: '#eaca97',
		borderWidth: 1,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	}
})
