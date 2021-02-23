import React, { Component } from 'react';
import {
  View, Text, Image, ActivityIndicator, Alert, ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

import style from '../../../Styles/stylesheet';

export default class ViewPhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      review_id: 0,
      location_id: 0,
      photo: [],
    };
  }

  componentDidMount() {
    const { route } = this.props;
    const { id, review_id } = route.params;
    this.setState(
      {
        location_id: id,
        review_id,
      },
      () => {
        this.search_results();
      },
    );
  }

  async search_results() {
    const { navigation } = this.props;
    console.log('Searching the database for your search queires');
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${this.state.location_id}/review/${this.state.review_id}/photo`,
      {
        method: 'get',
        headers: {
          'Content-Type': 'image/jpeg',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Image Loaded', ToastAndroid.SHORT);
          return response;
        }
        if (response.status === 404) {
          ToastAndroid.show('Cannot Find Image (404)', ToastAndroid.SHORT);
        }
        if (response.status === 500) {
          ToastAndroid.show('Server Error (500)', ToastAndroid.SHORT);
        }
      })
      .then((responseJson) => {
        if (responseJson == undefined) {
          Alert.alert('No Images', 'There are no images for this review.', [
            { text: 'Okay', onPress: navigation.goBack() },
          ]);
        } else {
          this.setState({ photo: responseJson });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { navigation } = this.props;
    console.log(this.state.photo);
    if (this.state.photo == '') {
      <View>
        <ActivityIndicator />
      </View>;
    }
    return (
      <View style={style.mainContainer}>
        <View style={style.mainHeader}>
          <Text style={style.mainTitle}>Photos</Text>
        </View>
        <View style={style.mainFooter}>
          <TouchableOpacity
            style={style.mainButton}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text style={style.textCenterWhite}>Go Back</Text>
          </TouchableOpacity>
          <Image
            style={{ width: '100%', height: '90%', marginTop: 20 }}
            source={{
              uri: this.state.photo.url,
            }}
          />
        </View>
      </View>
    );
  }
}
