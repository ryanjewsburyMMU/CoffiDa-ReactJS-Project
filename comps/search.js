import React, { Component, useEffect, useState } from 'react';

import { Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions, TouchableOpacity, TouchableHighlightBase, Alert, } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import StarRating from 'react-native-star-rating';
import { ScrollView } from 'react-native-gesture-handler';



export default class Search extends Component {
	constructor(props) {
		super(props)
		this.state = {
			cafe_name: "",

			advancedFilter: false,
			value_overall: 0,
			overall_rating_active: false,

			value_price: 0,
			price_rating_active: false,

			value_clenliness: 0,
			clenliness_rating_active: false,

			value_quality: 0,
			quality_rating_active: false,

			search_in: "java",

			limit: 2,
			offset: 0,

			searchResponse: []
		}
	}

	resetFilters() {
		this.setState({ value_overall: 0 })
		this.setState({ value_price: 0 })
		this.setState({ value_clenliness: 0 })
		this.setState({ value_quality: 0 })
	}

	async search_results(finalCurl) {
		console.log("Searching the database for your search queires")
		return fetch(finalCurl,
			{
				method: 'get',
				headers: { 'Content-Type': 'application/json', 'X-Authorization': await AsyncStorage.getItem('@session_token') },
			})

			.then((response) => {
				if (parseInt(response.status) == 200) {
					return response.json();
				}
				if (parseInt(response.status) == 400) {
					Alert.alert("Incorrect Details (" + response.status + ")", "Please ensure your email and password are correct, if the problem persits please contact our team for more support.")

				}
				if (parseInt(response.status) == 500) {
					console.log("Server Error, Please try again soon.  " + response.status)
					Alert.alert("Connection Error", "We are struggling to connect with you! Please try again or contact our team for further support.")
				}
			})
			.then(async (responseJson) => {
				console.log("something here")
				if (responseJson == "") {
					Alert.alert("No Results Found", "Please refined your search criteria, no results have been found based on your input")
				}
				this.setState({
					searchResponse: responseJson
				})
			})
			.catch((error) => {
				console.log(error);
			})
	}



	// This Method Creates a Curl string for giving to the fetch API on /find :) 
	createCurl() {
		let finalCurl = "http://10.0.2.2:3333/api/1.0.0/find?"
		console.log(finalCurl)
		// Searching By Cafe Name 
		if (this.state.cafe_name != "") {
			let search_name = this.state.cafe_name.replace(/\s/g, '%20')
			finalCurl = finalCurl + "q=" + search_name
		}
		else {
			console.log("Please Enter A Cafe Name to Search")
		}

		// Searching By Overall Rating
		if (this.state.overall_rating_active == true) {
			finalCurl = finalCurl + "&overall_rating=" + this.state.value_overall
			console.log("Overall Rating is true")
		}
		else {
			console.log("No Overall Rating Selected")
		}

		// Searching By Price Rating
		if (this.state.price_rating_active == true) {
			finalCurl = finalCurl + "&price_rating=" + this.state.value_price
			console.log("Price Rating is true")
		}
		else {
			console.log("No Price Rating Selected")
		}

		// Searching By Quality Rating
		if (this.state.quality_rating_active == true) {
			finalCurl = finalCurl + "&quality_rating=" + this.state.value_quality
			console.log("Quality Rating is true")
		}
		else {
			console.log("No Quality Rating Selected")
		}
		// Searching By Cleanliness Rating
		if (this.state.clenliness_rating_active == true) {
			finalCurl = finalCurl + "&clenliness_rating=" + this.state.value_clenliness
			console.log("Cleaniness Rating is true")
		}
		else {
			console.log("No Cleanliness Rating Selected")
		}
		// Search In
		if (this.state.search_in == "favourite") {
			finalCurl = finalCurl + "&search_in=" + this.state.search_in
		}
		else if (this.state.search_in == "reviewed") {
			finalCurl = finalCurl + "&search_in=" + this.state.search_in
		} else {
			console.log("NO SERAHC IN PARAM SELECTED")
		}
		finalCurl = finalCurl + "&limit=" + this.state.limit + "&offset=" + this.state.offset
		console.log(finalCurl)

		this.search_results(finalCurl)
	}

