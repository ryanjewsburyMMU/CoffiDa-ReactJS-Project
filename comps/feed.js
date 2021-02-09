import React, { Component, useEffect, useState } from 'react';

import { Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions, TouchableOpacity, } from 'react-native';

import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class Feed extends Component {
	constructor(props) {
		super(props),
			this.state = {
				isLoading: true,
				location_data: []
			}
	}

	componentDidMount() {
		this.get_locations();
	}

	async get_locations() {
		console.log("Finding Locations")
		return fetch("http://10.0.2.2:3333/api/1.0.0/find",
			{
				// method: 'get',
				headers: { 'Content-Type': 'application/json', 'X-Authorization': await AsyncStorage.getItem('@session_token') },
			})

			.then((response) => {
				//200 400 401 else
				if (response.status == "200") {
					return response.json()
				}
				if (response.status == "400") {
					console.log("error 400")
				}
				if (response.status == "401") {
					console.log("error 401")
				}
				else {
					console.log("ELSE TRIGGERED")
				}
			})

			.then(async (responseJson) => {
				console.log(responseJson)

				this.setState({ location_data: responseJson })
			})
			.catch((error) => {
				console.log("errrr = " + error)
			})
	}

	render() {
		const navigation = this.props.navigation;
		const favourite_icon = <Icon name="heart-o" size={30} color="#900" />;


		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>Your Feed</Text>
				</View>
				<View style={styles.footer}>
					<ScrollView>

						<Text style={styles.loginTitle}></Text>
						<View>
							{this.state.location_data.map((locationData, index) => (
								<View key={index}>
									<View style={styles.loginButton}>
										<Text style={styles.locationTitle}>{locationData.location_name}</Text>
										<Text>Overall Rating</Text>
										<StarRating
											disabled={false}
											fullStarColor="#eaca97"
											maxStars={5}
											rating={locationData.avg_overall_rating}
											starSize={25}
											selectedStar={(rating) => this.onStarRatingPress(rating)}
										/>
									</View>
									<View style={styles.favourite}>
										<Text>Favourite This Location?</Text>
										<TouchableOpacity onPress={() => { console.log("You favourited" + locationData.location_id) }}>
											<Text>{favourite_icon}</Text>
										</TouchableOpacity>

										<TouchableOpacity style={styles.reviewButton} onPress={() => { navigation.navigate("ReviewPage", { id: locationData.location_id }) }}>
											<Text style={styles.text}>See Reviews for {locationData.location_name}</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.signupButton} onPress={() => { navigation.navigate("CreateReviewPage", { id: locationData.location_id, name: locationData.location_name }) }}>
											<Text>Write a Review For {locationData.location_name}</Text>
										</TouchableOpacity>
									</View>
								</View>
							))}
						</View>
					</ScrollView>

				</View>

			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eaca97',
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
		padding: 10
	},
	title: {
		display: 'flex',
		color: '#fff',
		fontSize: 30,
		fontWeight: "bold",
	},
	text: {
		color: '#fff',
		fontSize: 15,
		marginBottom: 10
	},
	locationTitle: {
		display: 'flex',
		color: '#eaca97',
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10
	},
	loginButton: {
		alignItems: "center",
		width: "100%",
		height: 40,
		padding: 10,
		marginTop: 20,
		marginBottom: 70,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	},
	favourite: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	reviewButton: {
		alignItems: "center",
		width: "100%",
		backgroundColor: '#eaca97',
		height: 40,
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

})
