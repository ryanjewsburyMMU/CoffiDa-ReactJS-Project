import React, {Component, useEffect, useState} from 'react';

import {Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions,TouchableOpacity, Image} from 'react-native';

export default class SplashScreen extends Component{
	render(){
		const navigation = this.props.navigation;
		return(
			<View style={styles.container}>
				<View style={styles.header}>
						<Text></Text>
				</View>
				<View style={styles.footer}>
					<Text style={styles.title}>Welcome to CoffiDa!</Text>
					<Text>All the best coffee, all in one place. Start Your Journey Today!</Text>
					<TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
					<Text>Get Started</Text>
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
		flex: 2,
		justifyContent: 'flex-end',
		marginLeft: 20,
		marginBottom: 10
	},
	footer:{
		flex: 1,
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
		color: '#502b10',
		fontSize: 20,
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
			width: "30%",
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
