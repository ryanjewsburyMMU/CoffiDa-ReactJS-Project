/* eslint-disable linebreak-style */
import React, { Component } from 'react';

import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';

import style from '../../../Styles/stylesheet';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      password_confirm: '',
      first_name: '',
      last_name: '',
    };
  }

  signUp() {
    const { navigation } = this.props;

    // Check if both passwords entered are the same
    if (this.state.password === this.state.password_confirm) {
      const signUpDetails = {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password,
      };

      return fetch('http://10.0.2.2:3333/api/1.0.0/user', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpDetails),
      })
        .then((response) => {
          if (response.status === 201) {
            Alert.alert(
              'Successs!',
              'We added your account. Now we just need to get you logged in',
            );
            navigation.navigate('Login');
            return response.json();
          }
          if (response.status === 400) {
            Alert.alert(
              'Sign Up Error',
              'Please ensure all your details are correct.',
            );
          }
          if (response.status === 500) {
            Alert.alert('Server Error', 'Please try again soon.');
            return response.json();
          }
        })
        .catch((errors) => {
          console.log('Error');
        });
    }
    Alert.alert(
      'Passwords Do Not Match',
      'Please ensure both your passwords are the same in order to continue.',
    );
  }

  render() {
    const { navigation } = this.props;

    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <View style={style.mainContainer}>
        <View style={style.mainHeader}>
          <Text style={style.mainTitle}>Sign Up</Text>
        </View>
        <View style={style.mainFooter}>
          <Text style={style.signupTitle}>Create An Account:</Text>
          <TextInput
            style={style.signupInput}
            placeholder="First Name"
            onChangeText={(text) => {
              this.setState({ first_name: text });
            }}
          />
          <TextInput
            style={style.signupInput}
            placeholder="Last Name"
            onChangeText={(text) => {
              this.setState({ last_name: text });
            }}
          />
          <TextInput
            style={style.signupInput}
            placeholder="Email"
            onChangeText={(text) => {
              this.setState({ email: text });
            }}
          />
          <TextInput
            style={style.signupInput}
            placeholder="Password"
            onChangeText={(text) => {
              this.setState({ password: text });
            }}
          />
          <TextInput
            style={style.signupInput}
            placeholder="Confirm Password"
            onChangeText={(text) => {
              this.setState({ password_confirm: text });
            }}
          />
          <TouchableOpacity
            onPress={() => this.signUp()}
            style={style.mainButton}
          >
            <Text style={style.textCenterWhite}>Sign Up:</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={style.mainButtonWhite}
          >
            <Text>Go Back:</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
