import React, { Component } from 'react';

import {
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import style from '../../../Styles/stylesheet';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_details: [],
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async getInfo() {
    return fetch(
      'http://10.0.2.2:3333/api/1.0.0/user/' +
        (await AsyncStorage.getItem('@user_id')),
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
          user_details: responseJson,
        });
        console.log(responseJson);
        await AsyncStorage.setItem(
          '@userName',
          this.state.user_details.first_name,
        );
        await AsyncStorage.setItem(
          '@userLastName',
          this.state.user_details.last_name,
        );
        await AsyncStorage.setItem('@userEmail', this.state.user_details.email);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  checkLoggedIn = async () => {
    const navigation = this.props.navigation;

    const token = await AsyncStorage.getItem('@session_token');
    if (token === null) {
      navigation.navigate('Login');
    } else {
      navigation.navigate('Profile');
      this.getInfo();
    }
  };

  async logout() {
    const navigation = this.props.navigation;
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

  render() {
    const navigation = this.props.navigation;

    return (// eslint-disable-next-line react/jsx-filename-extension
      <View style={style.mainContainer}>
        <View style={style.mainHeader}>
          <Text style={style.mainTitle}>
            Hello, {this.state.user_details.first_name}
          </Text>
        </View>
        <View style={style.mainFooter}>
          <Text style={style.detailsTitle}>Your Details:</Text>
          <Text style={style.textCenterBlack}>
            Full Name: {this.state.user_details.first_name}{' '}
            {this.state.user_details.last_name}
          </Text>
          <Text style={style.textCenterBlack}>
            E-Mail: {this.state.user_details.email}
          </Text>
          <Text style={style.textCenterBlack}>
            Your Unique ID: {this.state.user_details.user_id}
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
            onPress={() => navigation.navigate('App')}
          >
            <Text>My Reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.mainButtonWhite}
            onPress={() => console.log('Liked Reviews Possible...')}
          >
            <Text>Liked Reviews</Text>
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
