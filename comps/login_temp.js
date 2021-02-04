import React, {Component} from 'react';

import {Text, View, Button, TextInput, Alert,} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default class login_temp extends Component{

	constructor(props){
		super(props)
		this.state = {
			email: "",
			password: "",
			id:"",
			token:"",
			user_details: ""
		}
	}

	emptyFunc = () =>{
		console.log("Email:   " + this.state.email)
		console.log("Password:    "+ this.state.password)
	}


	async post_login () {
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
			console.log(this.state.user_details)

		})
		.catch((error) => {
			console.log(error)
		})
	}




	async post_logout () {
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


	async testFunction(){
        const token = await AsyncStorage.getItem('@session_token')

        console.log("token is === " + token)

        if (token === null) {
          console.log("empty")
        } else {
          console.log("Not empty")
        }
    }
			


	 	render(){
			 
	 		return(
				<View>
						<Text>Login:</Text>
						<TextInput placeholder="Email" onChangeText={(text) => {this.setState({email: text})}}/>
						<TextInput placeholder="Password" onChangeText={(text) => {this.setState({password: text})}}/>

						<Button title="Login" onPress={()=> this.post_login()} />
						<Button title="Logout" onPress={()=> this.post_logout()} />
						<Button title="Test Async" onPress={() => this.testFunction()} ></Button>
						<Button title="Test Get Info" onPress={() => this.get_getInfo()} ></Button>

						<Text>{this.state.user_details.first_name}</Text>

				</View>
			)}
}
