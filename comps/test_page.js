import React, { Component, useEffect, useState } from 'react';

import { Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './login'
import SignUp from './signup'
import StarRating from 'react-native-star-rating';




export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user_details: [],
			favourite_locations: [],
			favourite_locations_id: []
		}
	}

	componentDidMount() {
		this.get_getInfo()
		this.newTest()
	}


	async get_getInfo() {
		console.log("Get Request Made For details")
		return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + await AsyncStorage.getItem('@user_id'),
			{
				method: 'get',
				headers: { 'Content-Type': 'application/json', 'X-Authorization': await AsyncStorage.getItem('@session_token') },
			})

			.then((response) => response.json())
			.then(async (responseJson) => {
				this.setState({
					user_details: responseJson,
					favourite_locations: responseJson.favourite_locations
				})

			})
			.catch((error) => {
				console.log(error)
			})
	}
	async delete_review(review_id, location_id){
		return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+location_id + "/review/" +review_id,
		{
			method: 'delete',
			headers: {'Content-Type': 'application/json', 'X-Authorization' : await AsyncStorage.getItem('@session_token')},
		})
		.then((response) =>{
			// Add error catching here
			if(response.status == "200"){
				Alert.alert("Item has been deleted")
				this.get_getInfo()
			}
			if(response.status == "400"){
				Alert.alert("Bad Request 400")
			}
			if(response.status == "401"){
				Alert.alert("Unauthorised (401)")
			}
			if(response.status == "403"){
				Alert.alert("You cannot edit this review")
			}
			if(response.status == "404"){
				Alert.alert("Review update not found, please try again(404)")
			}
			if(response.status == "500"){
				Alert.alert("There was an erroe connecting, try again (500)")
			}
		})
		.catch((error) => {
			console.log(error)
		})

}
	
	press_delete(title, review_id, location_id){
		Alert.alert("Are You Sure?", "Are you sure you want to delete your review for " + title + "?",
		[
			{
			  text: 'Yes, Delete',
			  onPress: () => this.delete_review(review_id, location_id)

			},
			{
			  text: 'No, Cancel',
			  onPress: () => console.log('Cancel Pressed'),
			},
		  ],
		)
	}


	newTest(){
		const new_list = []
		this.state.favourite_locations.forEach((item) => {
			new_list.push(item.location_id)
		  });
		  this.setState({favourite_locations_id : new_list})

	}
	
	render() {
		const user_data = this.state.user_details
		const navigation = this.props.navigation;


		if(this.state.user_details == [] && this.state.favourite_locations_id == []){
			return(
				<View>
					<Text>Loading</Text>
					</View>
			)
		}else{
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>My Reviews</Text>
				</View>
				<View style={styles.footer}>
					<ScrollView>
					<Text style={styles.loginTitle}></Text>

					<View>
						<TouchableOpacity
							onPress={() => this.props.navigation.goBack()} style={styles.goBackButton}>
							<Text style={styles.text}>Go Back:</Text>
						</TouchableOpacity>
						<FlatList
							data={this.state.user_details.reviews}
							renderItem={({ item, index }) => (
								<View style={styles.reviewContainer}>
									<Text style={styles.reviewTitle}>{item.location.location_name}</Text>
									<View style={styles.starContainer}>
										<StarRating
												disabled={false}
												fullStarColor="#eaca97"
												maxStars={5}
												rating={item.location.avg_overall_rating}
												starSize={20}
												style={styles.star}
											/>
									</View>
									<Text>Review ID: {item.review.review_id}</Text>
									<Text>Comment: {item.review.review_body}</Text>
									<TouchableOpacity
									onPress={() => {navigation.navigate('EditReview', {review_id : item.review.review_id,location_id: item.location.location_id,clenliness_rating : item.review.clenliness_rating,price_rating : item.review.price_rating,overall_rating : item.review.overall_rating, quality_rating: item.review.quality_rating, review_body: item.review.review_body})}}
									 style={styles.goBackButton}>
									<Text style={styles.text}>Edit This Review</Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.deleteButton} onPress={()=>{this.press_delete(item.location.location_name, item.review.review_id, item.location.location_id)}}>
									<Text style={styles.text}>Delete Review</Text>
								</TouchableOpacity>
								</View>
							)}
							keyExtractor={(item, index) => index.toString()}
						/>
					</View>
				</ScrollView>
				</View>
			</View>



		)
							}
	}
}

const styles = StyleSheet.create({
	starContainer: {
		width: '20%'
	},
	reviewContainer: {
		backgroundColor: '#F2F2F2',
		padding: 20,
		marginBottom: 20,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
		elevation: 6
	},
	container: {
		flex: 1,
		backgroundColor: '#eaca97',
	},
	guest: {
		marginTop: 10,
		textAlign: 'center'
	},
	header: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	footer: {
		flex: 5,
		backgroundColor: '#fff',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingHorizontal: 30,
	},
	text: {
		color: '#fff',
		marginBottom: 20
	},
	title: {
		display: 'flex',

		color: '#fff',
		fontSize: 30,
		fontWeight: "bold",
	},
	reviewTitle: {
		color: '#eaca97',
		fontSize: 20,
		fontWeight: 'bold',
	},
	subtitle: {
		marginBottom: 20
	},
	goBackButton: {
		alignItems: "center",
		width: "100%",
		height: 40,
		backgroundColor: "#eaca97",
		padding: 10,
		marginTop: 20,
		marginBottom: 10,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	},
	signupButton: {
		alignItems: "center",
		width: "100%",
		height: 40,
		backgroundColor: "#fff",
		padding: 10,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		borderColor: '#eaca97',
		borderWidth: 1,
	},
	deleteButton: {
		alignItems: "center",
		width: "100%",
		height: 40,
		backgroundColor: "#650D1B",
		padding: 10,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		borderWidth: 1,
	},
	textinput: {
		marginBottom: 10,
		borderColor: '#eaca97',
		borderWidth: 1,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	}
})

// location_id: item.location.location_id,
// 									clenliness_rating : item.review.clenliness_rating,
// 									price_rating : item.review.price_rating,
// 									overall_rating : item.review.overall_rating,