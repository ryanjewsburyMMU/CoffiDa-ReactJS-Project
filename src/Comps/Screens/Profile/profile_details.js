import React, {Component, useEffect, useState} from 'react';

import {Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';
import style from '../../../Styles/stylesheet';

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orig_first_name: '',
      orig_last_name: '',
      orig_email: '',

      updated_first_name: '',
      updated_last_name: '',
      updated_email: '',

      password: '',
      confirm_password: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getDetails();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getDetails = async () => {
    const navigation = this.props.navigation;
    const firstName = await AsyncStorage.getItem('@userName');
    const lastName = await AsyncStorage.getItem('@userLastName');
    const email = await AsyncStorage.getItem('@userEmail');

    this.setState({
      orig_first_name: firstName,
      orig_last_name: lastName,
      orig_email: email,

      updated_first_name: firstName,
      updated_last_name: lastName,
      updated_email: email,
    });
  };

  async updateInformation() {
    const toSend = {};

    if (this.state.orig_first_name !== this.state.updated_first_name) {
      toSend['first_name'] = this.state.updated_first_name;
    }
    if (this.state.orig_last_name !== this.state.updated_last_name) {
      toSend['last_name'] = this.state.updated_last_name;
    }
    if (this.state.orig_email !== this.state.updated_email) {
      toSend['email'] = this.state.updated_email;
    }
    if (this.state.password === this.state.confirm_password) {
      toSend['password'] = this.state.confirm_password;
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
        Alert.alert('Item Updated');
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
          <Text style={style.mainTitle}>Edit Details</Text>
        </View>
        <View style={style.mainFooter}>
          <ScrollView>
            <Text style={style.detailsTitle}>Your Details:</Text>
            <TouchableOpacity
              style={style.mainButton}
              onPress={() => navigation.goBack()}>
              <Text style={style.textCenterWhite}>Go Back</Text>
            </TouchableOpacity>

            <Text>First Name: </Text>
            <TextInput
              style={style.inputDetails}
              placeholder={this.state.orig_first_name}
              onChangeText={(updated_first_name) =>
                this.setState({updated_first_name})
              }
              value={this.state.updated_first_name}
            />

            <Text>Last Name: </Text>
            <TextInput
              style={style.inputDetails}
              placeholder={this.state.orig_last_name}
              onChangeText={(updated_last_name) =>
                this.setState({ updated_last_name })
              }
              value={this.state.updated_last_name}
            />

            <Text>E-Mail: </Text>
            <TextInput
              style={style.inputDetails}
              placeholder={this.state.orig_email}
              onChangeText={(updated_email) => this.setState({updated_email})}
              value={this.state.updated_email}
            />

            <Text>Password: </Text>
            <TextInput
              style={style.inputDetails}
              placeholder="Password"
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
            />

            <Text>Confirm Passsword: </Text>
            <TextInput
              style={style.inputDetails}
              placeholder="Password"
              onChangeText={(confirm_password) =>
                this.setState({ confirm_password })
              }
              value={this.state.confirm_password}
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
};