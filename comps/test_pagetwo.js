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




export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      imagePath: ""
    }
  }
  takePicture = async () => {
    const options = { quality: 0.5, base64: true }
    const data = await this.camera.takePictureAsync(options)
    console.log(data.uri)
    this.setState({
      imagePath: data.uri
    }, () => {
      Alert.alert("You Have Taken a Photo", "Your photo has been saved, would you like to view this photo, or take another one?",[
        {
          text: "View Photo",
          onPress: () => console.log("View Photo, Now onto Navigation")
        },
        {
          text: "Retake Photo",
          onPress: () => console.log("Retake Pressed"),
        },
      ])
    });

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
