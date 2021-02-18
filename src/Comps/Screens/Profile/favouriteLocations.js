import React, { Component, useEffect, useState } from 'react';

import { Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './login'
import SignUp from './signup'
import StarRating from 'react-native-star-rating';


import style from '../../../Styles/stylesheet'


export default class FavouriteLocations extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_details: [],

        }
    }

    componentDidMount() {
        this.get_getInfo()
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
                    user_details: responseJson,
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    	
	press_delete(title, location_id){
		Alert.alert("Are You Sure?", "Are you sure you want to remove " + title + " from your favourites?",
		[
			{
			  text: 'Yes, Remove',
			  onPress: () => this.delete_removeFavourite(location_id)

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


		if(this.state.user_details == []){
			return(
				<View>
					<Text>Loading</Text>
					</View>
			)
		}else{
		return (
			<View style={style.mainContainer}>
				<View style={style.mainHeader}>
					<Text style={style.mainTitle}>Favourite Locations</Text>
				</View>
					<View style={style.mainFooter}>
                    <ScrollView>
					<Text style={style.containerTitle}></Text>

					<View>
						<TouchableOpacity
							onPress={() => this.props.navigation.goBack()} style={style.mainButton}>
							<Text style={style.textCenterWhite}>Go Back:</Text>
						</TouchableOpacity>
						<FlatList
							data={this.state.user_details.favourite_locations}
							renderItem={({ item, index }) => (
								<View style={style.resultContainer}>
									<Text style={style.containerTitle}>{item.location_name}</Text>
                                    <Text>Overall Rating</Text>
                                    <View style={style.starContainer}>
                                    <StarRating
											disabled={false}
											fullStarColor="#eaca97"
											maxStars={5}
											rating={item.avg_overall_rating}
											starSize={20}
										/>
                                        </View>
                                        <TouchableOpacity style={style.deleteFavourite} onPress={()=>{this.press_delete(item.location_name, item.location_id)}}>
									<Text style={style.textCenterWhite}>Remove From Favourites</Text>
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

