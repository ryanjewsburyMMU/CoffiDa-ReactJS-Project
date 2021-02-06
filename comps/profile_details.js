import React, {Component, useEffect, useState} from 'react';

import {Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions,TouchableOpacity, forceUpdate, Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './login'
import SignUp from './signup'



export default class Profile_Details extends Component{
	constructor(props){
		super(props)
		this.state = {
			isLoggedIn: true,
			user_details: [],

			orig_first_name: "",
			orig_last_name: "",
			orig_email: "",

			updated_first_name: "",
			updated_last_name: "",
			updated_email: "",

			password: "",
			confirm_password: ""
		}
	}
	componentDidMount (){
		this.unsubscribe = this.props.navigation.addListener('focus', () => {
			this.getDetails()

	})
	}
	componentWillUnmount(){
		this.unsubscribe()
		}

	getDetails = async () => {
		const navigation = this.props.navigation;

		const token = await AsyncStorage.getItem('@session_token')
		const first_name = await AsyncStorage.getItem('@userName')
		const last_name = await AsyncStorage.getItem('@userLastName')
		const email = await AsyncStorage.getItem('@userEmail')

		this.setState({
			orig_first_name: first_name,
			orig_last_name: last_name, 
			orig_email: email,

			updated_first_name: first_name,
			updated_last_name: last_name,
			updated_email: email
		})

	}


	async patch_updateInformation(){
		console.log("Patch Request Made to Updated User Information")
		let to_send = {};
		
		if(this.state.orig_first_name != this.state.updated_first_name){
			to_send['first_name'] = this.state.updated_first_name
		}
		if(this.state.orig_last_name != this.state.updated_last_name){
			to_send['last_name'] = this.state.updated_last_name
		}
		if(this.state.orig_email != this.state.updated_email){
			to_send['email'] = this.state.updated_email
		}
		if(this.state.password == this.state.confirm_password){
			to_send['password'] = this.state.confirm_password
		}

		return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + await AsyncStorage.getItem('@user_id'),
			{
				method: 'patch',
				headers: {'Content-Type': 'application/json', 'X-Authorization' : await AsyncStorage.getItem('@session_token')},
				body: JSON.stringify(to_send)		
			})
			.then((response) =>{
				Alert.alert("Item Updated")
			})
			.catch((error) => {
				console.log(error)
			})

	}





	 	render(){
			const navigation = this.props.navigation;


	 		return(
	 			<View style={styles.container}>
	 				<View style={styles.header}>
						<Text style={styles.title}>Edit Details</Text>
					</View>
					<View style={styles.footer}>
						<ScrollView>
							<Text style={styles.loginTitle}>Your Details:</Text>
							<TouchableOpacity	
								style={styles.loginButton}					
								onPress={() => navigation.goBack()}>
								<Text style={styles.text}>Go Back</Text>
							</TouchableOpacity>

							<Text>First Name: </Text>
							<TextInput style={styles.textinput}
								placeholder={this.state.orig_first_name}
								onChangeText={(updated_first_name) => this.setState({updated_first_name})}
								value={this.state.updated_first_name}
							/>

							<Text>Last Name: </Text>
							<TextInput style={styles.textinput}
								placeholder={this.state.orig_last_name}
								onChangeText={(updated_last_name) => this.setState({updated_last_name})}
								value={this.state.updated_last_name}
							/>
							
							<Text>E-Mail: </Text>
							<TextInput style={styles.textinput}
								placeholder={this.state.orig_email}
								onChangeText={(updated_email) => this.setState({updated_email})}
								value={this.state.updated_email}

							/>

							<Text>Password: </Text>
							<TextInput style={styles.textinput}
								placeholder="Password"
								onChangeText={(password) => this.setState({password})}
								value={this.state.password}
							/>

							<Text>Confirm Passsword: </Text>
							<TextInput style={styles.textinput}
								placeholder="Password"
								onChangeText={(confirm_password) => this.setState({confirm_password})}
								value={this.state.confirm_password}
							/>

							<TouchableOpacity style={styles.loginButton} onPress={() => {this.patch_updateInformation()}}>
								<Text style={styles.text}>Submit Changes</Text>
							</TouchableOpacity>
						</ScrollView>
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
		color: '#fff',
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
		marginBottom: 20
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
