import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
  Button,
  Item,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import DoubleClick from 'react-native-double-tap';


import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

import style from './stylesheet'



export default class CameraPage extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      imagePath: "",
      current_id: 0,
      review_id: 0
    }
  }

  componentDidMount() {
    const route = this.props.route
    const { id } = route.params;
    this.setState({
        current_id: id,
    }, () => {
        console.log("Updated current id from 0 to " + this.state.current_id)
        this.get_getInfo()
    });
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
            const new_list = []
            responseJson.reviews.forEach((item) => {
                new_list.push(item.review.review_id)
            });
            let highest_value = Math.max.apply(Math, new_list)
            this.setState({review_id: highest_value})
            console.log(this.state.review_id)

        })
        .catch((error) => {
            console.log(error)
        })
}

  takePicture = async () => {
    const options = { quality: 0.5, base64: true }
    const data = await this.camera.takePictureAsync(options)

    Alert.alert("You Have Taken a Photo", "Your photo has been saved, would you like to view this photo, or take another one?",[
        {
          text: "Submit Photo",
          onPress: () => this.post_photo(data)
        },
        {
          text: "Retake Photo",
          onPress: () => console.log("Retake Pressed"),
        },
      ])
}


    async post_photo (data) {
		const navigation = this.props.navigation;
		console.log("Post Request Made For Login")
		return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+this.state.current_id + "/review/" + this.state.review_id + "/photo", 

			{
				method: 'post',
                headers: {'Content-Type': 'image/jpeg', 'X-Authorization' : await AsyncStorage.getItem('@session_token')},
				body: data
			})
			.then((response)=> {
				if (parseInt(response.status) == 200)
				{
                    Alert.alert("Thanks!","We have submitted your review, you can check your review in Profile - My Reviews!", [{
                        text: "Okay",
                        onPress: ()=> navigation.navigate("Feed")
                    }])
				}
				if (parseInt(response.status) == 400)
				{
					Alert.alert("An Error Occured!", "Please Check your input and try again. "), 
                    console.log(response.status)	
                }
                if (parseInt(response.status) == 401)
				{
                    Alert.alert("Are You Logged In?", "An error occured, this usually means your not logged in.")				
                }
                if (parseInt(response.status) == 404)
				{
                    Alert.alert("An Error Occured", "Please try again soon.")				
                }
                if (parseInt(response.status) == 500)
				{
                    Alert.alert("Server Error", "Please check your internet connection, if this problem persists please contact our team")				
                }
			})
			.catch((error) => {
				console.log(error);
			})
	}




  render() {
    const camera = <Icon name="camera" size={50} color="#fff" />;

    return (
      <View style={style.displayCamera}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }} captureAudio={false}
          defaultTouchToFocus
          mirrorImage={false}
          style={{ flex: 1 }}
        />
          <TouchableOpacity  onPress={()=>{this.takePicture()}}>
            <Text style={style.cameraBorder}>{camera}</Text>
          </TouchableOpacity>
        <View style={style.cameraHeader}>
          <Text style={style.cameraTitle}>Camera</Text>
        </View>
      </View>



    );
  }
}
