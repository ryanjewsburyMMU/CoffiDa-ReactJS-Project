import React, { Component } from 'react';

import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  FlatList,
} from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';
import style from '../../../Styles/stylesheet';

export default class App extends Component {
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

  async deleteReview(reviewID, locationID) {
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${
        locationID
      }/review/${
        reviewID}`,
      {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      },
    )
      .then((response) => {
        // Add error catching here
        if (response.status === 200) {
          // Add toast for review deleted?
          ToastAndroid.show('Review Deleted', ToastAndroid.SHORT);
          this.getInfo();
        }
        if (response.status === 400) {
          Alert.alert(
            'We Cannot Do This Right Now (Error:400)',
            'An error occured when you tried to delete this review, please try again soon.',
          );
        }
        if (response.status === 401) {
          Alert.alert(
            'Error Deleting Review (Error:401)',
            'You cannot delete this review. Make sure you are logged in and try again',
          );
        }
        if (response.status === 403) {
          Alert.alert(
            'Cannot Delete Review (Error:403)',
            'This review cannot be deleted, if you belive this is an issue, contact our team.',
          );
        }
        if (response.status === 404) {
          Alert.alert(
            'Review Delete Error(404)',
            'This usually means we cannot find the review in our system, please try refreshing the app.',
          );
        }
        if (response.status === 500) {
          Alert.alert(
            'Connection Error (Error:500)',
            'There seems to be a problem connecting to the server, please try again soon.',
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  pressDelete(title, reviewID, locationID) {
    Alert.alert(
      'Are You Sure?',
      `Are you sure you want to delete your review for ${title}?`,
      [
        {
          text: 'Yes, Delete',
          onPress: () => this.deleteReview(reviewID, locationID),
        },
        {
          text: 'No, Cancel',
          onPress: () => {
            ToastAndroid.show('Cancelled', ToastAndroid.SHORT);
          },
        },
      ],
    );
  }

  render() {
    const { navigation } = this.props;

    if (
      this.state.user_details == []
      && this.state.favourite_locations_id == []
    ) {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );
    } return (
      <View style={style.mainContainer}>
        <View style={style.mainHeader}>
          <Text style={style.mainTitle}>My Reviews</Text>
        </View>
        <View style={style.mainFooter}>
          <View>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={style.mainButton}
            >
              <Text style={style.textCenterWhite}>Go Back:</Text>
            </TouchableOpacity>
            <FlatList
              data={this.state.user_details.reviews}
              renderItem={({ item, index }) => (
                <View style={style.resultContainer}>
                  <Text style={style.containerTitle}>
                    {item.location.location_name}
                  </Text>
                  <View style={style.starContainer}>
                    <StarRating
                      disabled={false}
                      fullStarColor="#eaca97"
                      maxStars={5}
                      rating={item.location.avg_overall_rating}
                      starSize={20}
                    />
                  </View>
                  <Text>
                    Review ID:
                    {item.review.review_id}
                  </Text>
                  <Text>
                    Comment:
                    {item.review.review_body}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('EditReview', {
                        review_id: item.review.review_id,
                        location_id: item.location.location_id,
                        clenliness_rating: item.review.clenliness_rating,
                        price_rating: item.review.price_rating,
                        overall_rating: item.review.overall_rating,
                        quality_rating: item.review.quality_rating,
                        review_body: item.review.review_body,
                      });
                    }}
                    style={style.mainButton}
                  >
                    <Text style={style.textCenterWhite}>
                      Edit This Review
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={style.deleteReview}
                    onPress={() => {
                      this.pressDelete(
                        item.location.location_name,
                        item.review.review_id,
                        item.location.location_id,
                      );
                    }}
                  >
                    <Text style={style.textCenterWhite}>Delete Review</Text>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </View>
    );
  }
}
