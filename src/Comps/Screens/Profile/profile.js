import React, {Component, useEffect, useState} from 'react';

import {Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions,TouchableOpacity, forceUpdate} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Login from './login'
// import SignUp from './signup'

import style from '../../../Styles/stylesheet'



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
	 			<View style={style.mainContainer}>
	 				<View style={style.mainHeader}>
						<Text style={style.mainTitle}>Hello, {this.state.user_details.first_name}</Text>
					</View>
					<View style={style.mainFooter}>
						<Text style={style.detailsTitle}>Your Details:</Text>
						<Text style={style.textCenterBlack}>Full Name: {this.state.user_details.first_name} {this.state.user_details.last_name}</Text>
						<Text style={style.textCenterBlack}>E-Mail: {this.state.user_details.email}</Text>
						<Text style={style.textCenterBlack}>Your Unique ID: {this.state.user_details.user_id}</Text>
						<TouchableOpacity style={style.mainButtonWhite} onPress={() => navigation.navigate("Profile_Details")}>
							<Text>Edit Profile</Text>
						</TouchableOpacity> 
						<TouchableOpacity style={style.mainButtonWhite} onPress={() => navigation.navigate("FavouriteLocations")}>
							<Text>Favourite Locations</Text>
						</TouchableOpacity> 
						<TouchableOpacity style={style.mainButtonWhite} onPress={() => navigation.navigate("App")}>
							<Text>My Reviews</Text>
						</TouchableOpacity> 
						<TouchableOpacity style={style.mainButtonWhite} onPress={() => console.log('Liked Reviews Possible...')}>
							<Text>Liked Reviews</Text>
						</TouchableOpacity> 
						<TouchableOpacity style={style.mainButton} onPress={() => {this.post_logout()}}>
							<Text>Sign Out</Text>
						</TouchableOpacity> 
			
					</View>
	 			</View>
	)}
}
