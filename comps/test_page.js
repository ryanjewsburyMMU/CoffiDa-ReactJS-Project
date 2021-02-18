import React, { Component, useEffect, useState } from 'react';

import { Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './login'
import SignUp from './signup'
import StarRating from 'react-native-star-rating';


import style from './stylesheet'


export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user_details: [],

		}
	}

	componentDidMount() {
		this.get_getInfo()
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
			<View style={style.mainContainer}>
				<View style={style.mainHeader}>
					<Text style={style.mainTitle}>My Reviews</Text>
				</View>
				<View style={style.mainFooter}>
					<ScrollView>
					<View>
						<TouchableOpacity
							onPress={() => this.props.navigation.goBack()} style={style.mainButton}>
							<Text style={style.textCenterWhite}>Go Back:</Text>
						</TouchableOpacity>
						<FlatList
							data={this.state.user_details.reviews}
							renderItem={({ item, index }) => (
								<View style={style.resultContainer}>
									<Text style={style.containerTitle}>{item.location.location_name}</Text>
									<View style={style.starContainer}>
										<StarRating
												disabled={false}
												fullStarColor="#eaca97"
												maxStars={5}
												rating={item.location.avg_overall_rating}
												starSize={20}
											/>
									</View>
									<Text>Review ID: {item.review.review_id}</Text>
									<Text>Comment: {item.review.review_body}</Text>
									<TouchableOpacity
									onPress={() => {navigation.navigate('EditReview', {review_id : item.review.review_id,location_id: item.location.location_id,clenliness_rating : item.review.clenliness_rating,price_rating : item.review.price_rating,overall_rating : item.review.overall_rating, quality_rating: item.review.quality_rating, review_body: item.review.review_body})}}
									 style={style.mainButton}>
									<Text style={style.textCenterWhite}>Edit This Review</Text>
								</TouchableOpacity>
								<TouchableOpacity style={style.deleteReview} onPress={()=>{this.press_delete(item.location.location_name, item.review.review_id, item.location.location_id)}}>
									<Text style={style.textCenterWhite}>Delete Review</Text>
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

