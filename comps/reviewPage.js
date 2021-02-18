import React, { Component, useEffect, useState } from 'react';

import { Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions, TouchableOpacity, Object, ActivityIndicator, Alert, Image } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

import DoubleClick from 'react-native-double-tap';
import Reviews from './reviews'
import StarRating from 'react-native-star-rating';
import style from './stylesheet'



export default class ReviewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            review_data: [],
            current_id: null,
            isLoading: true,
            liked_reviews: [],
            current_name: "",
            photo_path: ""
        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            const route = this.props.route
            const { id, name, photoPath } = route.params;
            this.setState({ current_id: id,  current_name: name, photoPath: photoPath })
        

            this.get_locations(id)
            this.get_getInfo()
        })
    }

    async post_addLike(location_id, review_id) {
        const navigation = this.props.navigation;

        console.log("Post Request made to addLike")
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/review/" + review_id + "/like",
            {
                method: 'post',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': await AsyncStorage.getItem('@session_token') },
            })
            .then((response) => {
                if (parseInt(response.status) == 200) {
                    console.log("Login Success - Code: " + response.status)
                    Alert.alert("Added Like")
                    this.get_getInfo(location_id)
                    this.get_locations(location_id)
                }
                if (parseInt(response.status) == 400) {
                    console.log(" Unsucesful - Code: " + response.status)
                }
                if (parseInt(response.status) == 401) {
                    console.log(" Unauthorised - Code: " + response.status)
                }
                if (parseInt(response.status) == 404) {
                    console.log(" Error code - Code: " + response.status)
                }
                if (parseInt(response.status) == 500) {
                    console.log("Server Error, Please try again soon.  " + response.status)
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    async delete_removeLike(location_id, review_id) {
        const navigation = this.props.navigation;

        console.log("Post Request made to addLike")
        return fetch("http://10.0.2.2:3333/api/1.0.0/location/" + location_id + "/review/" + review_id + "/like",
            {
                method: 'delete',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': await AsyncStorage.getItem('@session_token') },
            })
            .then((response) => {
                if (parseInt(response.status) == 200) {
                    console.log("Login Success - Code: " + response.status)
                    Alert.alert("Added Like")
                    this.get_getInfo(location_id)
                    this.get_locations(location_id)
                }
                if (parseInt(response.status) == 401) {
                    console.log(" Unauthorised - Code: " + response.status)
                }
                if (parseInt(response.status) == 403) {
                    console.log(" Forbidden code - Code: " + response.status)
                }
                if (parseInt(response.status) == 404) {
                    console.log(" Error code - Code: " + response.status)
                }
                if (parseInt(response.status) == 500) {
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
                    liked_reviews: responseJson.liked_reviews,
                })
                const new_list = []
                this.state.liked_reviews.forEach((item) => {
                    new_list.push(item.review.review_id)
                });
                this.setState({ liked_reviews: new_list })
                console.log("ID opf liked reviews:")
                console.log(this.state.liked_reviews)

            })
            .catch((error) => {
                console.log(error)
            })
    }

    async get_locations(id) {
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
                console.log("Result is")
                console.log(responseJson)
                this.setState({ review_data: responseJson })

            })

            .catch((error) => {
                console.log("error = " + error)
            })
    }

    //thumbs-o-up


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



    isLiked(location_id, review_id, likes) {
        var like_icon = <Icon name="thumbs-up" size={20} color="#fff" />
        var unlike_icon = <Icon name="thumbs-o-up" size={20} color="#fff" />
        if (this.state.liked_reviews.includes(review_id)) {
            return (
                <View>
                    <DoubleClick
                        singleTap={() => {
                            console.log("You have unliked " + review_id);
                            this.delete_removeLike(location_id, review_id)
                        }}
                        doubleTap={() => {
                            console.log("You have liked " + review_id);
                            this.post_addLike(location_id, review_id)

                        }}
                        delay={200}
                    >
                       <Text style={style.likeButtonText} >{like_icon} {likes} likes</Text>
                    </DoubleClick>
                </View>)
        } else {
            return (
                <View>
                    <DoubleClick
                        singleTap={() => {
                            console.log("You have unliked " + review_id);
                            this.delete_removeLike(location_id, review_id)
                            this.get_locations(location_id)

                        }}
                        doubleTap={() => {
                            console.log("You have liked " + review_id);
                            this.post_addLike(location_id, review_id)
                            this.get_locations(location_id)

                        }}
                        delay={200}
                    >
                        <Text style={style.likeButtonText} >{unlike_icon} {likes} likes</Text>
                    </DoubleClick>
                </View>)
        }

    }

    render() {
        const navigation = this.props.navigation;
        if (this.state.review_data == "") {
            return <View><ActivityIndicator size="large" />
            </View>
        }
        return (
            <View style={style.mainContainer}>
                <View style={style.mainHeader}>
                    <Text style={style.mainTitle}>Reviews</Text>
                </View>
                <View style={style.mainFooter}>
                    <FlatList
                        data={this.state.review_data.location_reviews}
                        renderItem={({ item, index }) => (
                            <View style={style.resultContainer}>
                                <Text style={style.containerTitle}>{this.state.current_name}</Text>
                                <Text>Review ID: {item.review_id}</Text>
                                <View style={style.flexRow}>
                                    <View style={style.flexOne}>
                                        <Text>Overall Rating</Text>
                                        <Text>{this.displayStarRating(20, style.starContainer, item.overall_rating)}</Text>
                                    </View>
                                    <View style={style.flexEnd}>
                                        <Text>Cleanliness Rating</Text>
                                        <Text>{this.displayStarRating(20, style.starContainer, item.clenliness_rating)}</Text>
                                    </View>
                                </View>
                                <View style={style.flexRow}>
                                <View style={style.flexOne}>
                                        <Text>Price Rating</Text>
                                        <Text>{this.displayStarRating(20, style.starContainer, item.price_rating)}</Text>
                                    </View>
                                    <View style={style.flexEnd}>
                                        <Text>Quality Rating</Text>
                                        <Text>{this.displayStarRating(20, style.starContainer, item.quality_rating)}</Text>
                                    </View>
                                </View>
                                <Text>User Comment: </Text>
                                <Text>{item.review_body}</Text>
                                <TouchableOpacity style={style.mainButton}>
                                    <Text style={style.textCenterWhite}>{this.isLiked(this.state.current_id, item.review_id, item.likes)}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={style.mainButtonWhite} onPress={()=>{navigation.navigate("ViewPhoto", {id: this.state.current_id, review_id : item.review_id})}}>
                                    <Text >View Photos</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
        )

    }
}