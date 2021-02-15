import React, { Component, useEffect, useState } from 'react';

import { Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions, TouchableOpacity, Object } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Reviews extends Component {
    constructor(props) {
        super(props);
        this.state = {
            review_likes: [],
            
        }
    }

    componentDidMount() {
        this.get_reviewLikes() 
	}

    async get_reviewLikes(id) {
		console.log("Get Request Made For details")
		return fetch("http://10.0.2.2:3333/api/1.0.0/user/" + await AsyncStorage.getItem('@user_id'),
			{
				method: 'get',
				headers: { 'Content-Type': 'application/json', 'X-Authorization': await AsyncStorage.getItem('@session_token') },
			})

			.then((response) => response.json())
			.then(async (responseJson) => {
				this.setState({
					review_likes: responseJson.reviews
				})
                const new_list = []
				this.state.review_likes.forEach((item) => {
					new_list.push(item.review.likes)
                    console.log(item.review.likes)
                    this.setState({review_likes: new_list})

				});
                console.log(this.state.review_likes)


            })
			.catch((error) => {
				console.log(error)
			})
	}

    render() {
        const reviewData = this.props.reviewData
        const id = this.props.current_id
        console.log(id)
        console.log(reviewData)
        return (
            <View>
                <View>
                    <Text>Test Help Us pls</Text>
                    {reviewData.location_reviews.map((locationData, index) => (
                        <View key={index}>
                            <Text>{locationData.review_id}</Text>
                            <Text>{locationData.review_body}</Text>
                            <Text>Likes: {locationData.likes}</Text>
                            <Text>Likes this review?</Text>
                            <Text>       </Text>


                        </View>
                    ))}
                </View>
            </View>
        )

    }
}
