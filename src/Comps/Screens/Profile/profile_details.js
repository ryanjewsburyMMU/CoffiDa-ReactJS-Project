import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import stylesLight from '../../../Styles/stylesheet';
import stylesDark from '../../../Styles/stylesheetDark';

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      origFirstName: '',
      origLastName: '',
      origEmail: '',

      updatedFirstName: '',
      updatedLastName: '',
      updatedEmail: '',

      password: '',
      confirmPassword: '',
      darkMode: null,

    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.chooseStyle();
      this.getDetails();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getDetails = async () => {
    const firstName = await AsyncStorage.getItem('@userName');
    const lastName = await AsyncStorage.getItem('@userLastName');
    const email = await AsyncStorage.getItem('@userEmail');

    this.setState({
      origFirstName: firstName,
      origLastName: lastName,
      origEmail: email,

      updatedFirstName: firstName,
      updatedLastName: lastName,
      updatedEmail: email,
    });
  };

  async updateInformation() {
    const { navigation } = this.props;
    const {
      origFirstName, updatedFirstName, origLastName, updatedLastName,
      origEmail, updatedEmail, password, confirmPassword,
    } = this.state;
    const toSend = {};

    if (origFirstName !== updatedFirstName) {
      toSend.first_name = updatedFirstName;
    }
    if (origLastName !== updatedLastName) {
      toSend.last_name = updatedLastName;
    }
    if (origEmail !== updatedEmail) {
      toSend.email = updatedEmail;
    }
    if (password === confirmPassword) {
      toSend.password = confirmPassword;
    }

    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/user/${await AsyncStorage.getItem('@user_id')}`,
      {
        method: 'patch',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
        body: JSON.stringify(toSend),
      },
    )
      .then((response) => {
        if (response.status === 200) {
          Alert.alert('Your Details have Been Updated', 'We have now updated your details!');
          navigation.goBack();
        }
        if (response.status === 400) {
          Alert.alert('Bad Request 400', 'An error occured, please try again later.');
        }
        if (response.status === 401) {
          Alert.alert('Unauthorised (401)', 'You cannot edit these details right now, try refreshing, if not contact our team.');
        }
        if (response.status === 403) {
          Alert.alert('You cannot edit this review (403)', 'You cannot edit this review, are you logged in?');
        }
        if (response.status === 404) {
          Alert.alert('User not found, please try again (404)', 'There was an error finding your account, please try again');
        }
        if (response.status === 500) {
          Alert.alert('There was an error connecting, try again (500)', 'There was a server connection error, please try again');
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
    const {
      darkMode, origFirstName, updatedFirstName, origLastName, updatedLastName,
      origEmail, updatedEmail, password, confirmPassword,
    } = this.state;
    const style = darkMode ? stylesDark : stylesLight;
    const { navigation } = this.props;

    return (// eslint-disable-next-line react/jsx-filename-extension
      <View style={style.mainContainer}>
        <View style={style.mainHeader}>
          <Text style={style.mainTitle}>Edit Details</Text>
        </View>
        <View style={style.mainFooter}>
          <ScrollView>
            <Text style={style.profileTitle}>Your Details:</Text>
            <TouchableOpacity
              style={style.mainButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={style.textCenterWhite}>Go Back</Text>
            </TouchableOpacity>

            <Text style={style.regularTextBlack}>First Name: </Text>
            <TextInput
              style={style.inputBody}
              placeholder={origFirstName}
              onChangeText={(updatedFirstNameText) => this.setState({ updatedFirstName: updatedFirstNameText })}
              value={updatedFirstName}
            />

            <Text style={style.regularTextBlack}>Last Name: </Text>
            <TextInput
              style={style.inputBody}
              placeholder={origLastName}
              onChangeText={(updatedLastNameText) => this.setState({ updatedLastName: updatedLastNameText })}
              value={updatedLastName}
            />

            <Text style={style.regularTextBlack}>E-Mail: </Text>
            <TextInput
              style={style.inputBody}
              placeholder={origEmail}
              onChangeText={(updatedEmailText) => this.setState({ updatedEmail: updatedEmailText })}
              value={updatedEmail}
            />

            <Text style={style.regularTextBlack}>Password: </Text>
            <TextInput
              style={style.inputBody}
              placeholder="Password"
              onChangeText={(passwordText) => this.setState({ password: passwordText })}
              value={password}
            />

            <Text style={style.regularTextBlack}>Confirm Passsword: </Text>
            <TextInput
              style={style.inputBody}
              placeholder="Password"
              onChangeText={(confirmPasswordText) => this.setState({ confirmPassword: confirmPasswordText })}
              value={confirmPassword}
            />

            <TouchableOpacity
              style={style.mainButton}
              onPress={() => {
                this.updateInformation();
              }}
            >
              <Text style={style.textCenterWhite}>Submit Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  }
}

EditProfile.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
