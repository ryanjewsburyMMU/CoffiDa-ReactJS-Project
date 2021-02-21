import React, { Component, useEffect, useState } from 'react';

import { Text, View, TouchableOpacity, ActivityIndicator, Alert, PermissionsAndroid, Linking} from 'react-native';

import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import style from '../../../Styles/stylesheet'

import DoubleClick from 'react-native-double-tap';
import Geolocation from 'react-native-geolocation-service'
import { getDistance } from 'geolib';
import { CheckBox } from 'native-base';


async function requestLocationPermission(){
	try{
	  const granted = await PermissionsAndroid.request(
		PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
		{
		  title: "Location Permission",
		  message: "Please allow location we won't hack u we promnise xx",
		  buttonNeutral: "Nah son, maybe in time ya get me?",
		  buttonNegative: "Mate get out of here",
		  buttonPositive: "Yeah lard go on then",
		},
	  );
	  if(granted === PermissionsAndroid.RESULTS.GRANTED){
		console.log("Location can be accessed")
		return true
	  }else{
		console.log("Location access denied")
		return false
	  }
	}catch(error){
	  console.log("error")
	}
  }

export default class Feed extends Component {
	constructor(props) {
		super(props),
			this.state = {
				isLoading: true,
				location_data: [],
				favourite_locations: [],
				favourite_locations_id: [],
				current_state_icon: "Yes",
				location: null,
				locationPermission: false,
				long: "",
				lat: ""
			}
	}
	componentDidMount (){
		this.unsubscribe = this.props.navigation.addListener('focus', () => {
			this.checkLoggedIn()
			console.log("Screen Aciviated")

	})
	}
	componentWillUnmount(){
		this.unsubscribe()
		}

	checkLoggedIn = async () => {
		const navigation = this.props.navigation;

		const token = await AsyncStorage.getItem('@session_token')
		console.log("token is === " + token)

		if (token === null) {
			Alert.alert("Please Login To Access This Page", "We ask that you create an account in order to access these features!")
			navigation.navigate('Profile')

		} else {
			
		this.get_getInfo()
		this.findLocation()
		this.get_locations();
		this.get_getInfo();
		}
	}

	findLocation = () =>{
		if(!this.state.locationPermission){
		  console.log(this.state.locationPermission)
		  this.state.locationPermission = requestLocationPermission();
		}
		Geolocation.getCurrentPosition(
		  (position) => {
			const location = position
			this.setState(
			  {
				long : location.coords.longitude,
				lat : location.coords.latitude,
				location: location
			  })
		  },
		  (error) =>{
			Alert.alert(error.message)
		  },
		  {
			enableHighAccuracy: true,
			timeout: 20000,
			maximumAge: 1000
		  }
		  )
	  }

