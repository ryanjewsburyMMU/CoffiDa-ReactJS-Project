/* eslint-disable linebreak-style */
import React, { Component } from 'react';

import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import style from '../../../Styles/stylesheet';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      passwordConfirm: '',
      firstName: '',
      lastName: '',
    };
  }

  signUp() {
    const { navigation } = this.props;
    const {
      password, passwordConfirm, firstName, lastName, email,
    } = this.state;

    // Check if both passwords entered are the same
    if (password === passwordConfirm) {
      const signUpDetails = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
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
              'Please you are using a valid email, and your password is longer than 5 characters.',
            );
          }
          if (response.status === 500) {
            Alert.alert('Server Error', 'Please try again soon.');
            return response.json();
          }
        })
        .catch((errors) => {
          console.log(errors);
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
      <View style={style.mainContainer}>
        <View style={style.mainHeader}>
          <Text style={style.mainTitle}>Sign Up</Text>
        </View>
        <View style={style.mainFooter}>
          <ScrollView>
            <Text style={style.signupTitle}>Create An Account:</Text>
            <TextInput
              style={style.signupInput}
              placeholder="First Name"
              onChangeText={(text) => {
                this.setState({ firstName: text });
              }}
            />
            <TextInput
              style={style.signupInput}
              placeholder="Last Name"
              onChangeText={(text) => {
                this.setState({ lastName: text });
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
             secureTextEntry={true}
              style={style.signupInput}
              placeholder="Password"
              onChangeText={(text) => {
                this.setState({ password: text });
              }}
            />
            <TextInput
              secureTextEntry={true}
              style={style.signupInput}
              placeholder="Confirm Password"
              onChangeText={(text) => {
                this.setState({ passwordConfirm: text });
              }}
            />
            <TouchableOpacity
              onPress={() => this.signUp()}
              style={style.mainButton}
            >
              <Text style={style.textCenterWhite}>Sign Up:</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={style.mainButtonWhite}
            >
              <Text>Go Back:</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  }
}

SignUp.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
