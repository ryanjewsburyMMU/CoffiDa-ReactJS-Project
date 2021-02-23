import React, { Component, useEffect, useState } from 'react';

import {
  Text,
  View,
  TouchableOpacity,
  Linking,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating';

import Geolocation from 'react-native-geolocation-service';
import { getDistance } from 'geolib';
import style from '../../../Styles/stylesheet';

async function RequestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Something Here',
        buttonNeutral: 'Nah son, maybe in time ya get me?',
        buttonNegative: 'Mate get out of here',
        buttonPositive: 'Yeah lard go on then',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    return false;
  } catch (error) {
    Alert.alert(error);
  }
}

export default class NearMe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationPermission: false,
      long: '',
      lat: '',
      location_data: [],
      closest_location: [],
      locationDidLoad: false,
      closest_distance: '',
      closest_lat: 0,
      closest_long: 0,
    };
  }

  componentDidMount() {
    this.findLocation();
    this.getLocations();
  }

  handleNearestLocations() {
    const locationDistances = [];
    this.state.location_data.forEach((item) => {
      const currentDistance = getDistance(
        { latitude: this.state.lat, longitude: this.state.long },
        {
          latitude: item.latitude,
          longitude: item.longitude,
        },
      );
      locationDistances.push({
        id: item.location_id,
        distance: currentDistance,
        lat: item.latitude,
        long: item.longitude,
      });
      console.log(item.longitude, item.latitude);
    });
    const result = locationDistances.reduce((res, obj) => (obj.distance < res.distance ? obj : res));
    this.setState(
      {
        closest_distance: Math.round(parseInt(result.distance) * 0.00062137),
        closest_lat: result.lat,
        closest_long: result.long,
      },
      () => {
        this.getLocationInfo(result.id);
      },
    );
  }

  async getLocations() {
    console.log('Finding Locations');
    return fetch('http://10.0.2.2:3333/api/1.0.0/find', {
      // method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token'),
      },
    })
      .then((response) => {
        // 200 400 401 else
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 400) {
          Alert.alert(
            'We Could Not Find Any Cafes',
            'A bad request was sent to the server, we will fix this as soon as possible.',
          );
        }
        if (response.status === 401) {
          Alert.alert(
            'We Could Not Find Any Cafes',
            'A bad request was sent to the server, we will fix this as soon as possible.',
          );
        }
      })
      .then(async (responseJson) => {
        this.setState({ location_data: responseJson });
      })
      .catch((error) => {
        console.log(`errrr = ${error}`);
      });
  }

  async getLocationInfo(id) {
    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 403) {
          Alert.alert(
            'An Error Has Occured (Error:404)',
            'We were unable to load some location data on this page, please try reloading the app.',
          );
        }
        if (response.status === 400) {
          Alert.alert(
            'An Error Has Occured (Error:404)',
            'We were unable to load some location data on this page, please try reloading the app.',
          );
        }
      })
      .then(async (responseJson) => {
        this.setState({ closest_location: responseJson, locationDidLoad: true });
      })

      .catch((error) => {
        console.log(error);
      });
  }

  findLocation = () => {
    if (!this.state.locationPermission) {
      console.log(this.state.locationPermission);
      this.state.locationPermission = RequestLocationPermission();
    }
    Geolocation.getCurrentPosition(
      (position) => {
        const location = position;
        this.setState({
          long: location.coords.longitude,
          lat: location.coords.latitude,
          //   location: location,
        });
      },
      (error) => {
        Alert.alert(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  };

  // Consider Moving this somehow / fixing error
  // eslint-disable-next-line class-methods-use-this
  displayStarRating(size, styles, rating) {
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <StarRating
        disabled={false}
        fullStarColor="#eaca97"
        maxStars={5}
        rating={rating}
        starSize={size}
        style={styles}
      />
    );
  }

  async generateMapDirections(destLat, destLong) {
    if (this.state.longitude === '') {
      Alert.alert(
        'No Directions Found',
        'Please ensure you have locations enabled.',
      );
    } else {
      const address = `https://www.google.com/maps/dir/?api=1&origin=${this.state.lat},${this.state.long}&destination=${destLat},${destLong}`;
      await Linking.openURL(address);
    }
  }

  render() {
    const { navigation } = this.props;
    if (this.state.long === '') {
      return (
        <View style={style.mainContainer}>
          <View style={style.mainHeader}>
            <Text style={style.mainTitle}>Near Me</Text>
          </View>
          <View style={style.mainFooter}>
            <Text>Please Wait while we load this page...</Text>
          </View>
        </View>
      );
    }
    return (
      <View style={style.mainContainer}>
        <View style={style.mainHeader}>
          <Text style={style.mainTitle}>Near Me</Text>
        </View>
        <View style={style.mainFooter}>
          <Text style={style.subTitle}>Want Coffee Now?</Text>
          <TouchableOpacity
            style={style.mainButton}
            onPress={() => {
              this.handleNearestLocations();
            }}
          >
            <Text style={style.textCenterWhite}>Find me a coffee shop!</Text>
          </TouchableOpacity>
          {this.state.locationDidLoad ? (
            <View style={style.gapTop}>
              <Text style={style.textCenterBlack}>
                Great! We Found You a cafe!
              </Text>
              <Text style={style.textCenterBlack}>
                It is
                {' '}
                {this.state.closest_distance}
                {' '}
                miles away!
                {' '}
                {'\n'}
              </Text>
              <View style={style.resultContainer}>
                <View style={style.alignCenter}>
                  <Text style={style.containerTitle}>
                    {this.state.closest_location.location_name}
                  </Text>
                  <Text>Overall Rating</Text>
                  <Text>
                    {this.displayStarRating(
                      20,
                      style.starContainer,
                      this.state.closest_location.avg_overall_rating,
                    )}
                  </Text>
                </View>
                <TouchableOpacity
                  style={style.mainButton}
                  onPress={() => {
                    this.generateMapDirections(
                      this.state.closest_lat,
                      this.state.closest_long,
                    );
                  }}
                >
                  <Text style={style.textCenterWhite}>Take me there!</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={style.mainButtonWhite}
                  onPress={() => {
                    navigation.navigate('ReviewPage', {
                      id: this.state.closest_location.location_id,
                      name: this.state.closest_location.location_name,
                      photo_path: this.state.closest_location.photo_path,
                    });
                  }}
                >
                  <Text>View This Page On Your Feed?</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <Text />
            </View>
          )}
        </View>
      </View>
    );
  }
}
