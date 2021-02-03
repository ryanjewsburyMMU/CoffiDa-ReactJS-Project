import React, {Component, useEffect, useState} from 'react';

import {Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions,TouchableOpacity, Alert,} from 'react-native';

export default class SignUp extends Component{

	constructor(props){
		super(props)
		this.state = {
			id: "",
			email: "",
			password: "",
			password_confirm: "",
			first_name: "",
			last_name: ""
		}
	}

	emptyFunc = () =>{
		console.log("Email: " + this.state.email)
		console.log("Password: "+ this.state.password)
		console.log("First Name " + this.state.first_name)
		console.log("Last Name " + this.state.last_name)
	}


	post_signup = (navigation) =>{
		// Check if both passwords entered are the same
		if(this.state.password == this.state.password_confirm)
		{
			console.log("Post Request Made For Sign Up")

			let signup_details = {
				first_name: this.state.first_name,
				last_name: this.state.last_name,
				email: this.state.email,
				password: this.state.password,
			}

			return fetch("http://10.0.2.2:3333/api/1.0.0/user",{
				method: 'post',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(signup_details)
			})
			.then((response)=>{
				console.log(response.status)
				console.log(response.status.text)
				if(response.status == "400")
				{
					Alert.alert("Sign Up Error", "Please ensure all your details are correct.")
					console.log(response.statusText)
				}
				if(response.status == "201")
				{
					Alert.alert("Successs!", "We added your account. Now we just need to get you logged in")
					navigation.navigate('Login')
					return response.json()
				}
				if(response.status == "500")
				{
					Alert.alert("Server Error", "Please try again soon.")
					return response.json()
				}
			})
			.then((rjson)=> {
				console.log(rjson.id)
				this.setState({id: rjson.id})
			})
			.catch((errors)=>{
				console.log("Error")
			})
		}else{
			Alert.alert("Passwords Do Not Match", "Please ensure both your passwords are the same in order to continue.")
		}

	}
	 	render(){

			const navigation = this.props.navigation;


	 		return(
				<View style={styles.container}>
					<View style={styles.header}>
						<Text style={styles.title}>Sign Up</Text>
					</View>
					<View style={styles.footer}>
							<Text style={styles.signUpTitle}>Create An Account:</Text>
							<TextInput style={styles.textinput} placeholder="First Name" onChangeText={(text) => {this.setState({first_name: text})}}/>
							<TextInput style={styles.textinput} placeholder="Last Name" onChangeText={(text) => {this.setState({last_name: text})}}/>
							<TextInput style={styles.textinput} placeholder="Email" onChangeText={(text) => {this.setState({email: text})}}/>
							<TextInput style={styles.textinput} placeholder="Password" onChangeText={(text) => {this.setState({password: text})}}/>
							<TextInput style={styles.textinput} placeholder="Confirm Password" onChangeText={(text) => {this.setState({password_confirm: text})}}/>
							<TouchableOpacity
							onPress={()=> this.post_signup(navigation)} style={styles.loginButton}>							
							<Text>Sign Up:</Text>
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
	signUpTitle:{
		color: '#502b10',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10
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
		borderWidth: 1
	}
})
