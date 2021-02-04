import React, {Component, useEffect, useState} from 'react';

import {Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions,TouchableOpacity,} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';



class NotLoggedIn extends Component{
	render(){
		const createReviewIcon = <Icon name="edit" size={30} color="#eaca97" />;
		const updateIcon = <Icon name="feed" size={30} color="#eaca97" />;
		const discountIcon = <Icon name="money" size={30} color="#eaca97" />;
		const userIcon = <Icon name="users" size={30} color="#fff" />;

		return(
			<View style={styles.container}>
			<View style={styles.header}>
			   <Text style={styles.title}>Welcome, Stranger!</Text>
		   </View>
		   <View style={styles.footer}>
			   <Button title="test" onPress={this.testFunction}/>
			   <Text style={styles.sub_text}> We've noticed your not signed in! Creating a FREE account gives you access to tons of great features such as:</Text>
			   <ScrollView>
				<TouchableOpacity style={styles.card}>
					<Text>{createReviewIcon}</Text>
					<Text>Create Your Own Review!</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.card}>
					<Text>{updateIcon}</Text>
					<Text>Get Notifications And Updates!</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.card}>
					<Text>{discountIcon}</Text>
					<Text>Recieve Unique Discounts!</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.card_login}>
					<Text>{userIcon}</Text>
					<Text style={styles.text}>Click Here to Login Or Signup Today!</Text>
				</TouchableOpacity>	
				</ScrollView>
		   </View>
		</View>
		)}
}



class IsLoggedIn extends Component{

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




	render(){
		const createReviewIcon = <Icon name="edit" size={30} color="#eaca97" />;
		const updateIcon = <Icon name="feed" size={30} color="#eaca97" />;
		const discountIcon = <Icon name="money" size={30} color="#eaca97" />;
		const userIcon = <Icon name="users" size={30} color="#fff" />;

		return(
			<View style={styles.container}>
			<View style={styles.header}>
			   <Text style={styles.title}>Welcome, User!</Text>
		   </View>
		   <View style={styles.footer}>
			   <Text style={styles.sub_text}> Welcome to your profile page! Here you can view your details, make changes or log out!</Text>
			   <ScrollView>
				<TouchableOpacity style={styles.card}>
					<Text>{createReviewIcon}</Text>
					<Text>View my Details</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.card}>
					<Text>{updateIcon}</Text>
					<Text>Edit My Details</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.card_login} onPress={this.post_logout}>
					<Text>{userIcon}</Text>
					<Text style={styles.text}>Click Here to Logout!</Text>
				</TouchableOpacity>	
				</ScrollView>
		   </View>
		</View>
		)}
}




export default class Profile extends Component{
	constructor(props){
		super(props)
		this.state = {
			isLoggedIn: true
		}
	}

	async componentDidMount (){
        const name = await AsyncStorage.getItem('@user_name')

        console.log("name is === " + name)

        if (name === null) {
			console.log(this.state.isLoggedIn)
			this.setState({isLoggedIn: false})
        } else {
		  console.log(this.state.isLoggedIn)
          this.setState({isLoggedIn: true})
        }
	}
	 	render(){
			const navigation = this.props.navigation;
	 		return(
			<View style={styles.container}>
				{/* {this.state.isLoggedIn ? <NotLoggedIn/>: <View><Text>View 2</Text></View>} */}
				<IsLoggedIn />
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
		justifyContent: 'center',
		alignItems: 'center'
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
		marginTop: 10,
		fontWeight: "bold",

	},
	title:{
        display: 'flex',
		color: '#fff',
		fontSize: 30,
		fontWeight: "bold",
	},
	sub_text:{
		fontSize: 15,
		marginBottom: 10,
		textAlign: 'center',
		marginBottom: 30
	},
	card:{
		justifyContent: 'center',
		alignItems: 'center',
		borderColor:'#eaca97',
		borderWidth: 5,
		padding: 10,
		marginBottom: 10,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
	},
	card_login: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor:'#eaca97',
		padding: 10,
		marginBottom: 10,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,

	},
})

