import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
  Button,
  Item,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid
} from 'react-native';
import DoubleClick from 'react-native-double-tap';

import Geolocation from 'react-native-geolocation-service'
import { getDistance } from 'geolib';

import AsyncStorage from '@react-native-async-storage/async-storage';

async function requestLocationPermission(){
  try{
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Please allow location we won't hack u we promnise xx",
        buttonNeutral: "Nah son, maybe in time ya get me?",
        buttonNegative: "Mate get out of here",
        buttonPositive: "Yeah lard go on then",
      },
    );
    if(granted === PermissionsAndroid.RESULTS.GRANTED){
      console.log("Location can be accessed")
      return true
    }else{
      console.log("Location access denied")
      return false
    }
  }catch(error){
    console.log("error")
  }
}


export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      location: null,
      locationPermission: false,
      long: "",
      lat: ""
    }
  }

  componentDidMount(){
    this.findLocation()
  }


  findLocation = () =>{
    if(!this.state.locationPermission){
      console.log(this.state.locationPermission)
      this.state.locationPermission = requestLocationPermission();
    }
    Geolocation.getCurrentPosition(
      (position) => {
        const location = position
        this.setState(
          {
            long : location.coords.longitude,
            lat : location.coords.latitude,
            location: location
          })
      },
      (error) =>{
        Alert.alert(error.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
      )
  }


    testfunction(){
      console.log("Your ")
      const a = getDistance({latitude: this.state.lat, longitude: this.state.long}, {
        latitude: 53,
        longitude: -2,
        }
      )
    }


  render(){
    this.testfunction()
    if(this.state.location == null)
    {
      return(
        <View>
        <Text>Geo Test</Text>
        </View>
      )
    }else{
    return(
      <View>
        <Text>Geo Test</Text>
        <Button title="Get coords" onPress={()=>{this.findLocation()}}/>
        <Text>Lat = {this.state.lat}</Text>
        <Text>Long = {this.state.long}</Text>
        </View>
    )
    }
  }
}
