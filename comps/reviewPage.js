import React, { Component, useEffect, useState } from 'react';

import { Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions, TouchableOpacity, Object} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ReviewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location_data: [],
            current_id: null
        }
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
                // console.log(responseJson)
                const result = Object.values(responseJson)
                console.log("Result is")
                console.log(result)
                // console.log(result);
                this.setState({ location_data: result })
            })
            .catch((error) => {
                console.log("error = " + error)
            })
    }

    componentDidMount() {
        const route = this.props.route
        const { id } = route.params;
        this.setState({ current_id: id })
        this.get_locations(id)
    }

    render() {
        const navigation = this.props.navigation;
        console.log("logging data")
        console.log(this.state.location_data)

        return (
            <View>
                {
                    this.state.location_data.map((rowdata, i)=>
                    <View>
                        {rowdata.location_id}
                    </View>
                    )
                }
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
        fontSize: 30,
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
        height: 40,
        padding: 10,
        marginTop: 20,
        marginBottom: 70,
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