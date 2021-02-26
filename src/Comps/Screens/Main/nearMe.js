import React, { Component } from 'react';

import {
  Text,
  View,
  TouchableOpacity,
  Linking,
  Alert,
  PermissionsAndroid,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';
import PropTypes from 'prop-types';
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
        message: 'CoffiDa would like to access your location',
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

export default class NearMe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationPermission: false,
      long: '',
      lat: '',
      location_data: [],
      orderedLocations: [],
      locationDidLoad: false,
      darkMode: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.chooseStyle();
      this.findLocation();
      this.getLocations();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleNearestLocations() {
    if (this.state.location_data.length === 0) {
      Alert.alert('An Error Occured', 'When trying to get this data we encountered a problem, a refresh should fix this');
    } else {
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
          name: item.location_name,
          overall_rating: item.avg_overall_rating,
          distance: Math.round(currentDistance * 0.00062137),
          lat: item.latitude,
          long: item.longitude,
        });
      });

      const newlist = locationDistances.sort((a, b) => (a.distance) - (b.distance));
      this.setState({
        orderedLocations: newlist,
        locationDidLoad: true,
      });
    }
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
        Alert.alert('Please Enable Location Services', `${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  };

  displayStarRating = (size, styles, rating, style) => (
    <StarRating
      disabled={false}
      fullStarColor={style.starColour.color}
      maxStars={5}
      rating={rating}
      starSize={size}
      style={styles}
    />
  )

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

  async chooseStyle() {
    // Choose a stylesheet
    if (await AsyncStorage.getItem('darkMode') === 'true') {
      this.setState({ darkMode: true });
    } else {
      this.setState({ darkMode: false });
    }
  }

  listHeader(style) {
    const { orderedLocations } = this.state;
    return (
      <View style={style.gapTop}>
        <Text style={style.textCenterBlack}>
          Great! We found
          {' '}
          {orderedLocations.length}
          {' '}
          locations
        </Text>
        <Text style={style.textCenterBlack}>
          {' '}
          Your Closest Location Is
          {' '}
          {orderedLocations[0].name}
          , and it is only
          {' '}
          {orderedLocations[0].distance}
          {' '}
          Miles Away
          {'\n'}
        </Text>
      </View>
    );
  }

  render() {
    const { darkMode } = this.state;
    const style = darkMode ? stylesDark : stylesLight;
    const { navigation } = this.props;
    const { locationDidLoad, orderedLocations, long } = this.state;

    if (long === '') {
      return (
        <View style={style.mainContainer}>
          <View style={style.mainHeader}>
            <Text style={style.mainTitle}>Near Me</Text>
          </View>
          <View style={style.mainFooter}>
            <Text style={style.textCenterBlack}>Please Wait while we load this page...</Text>
            <Text style={style.textCenterBlack}>
              If this page does not load, please ensure you have location
              services turned on in your phone settings.
            </Text>
            <ActivityIndicator size="large" color="#eaca97" />
            {this.findLocation()}
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
          {locationDidLoad ? (
            <View style={style.flexOne}>
              <FlatList
                data={orderedLocations}
                ListHeaderComponent={this.listHeader(style)}
                renderItem={({ item, index }) => (
                  <View style={style.resultContainer}>
                    <Text style={style.containerTitle}>{item.name}</Text>
                    <Text style={style.regularTextBlack}>
                      {item.distance}
                      {' '}
                      Miles Away
                    </Text>
                    <Text style={style.regularTextBlack}>Overall Rating:</Text>
                    <Text>
                      {this.displayStarRating(
                        20,
                        style.starContainer,
                        item.overall_rating,
                        style,
                      )}
                    </Text>
                    <TouchableOpacity style={style.mainButton} onPress={() => { this.generateMapDirections(item.lat, item.long); }}>
                      <Text style={style.textCenterWhite}>Take Me There</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={style.mainButtonWhite}
                      onPress={() => {
                        navigation.navigate('ReviewPage', {
                          id: item.id,
                          name: item.name,
                        });
                      }}
                    >
                      <Text>View This Cafe on My Feed</Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          ) : (
            <View>
              <Text style={style.textCenterBlack}>
                Please be sure to have location
                services activated, you can do this via Settings, if not already allowed.
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

NearMe.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};
