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
  ToastAndroid,
  Surface,
  Button
} from 'react-native';

import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';

import DoubleClick from 'react-native-double-tap';
import Geolocation from 'react-native-geolocation-service';
import { getDistance } from 'geolib';
import stylesLight from '../../../Styles/stylesheet';
import stylesDark from '../../../Styles/stylesheetDark';

async function RequestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Message',
        buttonNeutral: 'Maybe',
        buttonNegative: 'No',
        buttonPositive: 'Yes',
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
      darkMode: null,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.chooseStyle();
      this.checkLoggedIn();
      this.findLocation();
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
    if (this.state.locationPermission = false) {
      this.state.locationPermission = RequestLocationPermission();
      console.log(this.state.locationPermission);
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
        'Welcome To Coffida',
        'Please login or create an account to get started!')
      navigation.navigate('Profile');
    } else {
      this.getInfo();
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
          ToastAndroid.show('Added to Favourites', ToastAndroid.SHORT);
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
          ToastAndroid.show('Removed From Favourites', ToastAndroid.SHORT);
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

  isFavourited(currentID, style) {
    const faveIcon = <Icon name="heart" size={30} color={style.faveColour.color} />;
    const notFaveIcon = <Icon name="heart-o" size={30} color={style.faveColour.color} />;

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

  findDistance(lat, long, style) {
    if (this.state.long === '') {
      return (
        <View>
          <Text style={style.textCenterBlack}>Calculating Distance...</Text>
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
        <Text style={style.textCenterBlack}>{miles} Miles Away</Text>
      </View>
    );
  }

  async generateMapDirections(destLat, destLong, style) {
    if (this.state.long === '') {
      Alert.alert(
        'No Directions Found',
        'Please ensure you have locations enabled.',
      );
    } else {
      const address = `https://www.google.com/maps/dir/?api=1&origin=${this.state.lat},${this.state.long}&destination=${destLat},${destLong}`;
      await Linking.openURL(address);
    }
  }

  /* eslint-disable */


  async chooseStyle() {
    if (await AsyncStorage.getItem('darkMode') === 'true'){
      this.setState({darkMode: true})
    }else{
      this.setState({darkMode: false})
    }
  }

  render() {
    const style = this.state.darkMode ? stylesDark : stylesLight;

    const {navigation} = this.props;
    if (this.state.isLoading === true) {
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
            {/* <Button title="change style drk" onPress={()=>{this.changeStyleDark()}}/>
            <Button title="change style lght" onPress={()=>{this.changeStyleLight()}}/> */}
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
                    <Text style={style.textCenterBlack}>Overall Rating</Text>
                    <StarRating
                      disabled={false}
                      fullStarColor={style.starColour.color}
                      maxStars={5}
                      rating={locationData.avg_overall_rating}
                      starSize={25}
                    />
                  </View>
                  <View style={style.alignCenter}>
                    <Text style={style.textCenterBlack}>Favourite This Location?</Text>
                    <Text>{this.isFavourited(locationData.location_id, style)}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.generateMapDirections(
                          locationData.latitude,
                          locationData.longitude,
                          style,
                        );
                      }}>
                      <Text style={style.textCenterBlack}>
                        {' '}
                        {this.findDistance(
                          locationData.latitude,
                          locationData.longitude,
                          style,
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
                        See More Information About {locationData.location_name}
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
