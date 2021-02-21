import 'react-native-gesture-handler'
import React, {Component} from 'react';
import {View, Text, Image, ActivityIndicator, Alert, StyleSheet} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

import style from '../../../Styles/stylesheet'


export default class ViewPhoto extends Component{
    constructor(props){
        super(props)
        this.state = {
            review_id: 0,
            location_id : 0,
            photo: []
        }
    }
    componentDidMount() {
            const route = this.props.route
            const { id, review_id } = route.params;
            this.setState({
				location_id: id ,
                review_id: review_id
			}, () => {
                this.search_results()
			});
        }

	async search_results() {
        const navigation = this.props.navigation
		console.log("Searching the database for your search queires")
		return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+this.state.location_id+"/review/"+this.state.review_id+"/photo",
			{
				method: 'get',
				headers: { 'Content-Type': 'image/jpeg', 'X-Authorization': await AsyncStorage.getItem('@session_token') },
			})

			.then((response) => {
				if (parseInt(response.status) == 200) {
					return response
				}
				if (parseInt(response.status) == 404) {
					Alert.alert("Incorrect Details (" + response.status + ")", "Please ensure your email and password are correct, if the problem persits please contact our team for more support.")

				}
				if (parseInt(response.status) == 500) {
					console.log("Server Error, Please try again soon.  " + response.status)
					Alert.alert("Connection Error", "We are struggling to connect with you! Please try again or contact our team for further support.")
				}
			})
			.then((responseJson) => {
                console.log(responseJson)
                if(responseJson == undefined){
                    Alert.alert("No Images", "There are no images for this review.", [{ text: "Okay", onPress: (navigation.goBack())}])
                }
                else{
                this.setState({photo: responseJson})
                }
			})
			.catch((error) => {
				console.log(error);
			})
	}
    

    render(){
        const navigation = this.props.navigation
        console.log(this.state.photo)
        if(this.state.photo == ""){
            <View>
                <ActivityIndicator/>
            </View>
        }
        return(
        <View style={style.mainContainer}>
            <View style={style.mainHeader}>
                <Text style={style.mainTitle}>Photos</Text>
            </View>
            <View style={style.mainFooter}>
                <TouchableOpacity style={style.mainButton} onPress={()=>{navigation.goBack()}}>
                    <Text style={style.textCenterWhite}>Go Back</Text>
                    </TouchableOpacity>
            <Image
                style={{width: '100%', height:'90%', marginTop: 20}}
                    source={{
                    uri:
                        this.state.photo.url
                    }}
      />

            </View>
        </View>
        )
    }
}