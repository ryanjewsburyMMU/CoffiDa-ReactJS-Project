import React, { Component } from 'react';

import {
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import stylesLight from '../../../Styles/stylesheet';
import stylesDark from '../../../Styles/stylesheetDark';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: [],
      darkMode: null,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.chooseStyle();
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async getInfo() {
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/user/${
        await AsyncStorage.getItem('@user_id')}`,
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.staus === 401) {
          Alert.alert('Unauthorised Error (401)', 'An error occured when trying to load your data, please ensure you are logged in / reload the app.');
        }
        if (response.status === 404) {
          Alert.alert('User Details Not Found (404)', 'We could not find your details, please try again, and make sure you are logged in!');
        }
        if (response.status === 500) {
          Alert.alert('Connection Error', 'There was a connection error, and we could not load this data, please make sure you are connected to the internet.');
        }
      })
      .then(async (responseJson) => {
        this.setState({
          userDetails: responseJson,
        });
        console.log(responseJson);
        await AsyncStorage.setItem(
          '@userName',
          responseJson.first_name,
        );
        await AsyncStorage.setItem(
          '@userLastName',
          responseJson.last_name,
        );
        await AsyncStorage.setItem('@userEmail', responseJson.email);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;

    const token = await AsyncStorage.getItem('@session_token');
    if (token === null) {
      navigation.navigate('Login');
    } else {
      navigation.navigate('Profile');
      this.getInfo();
    }
  };

  async logout() {
    const { navigation } = this.props;
    console.log('Post Request Made For Logout');
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/logout', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token'),
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        if (response.status === 200) {
          AsyncStorage.clear();
          navigation.navigate('Login');
        }
        if (response.status === 401) {
          Alert.alert('Error Logging Out (Error:401)', 'There was an issue logging you out in out system, please try again.');
        }
        if (response.status === 500) {
          Alert.alert('Connection Error (Error:500)', 'There was an issue connecting you to our system, please try again.');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async chooseStyle() {
    if (await AsyncStorage.getItem('darkMode') === 'true') {
      this.setState({ darkMode: true });
    } else {
      this.setState({ darkMode: false });
    }
  }

  render() {
    const { darkMode, userDetails } = this.state;
    const style = darkMode ? stylesDark : stylesLight;

    const { navigation } = this.props;

    return (// eslint-disable-next-line react/jsx-filename-extension
      <View style={style.mainContainer}>
        <View style={style.mainHeader}>
          <Text style={style.mainTitle}>
            Hello,
            {' '}
            {userDetails.first_name}
          </Text>
        </View>
        <View style={style.mainFooter}>
          <Text style={style.profileTitle}>Your Details:</Text>
          <Text style={style.textCenterBlack}>
            Full Name:
            {' '}
            {userDetails.first_name}
            {' '}
            {userDetails.last_name}
          </Text>
          <Text style={style.textCenterBlack}>
            E-Mail:
            {' '}
            {userDetails.email}
          </Text>
          <TouchableOpacity
            style={style.mainButtonWhite}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.mainButtonWhite}
            onPress={() => navigation.navigate('FavouriteLocations')}
          >
            <Text>Favourite Locations</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.mainButtonWhite}
            onPress={() => navigation.navigate('MyReviews')}
          >
            <Text>My Reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.mainButton}
            onPress={() => {
              this.logout();
            }}
          >
            <Text>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
Profile.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