	async post_addFavourite(location_id) {
		const navigation = this.props.navigation;

		console.log("Post Request Made For Add Fave")
		return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/favourite",
			{
				method: 'post',
				headers: { 'Content-Type': 'application/json', 'X-Authorization': await AsyncStorage.getItem('@session_token') },
			})
			.then((response)=> {
				if (parseInt(response.status) == 200)
				{
					console.log("Login Success - Code: " + response.status)
					this.get_getInfo()
				}
				if (parseInt(response.status) == 400)
				{
					console.log(" Unsucesful - Code: " + response.status)		
				}
				if (parseInt(response.status) == 401)
				{
					console.log(" Unauthorised - Code: " + response.status)		
				}
				if (parseInt(response.status) == 404)
				{
					console.log(" Error updated - Code: " + response.status)		
				}
				if (parseInt(response.status) == 500)
				{
					console.log("Server Error, Please try again soon.  " + response.status)	
				}
			})
			.catch((error) => {
				console.log(error);
			})
	}

	async delete_removeFavourite(location_id) {
		const navigation = this.props.navigation;

		console.log("Post Request Made For Add Fave")
		return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/favourite",
			{
				method: 'delete',
				headers: { 'Content-Type': 'application/json', 'X-Authorization': await AsyncStorage.getItem('@session_token') },
			})
			.then((response)=> {
				if (parseInt(response.status) == 200)
				{
					console.log("Login Success - Code: " + response.status)
					this.get_getInfo()
				}
				if (parseInt(response.status) == 400)
				{
					console.log(" Unsucesful - Code: " + response.status)		
				}
				if (parseInt(response.status) == 403)
				{
					console.log(" Forbidden - Code: " + response.status)		
				}
				if (parseInt(response.status) == 404)
				{
					console.log(" Error updated - Code: " + response.status)		
				}
				if (parseInt(response.status) == 500)
				{
					console.log("Server Error, Please try again soon.  " + response.status)	
				}
			})
			.catch((error) => {
				console.log(error);
			})
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
					favourite_locations: responseJson.favourite_locations
				})
				const new_list = []
				this.state.favourite_locations.forEach((item) => {
					new_list.push(item.location_id)
				});
				this.setState({ favourite_locations_id: new_list })
				console.log("ID OF FAV LOCATIONS:")
				console.log(this.state.favourite_locations_id)
				this.setState({isLoading: false})

			})
			.catch((error) => {
				console.log(error)
			})
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
				this.setState({ location_data: responseJson })
			})
			.catch((error) => {
				console.log("errrr = " + error)
			})
	}

	isFavourited(currentID) {
		var favourite_icon = <Icon name="heart" size={30} color="#900" />
		var not_favourite_icon = <Icon name="heart-o" size={30} color="#900" />


		if (this.state.favourite_locations_id.includes(currentID) == true) {
			return (
				<View>
					<DoubleClick
						singleTap={() => {
							this.delete_removeFavourite(currentID)
						}}
						doubleTap={() => {
							this.post_addFavourite(currentID)
						}}
						delay={200}
					>
					<Text>{favourite_icon}</Text>
					</DoubleClick>					
				</View>)
		}
		else {
			return (
				<View>
					<DoubleClick
						singleTap={() => {
							console.log("You have unfavourited " + currentID);
							this.delete_removeFavourite(currentID)

						}}
						doubleTap={() => {
							console.log("You have favourited " + currentID);
							this.post_addFavourite(currentID)
						}}
						delay={200}
					>
						<Text>{not_favourite_icon}</Text>
					</DoubleClick>
				</View>)
		}
	}

	findDistance(lat, long){
		if(this.state.long == ""){
			return(
				<View>
					<Text>Calculating Distance...</Text>
				</View>
			)
		}
		else{
		let distance = getDistance({latitude: this.state.lat, longitude: this.state.long}, {
				latitude: lat,
				longitude: long,
				}
			)
		let miles = Math.round((parseInt(distance) * 0.00062137))
			return(
			<View>
				<Text>{miles} Miles Away</Text>
			</View>
			)
		}
	}

	async generateMapDirections(destLat, destLong){
		if(this.state.longitude == ""){
			Alert.alert("No Directions Found", "Please ensure you have locations enabled.")
		}else{
			let address = "https://www.google.com/maps/dir/?api=1&origin="+this.state.lat+","+this.state.long+"&destination="+destLat+","+destLong
			await Linking.openURL(address);
		}
	}


	render() {
		const navigation = this.props.navigation;
		const favourite_icon = <Icon name="heart-o" size={30} color="#900" />
		const opencloseDrawer = <Icon name="circle" size={30} color="#900" />


		if(this.state.isLoading == true){
			return(<View>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>)
		}

		return (
			<View style={style.mainContainer}>
				<View style={style.mainHeader}>
					<View style={style.flexRow}> 
							<Text style={style.mainTitle}>Your Feed</Text>
					</View>
				</View>
				<View style={style.mainFooter}>
					<ScrollView>
						<View>
							{this.state.location_data.map((locationData, index) => (
								<View key={index}>
									<View style={style.feedContainer}>
										<Text style={style.locationTitle}>{locationData.location_name}</Text>
										<Text style={style.textCenterGrey}>{locationData.location_town}</Text>
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
									<View style={style.alignCenter}>
										<Text>Favourite This Location?</Text>
										<Text>{this.isFavourited(locationData.location_id)}</Text>
										<TouchableOpacity onPress={()=>{this.generateMapDirections(locationData.latitude, locationData.longitude)}}>
											<Text> {this.findDistance(locationData.latitude, locationData.longitude)}</Text>
										</TouchableOpacity>
										<TouchableOpacity style={style.mainButton} onPress={() => {navigation.navigate("ReviewPage", { id: locationData.location_id, name: locationData.location_name, photo_path: locationData.photo_path })}}>
											<Text style={style.textCenterWhite}>See Reviews for {locationData.location_name}</Text>
										</TouchableOpacity>
										<TouchableOpacity style={style.mainButtonWhite} onPress={() => { navigation.navigate("CreateReviewPage", { id: locationData.location_id, name: locationData.location_name }) }}>
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

