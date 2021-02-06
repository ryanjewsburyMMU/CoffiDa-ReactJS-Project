import React, {Component, useEffect, useState} from 'react';

import {Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions,TouchableOpacity, forceUpdate} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './login'
import SignUp from './signup'



export default class Profile extends Component{
	constructor(props){
		super(props)
		this.state = {
			isLoggedIn: true,
			user_details: []
		}
	}
	componentDidMount (){
			this.unsubscribe = this.props.navigation.addListener('focus', () => {
				this.checkLoggedIn()
				console.log("Screen Aciviated")

		})
	}
	componentWillUnmount(){
		this.unsubscribe()
		}
	
	checkLoggedIn = async () => {
		const navigation = this.props.navigation;

		const token = await AsyncStorage.getItem('@session_token')
        console.log("token is === " + token)

        if (token === null) {
			navigation.navigate('Login')

        } else {
		  navigation.navigate('Profile')
		  this.get_getInfo()
        }
	}


	async post_logout () {
		const navigation = this.props.navigation
		console.log("Post Request Made For Logout")
		return fetch("http://10.0.2.2:3333/api/1.0.0/user/logout",
			{
				method: 'post',
				headers: {'Content-Type': 'application/json', 'X-Authorization' : await AsyncStorage.getItem('@session_token')},
				body: JSON.stringify({

				})
			})
			.then((response)=> {
				if(response.status == "200")
					{
						console.log("Logged Out")
						AsyncStorage.clear()
						navigation.navigate("Login")
					}
				if(response.status == "400")
					{
						console.log("400")
						AsyncStorage.clear()

					}
				if(response.status == "500")
					{
						console.log("500")
						AsyncStorage.clear()

					}	
			})
			.catch((error) => {
				console.log(error);
			})
	}




	async get_getInfo () {
		console.log("Get Request Made For details")
		return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + await AsyncStorage.getItem('@user_id'),
			{
			method: 'get',
			headers: {'Content-Type': 'application/json', 'X-Authorization' : await AsyncStorage.getItem('@session_token')},
		})

		.then((response) => response.json())
		.then(async(responseJson) => {
			this.setState({
				user_details: responseJson
			})
			console.log(responseJson)
			await AsyncStorage.setItem('@userName', this.state.user_details.first_name)
			await AsyncStorage.setItem('@userLastName', this.state.user_details.last_name)
			await AsyncStorage.setItem('@userEmail', this.state.user_details.email)
		})
		.catch((error) => {
			console.log(error)
		})
	}


	 	render(){
			const navigation = this.props.navigation;
			const myIcon1 = <Icon name="rocket" size={30} color="#900" />;


	 		return(
	 			<View style={styles.container}>
	 				<View style={styles.header}>
						<Text style={styles.title}>Hello, {this.state.user_details.first_name}</Text>
					</View>
					<View style={styles.footer}>
						<Text style={styles.loginTitle}>Your Details:</Text>
						<Text style={styles.text}>Full Name: {this.state.user_details.first_name} {this.state.user_details.last_name}</Text>
						<Text style={styles.text}>E-Mail: {this.state.user_details.email}</Text>
						<Text style={styles.text}>Your Unique ID: {this.state.user_details.user_id}</Text>
						<TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate("Profile_Details")}>
							<Text>Edit Profile</Text>
						</TouchableOpacity> 
						<TouchableOpacity style={styles.signupButton} onPress={() => console.log("Take to stack page")}>
							<Text>Favourite Locations</Text>
						</TouchableOpacity> 
						<TouchableOpacity style={styles.signupButton} onPress={() => console.log("Take to stack page")}>
							<Text>My Reviews</Text>
						</TouchableOpacity> 
						<TouchableOpacity style={styles.signupButton} onPress={() => console.log("Take to stack page")}>
							<Text>Liked Reviews</Text>
						</TouchableOpacity> 
						<TouchableOpacity style={styles.loginButton} onPress={() => {this.post_logout()}}>
							<Text>Sign Out</Text>
						</TouchableOpacity> 
			
					</View>
	 			</View>
	)}
}

const styles = StyleSheet.create({
	test: {
		textAlign: 'right'
	},
	container: {
		flex: 1,
		backgroundColor: '#eaca97',
	},
	guest:{
		marginTop: 10,
		textAlign: 'center'
	},
	header:{
		flex: 1,
		justifyContent: 'flex-end',
		marginLeft: 20,
		marginBottom: 10
	},
	footer:{
		flex: 5,
		backgroundColor: '#fff',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingHorizontal: 30,
		paddingVertical: 50
	},
	text:{
		textAlign: 'center',
		marginBottom: 10,
	},
	title:{
		color: '#fff',
		fontSize: 30,
		fontWeight: "bold",
	},
	loginTitle:{
		color: '#502b10',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
		textAlign: 'center'
	},
	subtitle:{
		marginBottom: 20
	},
	loginButton: {
		alignItems: "center",
		width: "100%",
		height:40,
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
		height:40,
		backgroundColor: "#fff",
		padding: 10,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		borderColor:'#eaca97',
		borderWidth: 1,
		marginBottom: 30
	},
	textinput:{
		marginBottom:10,
		borderColor:'#eaca97',
		borderWidth: 1,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	}
})
