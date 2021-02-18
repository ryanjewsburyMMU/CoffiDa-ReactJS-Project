import React, {Component, useEffect, useState} from 'react';

import {Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions,TouchableOpacity, Alert,} from 'react-native';

import style from '../../../Styles/stylesheet'

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


	post_signup = () =>{
		const navigation = this.props.navigation;

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
				navigation.goBack()
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
				<View style={style.mainContainer}>
					<View style={style.mainHeader}>
						<Text style={style.mainTitle}>Sign Up</Text>
					</View>
					<View style={style.mainFooter}>
							<Text style={style.signupTitle}>Create An Account:</Text>
							<TextInput style={style.signupInput} placeholder="First Name" onChangeText={(text) => {this.setState({first_name: text})}}/>
							<TextInput style={style.signupInput} placeholder="Last Name" onChangeText={(text) => {this.setState({last_name: text})}}/>
							<TextInput style={style.signupInput} placeholder="Email" onChangeText={(text) => {this.setState({email: text})}}/>
							<TextInput style={style.signupInput} placeholder="Password" onChangeText={(text) => {this.setState({password: text})}}/>
							<TextInput style={style.signupInput} placeholder="Confirm Password" onChangeText={(text) => {this.setState({password_confirm: text})}}/>
							<TouchableOpacity
								onPress={()=> this.post_signup()} style={style.mainButton}>							
								<Text style={style.textCenterWhite}>Sign Up:</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={()=> this.props.navigation.goBack()} style={style.mainButtonWhite}>							
								<Text>Go Back:</Text>
							</TouchableOpacity>

					</View>
				</View>
			)}
}
