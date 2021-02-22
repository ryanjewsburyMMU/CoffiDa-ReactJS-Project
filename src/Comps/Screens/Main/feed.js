/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';

import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Linking,
} from 'react-native';

import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';

import DoubleClick from 'react-native-double-tap';
import Geolocation from 'react-native-geolocation-service';
import { getDistance } from 'geolib';
import style from '../../../Styles/stylesheet';

async function RequestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: "Please allow location we won't hack u we promnise xx",
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

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      location_data: [],
      favourite_locations: [],
      favourite_locations_id: [],
      locationPermission: false,
      long: '',
      lat: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      console.log('Screen Aciviated');
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
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
        this.setState({location_data: responseJson});
      })
      .catch((error) => {
        console.log(`errrr = ${error}`);
      });
  }

  async getInfo() {
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/user/${await AsyncStorage.getItem(
        '@user_id',
      )}`,
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      },
    )
      .then((response) => response.json())
      .then(async (responseJson) => {
        this.setState({
          favourite_locations: responseJson.favourite_locations,
        });
        const newList = [];
        this.state.favourite_locations.forEach((item) => {
          newList.push(item.location_id);
        });
        this.setState({ favourite_locations_id: newList, isLoading: false });
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

  async checkLoggedIn() {
    const {navigation} = this.props;

    const token = await AsyncStorage.getItem('@session_token');

    if (token === null) {
      Alert.alert(
        'Please Login To Access This Page',
        'We ask that you create an account in order to access these features!',
      );
      navigation.navigate('Profile');
    } else {
      this.getInfo();
      this.findLocation();
      this.getLocations();
    }
  }

  async AddFavourite(locationID) {
    const {navigation} = this.props;

    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${locationID}/favourite`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          this.getInfo();
        }
        if (response.status === 400) {
          Alert.alert(
            'Something Went Wrong (Error:400)',
            'We were unable to add this cafe to your favourites. If this issues continues, feel free to contact us.',
          );
        }
        if (response.status === 401) {
          Alert.alert(
            'You Cannot Do This Right Now (Error:401)',
            'We cannot add this cafe to your favourites right now, this error usually means you have been logged out.',
          );
        }
        if (response.status === 404) {
          Alert.alert(
            'Cafe Not Found (Error:404)',
            'This is most probably our fault, we cannot find the cafe you want to add to your favourites, we will fix this as soon as possible,',
          );
        }
        if (response.status === 500) {
          Alert.alert(
            'Server Error(Error:500)',
            'We are struggling to connect to the server. Are you connected to the internet? If so, please try again soon.',
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async DeleteFavourite(locationID) {
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${locationID}/favourite`,
      {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          this.getInfo();
        }
        if (response.status === 401) {
          Alert.alert(
            'Something Went Wrong (Error:400)',
            'We cannot remove this cafe to your favourites right now, this error usually means you have been logged out.',
          );
        }
        if (response.status === 403) {
          Alert.alert(
            'You Cannot Do This Right Now (Error:403)',
            'We cannot remove this cafe to your favourites right now, please try again.',
          );
        }
        if (response.status === 404) {
          Alert.alert(
            'Cafe Not Found (Error:404)',
            'This is most probably our fault, we cannot find the cafe you want to add to your favourites, we will fix this as soon as possible,',
          );
        }
        if (response.status === 500) {
          Alert.alert(
            'Server Error(Error:500)',
            'We are struggling to connect to the server. Are you connected to the internet? If so, please try again soon.',
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  isFavourited(currentID) {
    const faveIcon = <Icon name="heart" size={30} color="#900" />;
    const notFaveIcon = <Icon name="heart-o" size={30} color="#900" />;

    if (this.state.favourite_locations_id.includes(currentID) === true) {
      return (
        <View>
          <DoubleClick
            singleTap={() => {
              this.DeleteFavourite(currentID);
            }}
            doubleTap={() => {
              this.AddFavourite(currentID);
            }}
            delay={200}>
            <Text>{faveIcon}</Text>
          </DoubleClick>
        </View>
      );
    }
    return (
      <View>
        <DoubleClick
          singleTap={() => {
            this.DeleteFavourite(currentID);
          }}
          doubleTap={() => {
            this.AddFavourite(currentID);
          }}
          delay={200}>
          <Text>{notFaveIcon}</Text>
        </DoubleClick>
      </View>
    );
  }

  findDistance(lat, long) {
    if (this.state.long === '') {
      return (
        <View>
          <Text>Calculating Distance...</Text>
        </View>
      );
    }
    const distance = getDistance(
      {latitude: this.state.lat, longitude: this.state.long},
      {
        latitude: lat,
        longitude: long,
      },
    );
    const miles = Math.round(parseInt(distance) * 0.00062137);
    return (
      <View>
        <Text>{miles} Miles Away</Text>
      </View>
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
    const {navigation} = this.props;

    if (this.state.isLoading == true) {
      return (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <View style={style.mainContainer}>
        <View style={style.mainHeader}>
          <View style={style.flexRow}>
            <Text style={style.mainTitle}>Your Feed</Text>
          </View>
        </View>
        <View style={style.mainFooter}>
          <ScrollView>
            <View>
              {this.state.location_data.map((locationData, index) => (
                <View key={index}>
                  <View style={style.feedContainer}>
                    <Text style={style.locationTitle}>
                      {locationData.location_name}
                    </Text>
                    <Text style={style.textCenterGrey}>
                      {locationData.location_town}
                    </Text>
                    <Text>Overall Rating</Text>
                    <StarRating
                      disabled={false}
                      fullStarColor="#eaca97"
                      maxStars={5}
                      rating={locationData.avg_overall_rating}
                      starSize={25}
                      selectedStar={(rating) => this.onStarRatingPress(rating)}
                    />
                  </View>
                  <View style={style.alignCenter}>
                    <Text>Favourite This Location?</Text>
                    <Text>{this.isFavourited(locationData.location_id)}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.generateMapDirections(
                          locationData.latitude,
                          locationData.longitude,
                        );
                      }}>
                      <Text>
                        {' '}
                        {this.findDistance(
                          locationData.latitude,
                          locationData.longitude,
                        )}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={style.mainButton}
                      onPress={() => {
                        navigation.navigate('ReviewPage', {
                          id: locationData.location_id,
                          name: locationData.location_name,
                          photo_path: locationData.photo_path,
                        });
                      }}>
                      <Text style={style.textCenterWhite}>
                        See Reviews for {locationData.location_name}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={style.mainButtonWhite}
                      onPress={() => {
                        navigation.navigate('CreateReviewPage', {
                          id: locationData.location_id,
                          name: locationData.location_name,
                        });
                      }}>
                      <Text>
                        Write a Review For {locationData.location_name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
