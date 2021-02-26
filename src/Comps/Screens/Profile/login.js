/* eslint linebreak-style: ["error", "windows"] */
// This Was Causing An Error That Affected The Whole Page but I Couldn't Fix
// Can Uncomment to see the errors
import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

import stylesLight from '../../../Styles/stylesheet';
import stylesDark from '../../../Styles/stylesheetDark';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
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

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const token = await AsyncStorage.getItem('@session_token');
    if (token != null) {
      navigation.navigate('Profile');
    }
  };

  async postLogin() {
    const { email, password } = this.state;
    const { navigation } = this.props;
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/login', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          Alert.alert(
            'Welcome to Coffida',
            'Welcome to coffida! You have been logged in succesfully and now have full access to all the apps features. To view or change your profile, head over to My Profile',
          );
          return response.json();
        }
        if (response.status === 400) {
          Alert.alert(
            'Incorrect Details',
            'Please ensure your email and password are correct, if the problem persits please contact our team for more support.',
          );
        }
        if (response.status === 500) {
          Alert.alert(
            'Connection Error',
            'We are struggling to connect with you! Please try again or contact our team for further support.',
          );
        }
      })
      .then(async (responseJson) => {
        console.log(responseJson.token);
        await AsyncStorage.setItem(
          '@session_token',
          String(responseJson.token),
        );
        await AsyncStorage.setItem('@user_id', String(responseJson.id));
        navigation.navigate('Home');
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
    const { darkMode } = this.state;
    const { navigation } = this.props;
    const style = darkMode ? stylesDark : stylesLight;

    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <View style={style.loginContainer}>
        <View style={style.loginHeader}>
          <Text style={style.welcomeTitle}>Hello, There!</Text>
        </View>
        <View style={style.loginFooter}>
          <Text style={style.loginTitle}>Login:</Text>
          <TextInput
            style={style.loginInput}
            placeholder="Email"
            onChangeText={(text) => {
              this.setState({ email: text });
            }}
          />
          <TextInput
            secureTextEntry={true}
            style={style.loginInput}
            placeholder="Password"
            onChangeText={(text) => {
              this.setState({ password: text });
            }}
          />
          <TouchableOpacity
            style={style.mainButton}
            onPress={() => {
              this.postLogin();
            }}
          >
            <Text style={style.textCenterWhite}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.mainButtonWhite}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
