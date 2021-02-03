import React, {Component, useEffect, useState} from 'react';

import {Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions,TouchableOpacity,} from 'react-native';

export default class Login extends Component{

	emptyFunction = () =>{
			console.log("Testing")
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
							<TextInput style={styles.textinput}placeholder="Email"/>
							<TextInput style={styles.textinput}placeholder="Password"/>
							<TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('DB')}>
								<Text style={styles.text}>Login</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('SignUp')}>
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
