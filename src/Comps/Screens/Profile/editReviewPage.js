import React, {Component} from 'react';

import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from '../../../Styles/stylesheet';

export default class EditReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: [],
      review_id: '',
      location_id: '',
      clenliness_rating: '',
      price_rating: '',
      overall_rating: '',
      quality_rating: '',
      review_body: '',

      new_clenliness_rating: '',
      new_price_rating: '',
      new_overall_rating: '',
      new_quality_rating: '',
      new_review_body: '',
    };
  }

  componentDidMount() {
    const {route} = this.props;
    const {
      review_id,
      location_id,
      clenliness_rating,
      price_rating,
      overall_rating,
      quality_rating,
      review_body,
    } = route.params;
    this.setState(
      {
        review_id,
        location_id,
        clenliness_rating,
        price_rating,
        overall_rating,
        quality_rating,
        review_body,
        // Updated Variables
        new_clenliness_rating: clenliness_rating,
        new_price_rating: price_rating,
        new_overall_rating: overall_rating,
        new_quality_rating: quality_rating,
        new_review_body: review_body,
      },
      () => {
        this.displayPhoto();
      },
    );
  }

  onStarPressOverallRating(rating) {
    this.setState({
      new_overall_rating: rating,
    });
  }

  onStarPressPrice(rating) {
    this.setState({
      new_price_rating: rating,
    });
  }

  onStarPressQuality(rating) {
    this.setState({
      new_quality_rating: rating,
    });
  }

  onStarPressClenliness(rating) {
    this.setState({
      new_clenliness_rating: rating,
    });
  }

  async deletePhoto() {
    const {navigation} = this.props;
    console.log('Searching the database for your search queires');
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${this.state.location_id}/review/${this.state.review_id}/photo`,
      {
        method: 'delete',
        headers: {
          'Content-Type': 'image/jpeg',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          Alert.alert('Success!', 'We have succesfully removed this photo from your review.');
          this.displayPhoto();
        }
        if (response.status === 404) {
          Alert.alert('Not Found (Error:404)', 'We looked everywhere but could not find the photo you want to delete, please try again soon');
        }
        if (response.status === 500) {
          Alert.alert('Server Error', 'We could not connect to the server to delete this photo, please check your internet connection and try again');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async displayPhoto() {
    return fetch(
      'http://10.0.2.2:3333/api/1.0.0/location/' +
        this.state.location_id +
        '/review/' +
        this.state.review_id +
        '/photo',
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
          return response;
        }
        if (response.status === 404) {
          Alert.alert(
            'An Error Occured (Error:404)',
            'There was an error finding the image for this review, try reloading to fix this issue.',
          );
        }
        if (response.status === 500) {
          Alert.alert(
            'An Error Occured (Error:500)',
            'There was an error finding the image for this review, try reloading to fix this issue.',
          );
        }
      })
      .then((responseJson) => {
        this.setState({photo: responseJson});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async patchReview() {
    console.log('Patch Request Made to Updated User Information');
    const toSend = {};

    if (this.state.clenliness_rating != this.state.new_clenliness_rating) {
      toSend.clenliness_rating = this.state.new_clenliness_rating;
    }
    if (this.state.price_rating != this.state.new_price_rating) {
      toSend.price_rating = this.state.new_price_rating;
    }
    if (this.state.overall_rating != this.state.new_overall_rating) {
      toSend.overall_rating = this.state.new_overall_rating;
    }
    if (this.state.quality_rating != this.state.new_quality_rating) {
      toSend.quality_rating = this.state.new_quality_rating;
    }
    if (this.state.review_body != this.state.new_review_body) {
      toSend.review_body = this.state.new_review_body;
    }

    return fetch(
      'http://10.0.2.2:3333/api/1.0.0/location/' + this.state.location_id +'/review/' +this.state.review_id,
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
        // Add error catching here
        if (response.status === 200) {
          Alert.alert('Your Review has Been Updated');
          this.props.navigation.goBack();
        }
        if (response.status === 400) {
          Alert.alert('Bad Request 400');
        }
        if (response.status === 401) {
          Alert.alert('Unauthorised (401)');
        }
        if (response.status === 403) {
          Alert.alert('You cannot edit this review');
        }
        if (response.status === 404) {
          Alert.alert('Review update not found, please try again(404)');
        }
        if (response.status === 500) {
          Alert.alert('There was an erroe connecting, try again (500)');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  loadImage() {
    // If image is null
    if (this.state.photo === undefined) {
      return (
        <View>
          <Text style={style.textCenterBlack}>
            You did not submit a photo with this review.
          </Text>
        </View>
      );
    }
    console.log(this.state.photo);
    return (
      <View>
        <Image
          style={{width: 100, height: 90, marginTop: 20}}
          source={{
            uri: this.state.photo.url,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            this.deletePhoto();
          }}>
          <Text>Delete Photo?</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const {navigation} = this.props;
    return (
      <View style={style.mainContainer}>
        <View style={style.mainHeader}>
          <Text style={style.mainTitle}>Edit Review</Text>
        </View>
        <View style={style.mainFooter}>
          <ScrollView>
            <TouchableOpacity
              style={style.mainButton}
              onPress={() => {
                navigation.goBack();
              }}>
              <Text style={style.textCenterWhite}>Go Back</Text>
            </TouchableOpacity>
            <Text style={style.subTitle}>
              How Would You Rate Your Overall Experience?
            </Text>
            <StarRating
              disabled={false}
              emptyStar="star-o"
              fullStar="star"
              halfStar="star-half"
              iconSet="FontAwesome"
              maxStars={5}
              starSize={30}
              rating={parseInt(this.state.new_overall_rating)}
              selectedStar={(rating) => this.onStarPressOverallRating(rating)}
              fullStarColor="#eaca97"
            />
            <Text style={style.subTitle}>How Would You Rate The Price?</Text>
            <StarRating
              disabled={false}
              emptyStar="star-o"
              fullStar="star"
              halfStar="star-half"
              iconSet="FontAwesome"
              maxStars={5}
              starSize={30}
              rating={parseInt(this.state.new_price_rating)}
              selectedStar={(rating) => this.onStarPressPrice(rating)}
              fullStarColor="#eaca97"
            />
            <Text style={style.subTitle}>How Would You Rate The Quality?</Text>
            <StarRating
              disabled={false}
              emptyStar="star-o"
              fullStar="star"
              halfStar="star-half"
              iconSet="FontAwesome"
              maxStars={5}
              starSize={30}
              rating={parseInt(this.state.new_quality_rating)}
              selectedStar={(rating) => this.onStarPressQuality(rating)}
              fullStarColor="#eaca97"
            />
            <Text style={style.subTitle}>
              How Would You Rate The Clenliness?
            </Text>
            <StarRating
              disabled={false}
              emptyStar="star-o"
              fullStar="star"
              halfStar="star-half"
              iconSet="FontAwesome"
              maxStars={5}
              starSize={30}
              rating={parseInt(this.state.new_clenliness_rating)}
              selectedStar={(rating) => this.onStarPressClenliness(rating)}
              fullStarColor="#eaca97"
            />
            <View style={style.gap}>
              <Text style={style.textCenterBlack}>Update Your Comment: </Text>
              <TextInput
                style={style.inputBody}
                placeholder={this.state.review_body}
                multiline
                onChangeText={(text) => {
                  this.setState({new_review_body: text});
                }}
                numberOfLines={4}
                value={this.state.new_review_body}
              />
            </View>

            {this.loadImage()}

            <TouchableOpacity
              style={style.mainButton}
              onPress={() => {
                this.patchReview();
              }}>
              <Text style={style.textCenterWhite}>Submit Review</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  }
}
