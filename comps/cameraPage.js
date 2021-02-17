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
      <View style={{ flex: 1, width: '100%', height: '100%' }}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }} captureAudio={false}
          defaultTouchToFocus
          mirrorImage={false}
          style={{ flex: 1 }}
        />
          <TouchableOpacity  onPress={()=>{this.takePicture()}}>
            <Text style={{backgroundColor: 'rgba(234,202,151,0.7)', width: '100%', textAlign: 'center', padding: 10, marginTop: 10}}>{camera}</Text>
          </TouchableOpacity>
        <View style={styles.borderTest}>
          <Text style={styles.cameraTitle}>Camera</Text>
        </View>
      </View>



    );
  }
}

const styles = StyleSheet.create({
  takePhotoStyle:{
    position: 'absolute',
    justifyContent: 'flex-end',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  borderTest:{
    position: 'absolute',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#eaca97',
    padding: 10,
    borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
  },
  cameraTitle: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30
  },
})
