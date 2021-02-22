import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';

import style from '../../../Styles/stylesheet';

export default class FavouriteLocations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_details: [],
    };
  }

  componentDidMount() {
    this.getInfo();
  }

  async getInfo() {
    console.log('Get Request Made For details');
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
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async removeFavourite(locationID) {
    const navigation = this.props.navigation;

    console.log('Post Request Made For Add Fave');
    return fetch(
      'http://10.0.2.2:3333/api/1.0.0/location/' + locationID + '/favourite',
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

  pressDelete(title, locationID) {
    Alert.alert(
      'Are You Sure?',
      'Are you sure you want to remove ' + title + ' from your favourites?',
      [
        {
          text: 'Yes, Remove',
          onPress: () => this.removeFavourite(locationID),
        },
        {
          text: 'No, Cancel',
          onPress: () => console.log('Cancel Pressed'),
        },
      ],
    );
  }

  render() {
    const user_data = this.state.user_details;
    const navigation = this.props.navigation;

    if (this.state.user_details === "") {
      return (
        <View><Text>Loading</Text></View>
      );
    }
    return (
      <View style={style.mainContainer}>
        <View style={style.mainHeader}>
          <Text style={style.mainTitle}>Favourite Locations</Text>
        </View>
        <View style={style.mainFooter}>
          <ScrollView>
            <Text style={style.containerTitle}></Text>

            <View>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={style.mainButton}>
                <Text style={style.textCenterWhite}>Go Back:</Text>
              </TouchableOpacity>
              <FlatList
                data={this.state.user_details.favourite_locations}
                renderItem={({item, index}) => (
                  <View style={style.resultContainer}>
                    <Text style={style.containerTitle}>
                      {item.location_name}
                    </Text>
                    <Text>Overall Rating</Text>
                    <View style={style.starContainer}>
                      <StarRating
                        disabled={false}
                        fullStarColor="#eaca97"
                        maxStars={5}
                        rating={item.avg_overall_rating}
                        starSize={20}
                      />
                    </View>
                    <TouchableOpacity
                      style={style.deleteFavourite}
                      onPress={() => {
                        this.pressDelete(item.location_name, item.location_id);
                      }}>
                      <Text style={style.textCenterWhite}>
                        Remove From Favourites
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

