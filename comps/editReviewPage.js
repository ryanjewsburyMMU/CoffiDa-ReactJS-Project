import React, {Component, useEffect, useState} from 'react';

import {Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions,TouchableOpacity, forceUpdate, Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import StarRating from 'react-native-star-rating';


import AsyncStorage from '@react-native-async-storage/async-storage';



export default class EditReview extends Component {
	constructor(props) {
		super(props)
		this.state = {			
			review_id: "",
			location_id: "",
			clenliness_rating: "",
			price_rating: "",
			overall_rating: "",
			quality_rating: "",
			review_body: "",

			new_clenliness_rating: "",
			new_price_rating: "",
			new_overall_rating: "",
			new_quality_rating: "",
			new_review_body: ""
		}

	}

	componentDidMount() {
		const route = this.props.route
		const { review_id, location_id, clenliness_rating,price_rating, overall_rating, quality_rating, review_body} = route.params;
		this.setState({ review_id: review_id })
		this.setState({ location_id: location_id })
		this.setState({ clenliness_rating: clenliness_rating })
		this.setState({ price_rating: price_rating })
		this.setState({ overall_rating: overall_rating })
		this.setState({ quality_rating: quality_rating })
		this.setState({ review_body: review_body })


		this.setState({ new_clenliness_rating: clenliness_rating })
		this.setState({ new_price_rating: price_rating })
		this.setState({ new_overall_rating: overall_rating })
		this.setState({ new_quality_rating: quality_rating })
		this.setState({ new_review_body: review_body })


	}

	onStarPress_OverallRating(rating) {
        this.setState({
            new_overall_rating: rating
        });
    }
    onStarPress_Price(rating) {
        this.setState({
            new_price_rating: rating
        });
    }
    onStarPress_Quality(rating) {
        this.setState({
            new_quality_rating: rating
        });
    }
    onStarPress_Clenliness(rating) {
        this.setState({
            new_clenliness_rating: rating
        });
    }



	async patch_review(){
		console.log("Patch Request Made to Updated User Information")
		let to_send = {};
		
		if(this.state.clenliness_rating != this.state.new_clenliness_rating){
			to_send['clenliness_rating'] = this.state.new_clenliness_rating
		}
		if(this.state.price_rating != this.state.new_price_rating){
			to_send['price_rating'] = this.state.new_price_rating
		}
		if(this.state.overall_rating != this.state.new_overall_rating){
			to_send['overall_rating'] = this.state.new_overall_rating
		}
		if(this.state.quality_rating != this.state.new_quality_rating){
			to_send['quality_rating'] = this.state.new_quality_rating
		}
		if(this.state.review_body != this.state.new_review_body){
			to_send['review_body'] = this.state.new_review_body
		}

		return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+this.state.location_id + "/review/" +this.state.review_id,
			{
				method: 'patch',
				headers: {'Content-Type': 'application/json', 'X-Authorization' : await AsyncStorage.getItem('@session_token')},
				body: JSON.stringify(to_send)		
			})
			.then((response) =>{
				// Add error catching here
				if(response.status == "200"){
					Alert.alert("Item has been updated")
					this.props.navigation.goBack()
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




	 	render(){
			const navigation = this.props.navigation;
	 		return(
	 			<View style={styles.container}>
	 				<View style={styles.header}>
						<Text style={styles.title}>Edit Review</Text>
					</View>
					<View style={styles.footer}>
					<ScrollView>
						<TouchableOpacity onPress={()=> {navigation.goBack()}}>
							<Text>Go Back</Text>
							</TouchableOpacity>
                    <Text style={styles.title}>How Would You Rate Your Overall Experience?</Text>
                    <StarRating
                        disabled={false}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        halfStar={'star-half'}
                        iconSet={'FontAwesome'}
                        maxStars={5}
                        starSize={30}
                        rating={parseInt(this.state.new_overall_rating)}
                        selectedStar={(rating) => this.onStarPress_OverallRating(rating)}
                        fullStarColor={'#eaca97'}
                    />
                    <Text style={styles.title}>How Would You Rate The Price?</Text>
                    <StarRating
                        disabled={false}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        halfStar={'star-half'}
                        iconSet={'FontAwesome'}
                        maxStars={5}
                        starSize={30}
                        rating={parseInt(this.state.new_price_rating)}
                        selectedStar={(rating) => this.onStarPress_Price(rating)}
                        fullStarColor={'#eaca97'}
                    />
                     <Text style={styles.title}>How Would You Rate The Quality?</Text>
                    <StarRating
                        disabled={false}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        halfStar={'star-half'}
                        iconSet={'FontAwesome'}
                        maxStars={5}
                        starSize={30}
                        rating={parseInt(this.state.new_quality_rating)}
                        selectedStar={(rating) => this.onStarPress_Quality(rating)}
                        fullStarColor={'#eaca97'}
                    />
                     <Text style={styles.title}>How Would You Rate The Clenliness?</Text>
                    <StarRating
                        disabled={false}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        halfStar={'star-half'}
                        iconSet={'FontAwesome'}
                        maxStars={5}
                        starSize={30}
                        rating={parseInt(this.state.new_clenliness_rating)}
                        selectedStar={(rating) => this.onStarPress_Clenliness(rating)}
                        fullStarColor={'#eaca97'}
                    />
                    <Text style={{marginTop: 30}}>Update Your Comment: </Text>
                    <TextInput placeholder={this.state.review_body} multiline={true} onChangeText={(text) => {this.setState({new_review_body: text})}}
                    numberOfLines={4} value={this.state.new_review_body}>
                    </TextInput>

                    <TouchableOpacity style={styles.loginButton} onPress={()=>{this.patch_review()}}>
                        <Text style={styles.text}>Submit Review</Text>
                    </TouchableOpacity>
					
                    </ScrollView>


					</View>
	 			</View>
	)}
}

const styles = StyleSheet.create({
	test: {
		textAlign: 'right'
	},
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
		justifyContent: 'flex-end',
		marginLeft: 20,
		marginBottom: 10
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
		textAlign: 'center',
		marginBottom: 10,
	},
    title: {
        display: 'flex',
        color: '#eaca97',
        fontSize: 18,
        fontWeight: "bold",
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20
    },
	loginTitle:{
		color: '#502b10',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
		textAlign: 'center'
	},
	subtitle:{
		marginBottom: 20
	},
	loginButton: {
		alignItems: "center",
		width: "100%",
		height:40,
		backgroundColor: "#eaca97",
		padding: 10,
		marginTop: 20,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		marginBottom: 20
	},
	signupButton: {
		alignItems: "center",
		width: "100%",
		height:40,
		backgroundColor: "#fff",
		padding: 10,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		borderColor:'#eaca97',
		borderWidth: 1,
		marginBottom: 30
	},
	textinput:{
		marginBottom:10,
		borderColor:'#eaca97',
		borderWidth: 1,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	}
})
