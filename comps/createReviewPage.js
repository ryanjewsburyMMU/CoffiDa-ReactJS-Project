import React, { Component, useEffect, useState } from 'react';

import { Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions, TouchableOpacity, Object } from 'react-native';

import StarRating from 'react-native-star-rating';

import Icon from 'react-native-vector-icons/FontAwesome';


import AsyncStorage from '@react-native-async-storage/async-storage';


export default class CreateReviewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current_id: "",
            current_name: "",
            starCount: 0

        }
    }

    componentDidMount() {
        const route = this.props.route
        const { id, name } = route.params;
        this.setState({ current_id: id })
        this.setState({ current_name: name })
    }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Write a Review For {this.state.current_name}</Text>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.loginTitle}>How Would You Rate Your Overall Experience?</Text>
                    <StarRating
                        disabled={false}
                        emptyStar={'star-o'}
                        fullStar={'star'}
                        halfStar={'star-half'}
                        iconSet={'FontAwesome'}
                        maxStars={5}
                        rating={this.state.starCount}
                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                        fullStarColor={'#eaca97'}
                    />

                    <TouchableOpacity style={styles.sign}onPress={()=>{this.setState({starCount: this.state.starCount + 0.5})}}>
                        <Text>Incremenrt By Half</Text>
                    </TouchableOpacity>

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
        fontSize: 25,
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
		height:40,
		backgroundColor: "#eaca97",
		padding: 10,
		marginTop: 20,
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

})