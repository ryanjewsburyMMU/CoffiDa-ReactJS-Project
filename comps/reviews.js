import React, { Component, useEffect, useState } from 'react';

import { Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions, TouchableOpacity, Object } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Reviews extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        const reviewData = this.props.reviewData
        console.log("DATA UNDER HERE !!!!!!!!!!")
        console.log(reviewData)
        return (
            <View>
                <View>
                    <Text>Test Help Us pls</Text>
                    {reviewData.location_reviews.map((locationData, index) => (
                        <View key={index}>
                            <Text>{locationData.review_id}</Text>
                            <Text>{locationData.review_body}</Text>

                        </View>
                    ))}
                </View>
            </View>
        )

    }
}
