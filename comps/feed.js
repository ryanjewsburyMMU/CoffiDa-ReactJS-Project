import React, {Component, useEffect, useState} from 'react';

import {Text, View, Button, TextInput, FlatList, ListItem, StyleSheet, Dimensions,TouchableOpacity,} from 'react-native';

export default class Feed extends Component{
        constructor(props){
                super(props),
                this.state = {
                        isLoading : true,
                        review_data : []
                }
        }


        getReviews = () =>{
                 console.log("Getting Reviews")
        }




	emptyFunction = () =>{
			console.log("Testing")
		}

	 	render(){
			const navigation = this.props.navigation;

	 		return(
	 			<View style={styles.container}>
	 				<View style={styles.header}>
						<Text style={styles.title}>Your Feed</Text>
					</View>
					<View style={styles.footer}>
						<Text style={styles.loginTitle}></Text>
					</View>
	 			</View>
	)}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
                backgroundColor: '#eaca97',
	},
	header:{
		flex: 1,
                justifyContent: 'center',
                alignItems: 'center'


	},
	footer:{
		flex: 5,
		backgroundColor: '#fff',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingHorizontal: 30,
		paddingVertical: 50
	},
	title:{
                display: 'flex',
		color: '#fff',
		fontSize: 30,
                fontWeight: "bold",
	},

})
