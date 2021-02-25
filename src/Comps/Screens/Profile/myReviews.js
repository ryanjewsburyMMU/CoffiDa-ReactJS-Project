import React, { Component } from 'react';

import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  FlatList,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';
import PropTypes from 'prop-types';
import stylesLight from '../../../Styles/stylesheet';
import stylesDark from '../../../Styles/stylesheetDark';

export default class MyReviews extends Component {
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
      this.getInfo();
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

  async chooseStyle() {
    if (await AsyncStorage.getItem('darkMode') === 'true'){
      this.setState({darkMode: true})
    }else{
      this.setState({darkMode: false})
    }
  }

  render() {
    const { darkMode, userDetails } = this.state;
    const { navigation } = this.props;

    const style = darkMode ? stylesDark : stylesLight;

    if (userDetails === []) {
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
              onPress={() => navigation.goBack()}
              style={style.mainButton}
            >
              <Text style={style.textCenterWhite}>Go Back:</Text>
            </TouchableOpacity>
            <FlatList
              data={userDetails.reviews}
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
                  <Text style={style.regularTextBlack}>
                    Review ID:
                    {item.review.review_id}
                  </Text>
                  <Text style={style.regularTextBlack}>
                    Comment:
                    {item.review.review_body}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('EditReview', {
                        reviewID: item.review.review_id,
                        locationID: item.location.location_id,
                        clenlinessRating: item.review.clenliness_rating,
                        priceRating: item.review.price_rating,
                        overallRating: item.review.overall_rating,
                        qualityRating: item.review.quality_rating,
                        reviewBody: item.review.review_body,
                      });
                    }}
                    style={style.mainButton}
                  >
                    <Text style={style.textCenterWhite}>
                      Edit This Review
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={style.deleteFavourite}
                    onPress={() => {
                      this.pressDelete(
                        item.location.location_name,
                        item.review.review_id,
                        item.location.location_id,
                      );
                    }}
                  >
                    <Text style={style.textWhite}>Delete Review</Text>
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

MyReviews.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

