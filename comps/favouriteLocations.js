import React, { Component, useEffect, useState } from 'react';

import { Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './login'
import SignUp from './signup'
import StarRating from 'react-native-star-rating';




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
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>Favourite Locations</Text>
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
							data={this.state.user_details.favourite_locations}
							renderItem={({ item, index }) => (
								<View style={styles.reviewContainer}>
									<Text style={styles.reviewTitle}>{item.location_name}</Text>
                                    <Text>Overall Rating</Text>
                                    <View style={styles.starContainer}>
                                    <StarRating
											disabled={false}
											fullStarColor="#eaca97"
											maxStars={5}
											rating={item.avg_overall_rating}
											starSize={20}
										/>
                                        </View>
                                        <TouchableOpacity style={styles.deleteButton} onPress={()=>{this.press_delete(item.location_name, item.location_id)}}>
									<Text style={styles.text}>Remove From Favourites</Text>
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
		elevation: 6,

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
        padding: 30,
        
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
        marginTop: 20
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