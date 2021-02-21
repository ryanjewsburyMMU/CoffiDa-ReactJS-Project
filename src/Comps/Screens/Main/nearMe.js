import React, { Component, useEffect, useState } from 'react';

import { Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions, TouchableOpacity, Linking, Alert, PermissionsAndroid, ActivityIndicator} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating';

import Geolocation from 'react-native-geolocation-service'
import { getDistance } from 'geolib';
import style from '../../../Styles/stylesheet'

async function requestLocationPermission(){
	try{
	  const granted = await PermissionsAndroid.request(
		PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
	  );
	  if(granted === PermissionsAndroid.RESULTS.GRANTED){
		console.log("Location can be accessed")
		return true
	  }else{
		console.log("Location access denied")
		return false
	  }
	}catch(error){
	  console.log(error)
	}
  }


export default class NearMe extends Component {
	constructor(props) {
		super(props)
		this.state = {
            location: null,
            locationPermission: false,
            long: "",
            lat: "",
			location_data: [],
            closest_location: [],
            locationDidLoad: false,
            closest_distance: "",
            closest_lat: 0,
            closest_long: 0
        }
    }

    componentDidMount(){
        this.findLocation()
        this.get_locations()
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
			  },()=>{console.log("State set succesfuly")})
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
                    console.log("Success finding locations")
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

    async get_location_info(id) {
        console.log("Finding Locations")
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + id,
            {
                headers: { 'Content-Type': 'application/json', 'X-Authorization': await AsyncStorage.getItem('@session_token') },
            })

            .then((response) => {
                if (response.status == "200") {
                    console.log("Sucess")
                    return response.json()
                }
                if (response.status == "403") {
                    console.log("error 400")
                }
                else {
                    console.log("ELSE TRIGGERED")
                }
            })

            .then(async (responseJson) => {
                console.log("We have found the closest location data")
                this.setState({ closest_location: responseJson, locationDidLoad: true })
                console.log(this.state.closest_location)
            })

            .catch((error) => {
                console.log("error = " + error)
            })
    }

    handleNearestLocations(){
        let location_distances = []
        this.state.location_data.forEach((item) => {
            let current_distance = getDistance({latitude: this.state.lat, longitude: this.state.long}, {
				latitude: item.latitude,
				longitude: item.longitude,
				}
			)
                location_distances.push({ id:item.location_id, distance: current_distance, lat: item.latitude, long: item.longitude })
                console.log(item.longitude, item.latitude)
        });          
        var result = location_distances.reduce(function(res, obj) {
            return (obj.distance < res.distance) ? obj : res;
        });
        this.setState({
            closest_distance: Math.round((parseInt(result.distance) * 0.00062137)),
            closest_lat: result.lat,
            closest_long: result.long
        },()=>{
            this.get_location_info(result.id)
        })
    }

    displayStarRating(size, style, rating) {
		return (
			<StarRating
				disabled={false}
				fullStarColor="#eaca97"
				maxStars={5}
				rating={rating}
				starSize={size}
				style={style}
			/>
		)
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
		const searchIcon = <Icon name="search" size={20} color="#fff" />;
		console.log("STARTING OFF SET = " + this.state.offset)
        if(this.state.long == ""){
            return(
                <View style={style.mainContainer}>
				<View style={style.mainHeader}>
					<Text style={style.mainTitle}>Near Me</Text>
				</View>
				<View style={style.mainFooter}>
                   <Text>Please Wait while we load this page...</Text>
				</View>
			</View>)
        }else{
		return (
			<View style={style.mainContainer}>
				<View style={style.mainHeader}>
					<Text style={style.mainTitle}>Near Me</Text>
				</View>
				<View style={style.mainFooter}>
                    <Text style={style.subTitle}>Want Coffee Now?</Text>
                    <TouchableOpacity style={style.mainButton} onPress={()=>{this.handleNearestLocations()}}>
                        <Text style={style.textCenterWhite}>Find me a coffee shop!</Text>
                    </TouchableOpacity>
                    {this.state.locationDidLoad ?
                    <View style={style.gapTop}>
                            <Text style={style.textCenterBlack}>Great! We Found You a cafe!</Text>
                            <Text style={style.textCenterBlack}>It is {this.state.closest_distance} miles away! {"\n"}</Text>
                        <View style={style.resultContainer}>
                        <View style={style.alignCenter}>
                            <Text style={style.containerTitle}>{this.state.closest_location.location_name}</Text>
                                <Text>Overall Rating</Text>
                                <Text>{this.displayStarRating(20, style.starContainer, this.state.closest_location.avg_overall_rating)}</Text>
                            </View>
                            <TouchableOpacity style={style.mainButton} onPress={()=>{this.generateMapDirections(this.state.closest_lat, this.state.closest_long)}}>
                                <Text style={style.textCenterWhite}>Take me there!</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={style.mainButtonWhite} onPress={() => {navigation.navigate("ReviewPage", { id: this.state.closest_location.location_id, name: this.state.closest_location.location_name, photo_path: this.state.closest_location.photo_path })}}>
                                <Text>View This Page On Your Feed?</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                : <View>
                    <Text></Text>
                    </View>}
				</View>
			</View>
		)
        }
	}
}