	emptyFunction = () => {
		if (this.state.advancedFilter == true) {
			return (
				<View>
					<View style={{ flexDirection: 'row' }}>
						<View style={{ flex: 1 }}>
							<View style={{ alignContent: 'center', alignItems: 'center', marginTop: 10 }}>
								<View>
									<Text style={{ textAlign: 'center' }}>Minimum Overall Rating?</Text>
									<Text style={{ textAlign: 'center' }}>{this.state.value_overall}</Text>
								</View>
								<View>
									<CheckBox
										value={this.state.overall_rating_active}
										onValueChange={() => { this.setState({ overall_rating_active: !this.state.overall_rating_active }) }}
										tintColors={{ true: '#eaca97' }}
									/>
								</View>
								<View>
									<View>
										<Slider
											style={{ width: 150, height: 40 }}
											step={1}
											minimumValue={0}
											maximumValue={5}
											minimumTrackTintColor="#eaca97"
											thumbTintColor="#eaca97"
											maximumTrackTintColor="#eaca97"
											onValueChange={value => this.setState({ value_overall: value })}
											disabled={!this.state.overall_rating_active}
										/>
									</View>
								</View>
							</View>

						</View>

						<View style={{ flex: 1 }}>
							<View style={{ alignContent: 'center', alignItems: 'center', marginTop: 10 }}>
								<View>
									<Text style={{ textAlign: 'center' }}>Minimum Price Rating?</Text>
									<Text style={{ textAlign: 'center' }}>{this.state.value_price}</Text>
								</View>
								<View>
									<CheckBox
										value={this.state.price_rating_active}
										onValueChange={() => { this.setState({ price_rating_active: !this.state.price_rating_active }) }}
										tintColors={{ true: '#eaca97' }}
									/>
								</View>
								<View>
									<View>
										<Slider
											style={{ width: 150, height: 40 }}
											step={1}
											minimumValue={0}
											maximumValue={5}
											minimumTrackTintColor="#eaca97"
											thumbTintColor="#eaca97"
											maximumTrackTintColor="#eaca97"
											onValueChange={value => this.setState({ value_price: value })}
											disabled={!this.state.price_rating_active}
										/>
									</View>
								</View>
							</View>
						</View>
					</View>
					<View style={{ flexDirection: 'row' }}>
						<View style={{ flex: 1 }}>
							<View style={{ alignContent: 'center', alignItems: 'center', marginTop: 10 }}>
								<View>
									<Text style={{ textAlign: 'center' }}>Min Cleanliness Rating?</Text>
									<Text style={{ textAlign: 'center' }}>{this.state.value_clenliness}</Text>
								</View>
								<View>
									<CheckBox
										value={this.state.clenliness_rating_active}
										onValueChange={() => { this.setState({ clenliness_rating_active: !this.state.clenliness_rating_active }) }}
										tintColors={{ true: '#eaca97' }}
									/>
								</View>
								<View>
									<View>
										<Slider
											style={{ width: 150, height: 40 }}
											step={1}
											minimumValue={0}
											maximumValue={5}
											minimumTrackTintColor="#eaca97"
											thumbTintColor="#eaca97"
											maximumTrackTintColor="#eaca97"
											onValueChange={value => this.setState({ value_clenliness: value })}
											disabled={!this.state.clenliness_rating_active}
										/>
									</View>
								</View>
							</View>

						</View>
						{/* SECOND ROW */}
						<View style={{ flex: 1 }}>
							<View style={{ alignContent: 'center', alignItems: 'center', marginTop: 10 }}>
								<View>
									<Text style={{ textAlign: 'center' }}>Minimum Quality Rating?</Text>
									<Text style={{ textAlign: 'center' }}>{this.state.value_quality}</Text>
								</View>
								<View>
									<CheckBox
										value={this.state.quality_rating_active}
										onValueChange={() => { this.setState({ quality_rating_active: !this.state.quality_rating_active }) }}
										tintColors={{ true: '#eaca97' }}
									/>
								</View>
								<View>
									<View>
										<Slider
											style={{ width: 150, height: 40 }}
											step={1}
											minimumValue={0}
											maximumValue={5}
											minimumTrackTintColor="#eaca97"
											thumbTintColor="#eaca97"
											maximumTrackTintColor="#eaca97"
											onValueChange={value => this.setState({ value_quality: value })}
											disabled={!this.state.quality_rating_active}
										/>
									</View>
								</View>
							</View>
						</View>
					</View>
					<View styles={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
						<Text>Where Would You Like To Search?</Text>
						<Picker
							selectedValue={this.state.search_in}
							style={{ height: 50, width: '100%', textAlign: 'center' }}
							onValueChange={(itemValue, itemIndex) =>
								this.setState({ search_in: itemValue })
							}>
							<Picker.Item label="Everywhere" value="everywhere" />
							<Picker.Item label="My Favourite Locations" value="favourite" />
							<Picker.Item label="My Reviews" value="reviewed" />
						</Picker>
						<TouchableOpacity style={styles.loginButton} onPress={() => { this.setState({ advancedFilter: false }) }}>
							<Text style={styles.text}>Updated Filter Settings</Text>
						</TouchableOpacity>
					</View>
				</View>
			)
		}
		else {
			return (
				<View>
				</View>
			)
		}
	}

	viewMore = (length) => {
		if (length == 1) {
			Alert.alert("No More Entries")
		}
		else {
			this.setState({
				offset: this.state.offset + 2,
			}, () => {
				this.createCurl()
			});
		}
	}
	viewLess = (length) => {
		if (length >= 2) {
			Alert.alert("Cannot go back")
		}else{
		this.setState({
			offset: this.state.offset - 2,
		}, () => {
			this.createCurl()
		});
	}
	}

	displayStarRating(size, style, rating) {
		return (
			<StarRating
				disabled={false}
				fullStarColor="#eaca97"
				maxStars={5} // 5
				rating={rating}
				starSize={size} //20
				style={style}
			/>
		)
	}


	presentResults = () => {
		if (this.state.searchResponse == "") {
			return (
				<View>
					<Text></Text>
				</View>
			)
		} else {
			console.log(this.state.searchResponse.length)
			return (
				<View style = {{marginTop: 10}}>
					<FlatList
						data={this.state.searchResponse}
						renderItem={({ item, index }) => (
							<TouchableOpacity onPress={()=>{{console.log("You clicked id " + item.location_id)}}}>
							<View style={{flex: 1}}>
							<View style={styles.resultContainer}>
								<Text style={styles.title}>{item.location_name}</Text>
								<Text style={styles.location_town}>{item.location_town}</Text>

									<View style={styles.reviewRow}>
										<View style={{ flex: 1 }}>
											<Text>Overall Rating</Text>
											<Text>{this.displayStarRating(20, styles.starContainer, item.avg_overall_rating)}</Text>
										</View>
										<View style={{ flex: 1, alignItems: 'flex-end' }}>
											<Text>Cleanliness Rating</Text>
											<Text>{this.displayStarRating(20, styles.starContainer, item.avg_clenliness_rating)}</Text>
										</View>
									</View>
									<View style={styles.reviewRow}>
										<View style={{ flex: 1 }}>
											<Text>Price Rating</Text>
											<Text>{this.displayStarRating(20, styles.starContainer, item.avg_price_rating)}</Text>
										</View>
										<View style={{ flex: 1, alignItems: 'flex-end' }}>
											<Text>Quality Rating</Text>
											<Text>{this.displayStarRating(20, styles.starContainer, item.avg_quality_rating)}</Text>
										</View>
									</View>
							</View>
							</View>
							</TouchableOpacity>
						)}
						keyExtractor={(item, index) => index.toString()}
					/>
					<View style={{flexDirection : 'row'}}>
					<View style={{flex:1}}>
							<TouchableOpacity onPress={()=>{this.viewLess(this.state.searchResponse.length)}} >
								<Text>Previous Page</Text>
							</TouchableOpacity>
						</View>
						<View style={{alignContent:'flex-end'}}>
							<TouchableOpacity onPress={()=>{this.viewMore(this.state.searchResponse.length)}}>
								<Text>Next Page</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			)
		}
	}


	render() {
		const navigation = this.props.navigation;
		const searchIcon = <Icon name="search" size={20} color="#fff" />;

		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.mainTitle}>Search</Text>
				</View>
				<View style={styles.footer}>
					<View style={{flexDirection:'row'}}>
						<TextInput style={styles.textinput} placeholder="Seach By Cafe Name Or Location" onChangeText={(text) => { this.setState({ cafe_name: text }), this.setState({ offset: 0 }) }} value={this.state.cafe_name} />
						<TouchableOpacity style={styles.loginButton} onPress={() => { this.createCurl() }}>
							<Text style={styles.text}>{searchIcon}</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity onPress={() => { this.setState({ advancedFilter: !this.state.advancedFilter }) }} >
							<Text style={{ textAlign: 'center', color: '#000' }}>Advanced Search</Text>
						</TouchableOpacity>
					<this.emptyFunction />
					<this.presentResults />

				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	reviewRow:{
        flexDirection: 'row'
    },
	starContainer: {
		width: '20%'
	},
	location_town: {
		marginBottom: 10,
		color: 'grey'
	},
	resultContainer: {
		backgroundColor: '#F2F2F2',
		padding: 20,
		marginBottom: 20,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
		elevation: 6,
		width: '100%'
	},
	filterOptionsRow: {
		flexDirection: 'row',
		alignContent: 'flex-start'
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
		paddingVertical: 50
	},
	text: {
		textAlign: 'center',
		color: '#fff',
		marginBottom: 20
	},
	title: {
		display: 'flex',
		color: '#eaca97',
		fontSize: 25,
		fontWeight: "bold",
	},
	mainTitle: {
		display: 'flex',
		color: '#fff',
		fontSize: 40,
		fontWeight: "bold",
	},
	loginTitle: {
		color: '#502b10',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10
	},
	subtitle: {
		marginBottom: 20
	},
	loginButton: {
		flex: 1,
		height: 40,
		backgroundColor: "#eaca97",
		padding: 10,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	},
	textinput: {
		height: 40,
		flex: 3,
		marginBottom: 10,
		borderColor: '#eaca97',
		borderWidth: 1,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	}
})
