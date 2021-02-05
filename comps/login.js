import React, {Component, useEffect, useState} from 'react';

import {Text, View, TextInput,  StyleSheet,TouchableOpacity, Button, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
	 			<View style={styles.container}>
	 				<View style={styles.header}>
						<Text style={styles.title}>Hello, There!</Text>
					</View>
					<View style={styles.footer}>
							<Text style={styles.loginTitle}>Login:</Text>
							<TextInput style={styles.textinput}placeholder="Email" onChangeText={(text) => {this.setState({email: text})}}/>
							<TextInput style={styles.textinput}placeholder="Password" onChangeText={(text) => {this.setState({password: text})}}/>
							<TouchableOpacity style={styles.loginButton} onPress={() => {this.post_login()}}>
								<Text style={styles.text}>Login</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.signupButton} onPress={() => this.props.navigation.navigate('SignUp')}>
								<Text>Sign Up</Text>
							</TouchableOpacity>
							<TouchableOpacity>
								<Text style={styles.guest}>Continue As a Guest</Text>
							</TouchableOpacity>

					</View>
	 			</View>
	)}
}

const styles = StyleSheet.create({
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
		flex: 2,
		backgroundColor: '#fff',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingHorizontal: 30,
		paddingVertical: 50
	},
	text:{
		color: '#fff',
		marginBottom: 20
	},
	title:{
		color: '#fff',
		fontSize: 30,
		fontWeight: "bold"
	},
	loginTitle:{
		color: '#502b10',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10
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
		marginTop: 20,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		borderColor:'#eaca97',
		borderWidth: 1,
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
