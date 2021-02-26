import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ToastAndroid,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import profFilter from '../../../Data/ProfanityFilter.json';
import stylesLight from '../../../Styles/stylesheet';
import stylesDark from '../../../Styles/stylesheetDark';

export default class EditReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: [],
      reviewID: '',
      locationID: '',
      clenlinessRating: '',
      priceRating: '',
      overallRating: '',
      qualityRating: '',
      reviewBody: '',

      newClenlinessRating: '',
      newPriceRating: '',
      newOverallRating: '',
      newQualityRating: '',
      newReviewBody: '',
      darkMode: null,
    };
  }

  componentDidMount() {
    this.chooseStyle();
    const { route } = this.props;
    const {
      reviewID,
      locationID,
      clenlinessRating,
      priceRating,
      overallRating,
      qualityRating,
      reviewBody,
    } = route.params;
    this.setState(
      {
        reviewID,
        locationID,
        clenlinessRating,
        priceRating,
        overallRating,
        qualityRating,
        reviewBody,
        // Updated Variables
        newClenlinessRating: clenlinessRating,
        newPriceRating: priceRating,
        newOverallRating: overallRating,
        newQualityRating: qualityRating,
        newReviewBody: reviewBody,
      },
      () => {
        this.displayPhoto();
      },
    );
  }

  onStarPressOverallRating(rating) {
    this.setState({
      newOverallRating: rating,
    });
  }

  onStarPressPrice(rating) {
    this.setState({
      newPriceRating: rating,
    });
  }

  onStarPressQuality(rating) {
    this.setState({
      newQualityRating: rating,
    });
  }

  onStarPressClenliness(rating) {
    this.setState({
      newClenlinessRating: rating,
    });
  }

  profanityFilter() {
    let verify = true;
    profFilter.profanityKeywords.forEach((item) => {
      if (this.state.newReviewBody.includes(item)) {
        verify = false;
      }
    });
    if (verify) {
      this.patchReview();
    } else {
      Alert.alert(
        'Please Follow Guidlines',
        'Coffida does not accept any reviews that are not directly related aspects their cafe experience, please ammend your comment.',
      );
    }
  }

  async deletePhoto() {
    const { locationID, reviewID } = this.state;
    console.log('Searching the database for your search queires');
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${locationID}/review/${reviewID}/photo`,
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
    const { locationID, reviewID } = this.state;
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${
        locationID
      }/review/${
        reviewID
      }/photo`,
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
          // Don't want to inform the user of this, as it means there is no photo for the review.
          ToastAndroid.show('No Images With This Review', ToastAndroid.SHORT);
        }
        if (response.status === 500) {
          // If there is a server error, I want the user to be informed, so I send an alert out.
          Alert.alert(
            'An Error Occured (Error:500)',
            'There was an error finding the image for this review, try reloading to fix this issue.',
          );
        }
      })
      .then((responseJson) => {
        this.setState({ photo: responseJson });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async patchReview() {
    const { navigation } = this.props;
    const {
      newOverallRating, newPriceRating, newQualityRating,
      newClenlinessRating, reviewBody, newReviewBody, locationID, reviewID,
      clenlinessRating, priceRating, overallRating, qualityRating,
    } = this.state;
    console.log('Patch Request Made to Updated User Information');
    const toSend = {};

    if (clenlinessRating !== newClenlinessRating) {
      toSend.clenliness_rating = newClenlinessRating;
    }
    if (priceRating !== newPriceRating) {
      toSend.price_rating = newPriceRating;
    }
    if (overallRating !== newOverallRating) {
      toSend.overall_rating = newOverallRating;
    }
    if (qualityRating !== newQualityRating) {
      toSend.quality_rating = newQualityRating;
    }
    if (reviewBody !== newReviewBody) {
      toSend.review_body = newReviewBody;
    }

    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${locationID}/review/${reviewID}`,
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
          Alert.alert('Your Review has Been Updated', 'We have updated your review, thanks!');
          navigation.goBack();
        }
        if (response.status === 400) {
          Alert.alert('Bad Request 400', 'An error occured, please try again later.');
        }
        if (response.status === 401) {
          Alert.alert('Unauthorised (401)', 'You cannot edit this review, try refreshing, if not contact our team.');
        }
        if (response.status === 403) {
          Alert.alert('You cannot edit this review (403)', 'You cannot edit this review, are you logged in?');
        }
        if (response.status === 404) {
          Alert.alert('Review not found, please try again (404)', 'There was an error finding this review, please try again');
        }
        if (response.status === 500) {
          Alert.alert('There was an error connecting, try again (500)', 'There was a server connection error, please try again');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  loadImage(style) {
    const { photo } = this.state;
    // If image is null
    if (photo === undefined) {
      return (
        <View>
          <Text style={style.textCenterBlack}>
            You did not submit a photo with this review.
          </Text>
        </View>
      );
    }
    return (
      <View style={style.imageCenter}>
        <Image
          style={style.imageSize}
          source={{
            uri: photo.url,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            this.deletePhoto();
          }}
        >
          <Text style={style.textCenterBlack}>Delete Photo?</Text>
        </TouchableOpacity>
      </View>
    );
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
      darkMode, newOverallRating, newPriceRating, newQualityRating,
      newClenlinessRating, reviewBody, newReviewBody,
    } = this.state;
    const { navigation } = this.props;
    const style = darkMode ? stylesDark : stylesLight;

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
              }}
            >
              <Text style={style.textCenterWhite}>Go Back</Text>
            </TouchableOpacity>
            <View style={{ padding: 30 }}>
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
                rating={parseInt(newOverallRating, 10)}
                selectedStar={(rating) => this.onStarPressOverallRating(rating)}
                fullStarColor={style.starColour.color}
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
                rating={parseInt(newPriceRating, 10)}
                selectedStar={(rating) => this.onStarPressPrice(rating)}
                fullStarColor={style.starColour.color}
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
                rating={parseInt(newQualityRating, 10)}
                selectedStar={(rating) => this.onStarPressQuality(rating)}
                fullStarColor={style.starColour.color}
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
                rating={parseInt(newClenlinessRating, 10)}
                selectedStar={(rating) => this.onStarPressClenliness(rating)}
                fullStarColor={style.starColour.color}
                />
              <View style={style.gapTop}>
                <Text style={style.textCenterBlack}>Update Your Comment: </Text>
                <TextInput
                  style={style.inputBody}
                  placeholder={reviewBody}
                  multiline
                  onChangeText={(text) => {
                    this.setState({ newReviewBody: text });
                  }}
                  numberOfLines={4}
                  value={newReviewBody}
                />
              </View>

              {this.loadImage(style)}

              <TouchableOpacity
                style={style.mainButton}
                onPress={() => {
                  this.profanityFilter();
                }}
              >
                <Text style={style.textCenterWhite}>Submit Review</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

EditReview.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
};
