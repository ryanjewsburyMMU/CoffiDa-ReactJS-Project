import React, {Component, useEffect, useState} from 'react';

import {Text, View, TextInput,  StyleSheet,TouchableOpacity, Button, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from './stylesheet'


export default class Login extends Component{
	constructor(props){
		super(props)
		this.state = {
			email: "",
			password: "",
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

		if (token != null) {
		navigation.navigate('Profile')
		}
	}


	async post_login () {
		const navigation = this.props.navigation;

		console.log("Post Request Made For Login")
		return fetch("http://10.0.2.2:3333/api/1.0.0/user/login",
			{
				method: 'post',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					email: this.state.email,
					password: this.state.password
				})
			})
			.then((response)=> {
				if (parseInt(response.status) == 200)
				{
					console.log("Login Success - Code: " + response.status)
					Alert.alert("Login Successful (" +response.status+")", "Test")
					return response.json();					
				}
				if (parseInt(response.status) == 400)
				{
					console.log("Login Unsucesful - Code: " + response.status)		
					Alert.alert("Incorrect Details (" +response.status+")", "Please ensure your email and password are correct, if the problem persits please contact our team for more support.")
	
				}
				if (parseInt(response.status) == 500)
				{
					console.log("Server Error, Please try again soon.  " + response.status)	
					Alert.alert("Connection Error", "We are struggling to connect with you! Please try again or contact our team for further support.")
				}
			})
			.then(async(responseJson) => {
				console.log(responseJson.token)
				await AsyncStorage.setItem('@session_token', String(responseJson.token))
				await AsyncStorage.setItem('@user_id', String(responseJson.id))
				navigation.navigate("Profile")
			})
			.catch((error) => {
				console.log(error);
			})
	}




	 	render(){
			const navigation = this.props.navigation;

	 		return(
	 			<View style={style.loginContainer}>
	 				<View style={style.loginHeader}>
						<Text style={style.welcomeTitle}>Hello, There!</Text>
					</View>
					<View style={style.loginFooter}>
							<Text style={style.loginTitle}>Login:</Text>
							<TextInput style={style.loginInput}placeholder="Email" onChangeText={(text) => {this.setState({email: text})}}/>
							<TextInput style={style.loginInput}placeholder="Password" onChangeText={(text) => {this.setState({password: text})}}/>
							<TouchableOpacity style={style.mainButton} onPress={() => {this.post_login()}}>
								<Text style={style.textCenterWhite}>Login</Text>
							</TouchableOpacity>
							<TouchableOpacity style={style.mainButtonWhite} onPress={() => this.props.navigation.navigate('SignUp')}>
								<Text>Sign Up</Text>
							</TouchableOpacity>
					</View>
	 			</View>
	)}
}
