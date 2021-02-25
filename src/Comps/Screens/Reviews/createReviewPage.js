import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import profFilter from '../../../Data/ProfanityFilter.json';
import stylesLight from '../../../Styles/stylesheet';
import stylesDark from '../../../Styles/stylesheetDark';

export default class CreateReviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentID: '',
      currentName: '',
      overallRating: 0,
      priceRating: 0,
      qualityRating: 0,
      clenlinessRating: 0,
      reviewBody: '',
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.chooseStyle();
      const { route } = this.props;
      const { id, name } = route.params;
      this.setState({ currentID: id });
      this.setState({ currentName: name });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onStarPressOverallRating(rating) {
    this.setState({
      overallRating: rating,
    });
  }

  onStarPressPrice(rating) {
    this.setState({
      priceRating: rating,
    });
  }

  onStarPressQuality(rating) {
    this.setState({
      qualityRating: rating,
    });
  }

  onStarPressClenliness(rating) {
    this.setState({
      clenlinessRating: rating,
    });
  }

  profanityFilter() {
    let verify = true;
    profFilter.profanityKeywords.forEach((item) => {
      if (this.state.reviewBody.includes(item)) {
        verify = false;
      }
    });
    if (verify) {
      this.postReview();
    } else {
      Alert.alert(
        'Please Follow Guidlines',
        'Coffida does not accept any reviews that are not directly related aspects their cafe experience, please ammend your comment.',
      );
    }
  }

  async postReview() {
    const {
      overallRating, priceRating, qualityRating, clenlinessRating, reviewBody, currentID
    } = this.state;
    const { navigation } = this.props;
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${this.state.currentID}/review`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
        body: JSON.stringify({
          overall_rating: overallRating,
          price_rating: priceRating,
          quality_rating: qualityRating,
          clenliness_rating: clenlinessRating,
          review_body: reviewBody,
        }),
      },
    )
      .then((response) => {
        if (response.status === 201) {
          Alert.alert(
            'Thank You!',
            'Would You like to add a photo to your review?',
            [
              {
                text: 'Yes',
                onPress: () => {
                  navigation.navigate('CameraPage', {
                    id: currentID,
                  });
                },
              },
              {
                text: 'No',
                onPress: () => {
                  ToastAndroid.show('Review Submitted', ToastAndroid.SHORT),
                  navigation.goBack();
                },
              },
            ],
          );
        }
        if (response.status === 400) {
          Alert.alert(
            'An Error Occured!',
            'Please Check your input and try again. ',
          );
        }
        if (response.status === 401) {
          Alert.alert(
            'Are You Logged In?',
            'An error occured, this usually means your not logged in.',
          );
        }
        if (response.status === 404) {
          Alert.alert(
            'An Error Occured',
            'Please try again soon.',
          );
        }
        if (response.status === 500) {
          Alert.alert(
            'Server Error',
            'Please check your internet connection, if this problem persists please contact our team',
          );
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
    const { navigation } = this.props;
    const {
      darkMode, currentName, overallRating, priceRating, qualityRating, clenlinessRating,
    } = this.state;
    const style = darkMode ? stylesDark : stylesLight;


    return (// eslint-disable-next-line react/jsx-filename-extension
      <View style={style.mainContainer}>
        <View style={style.mainHeader}>
          <Text style={style.mainTitle}>
            Write a Review For
            {' '}
            {currentName}
          </Text>
        </View>
        <View style={style.mainFooter}>
          <View style={style.gapBottom}>
            <TouchableOpacity style={style.mainButton} onPress={() => { navigation.goBack(); }}>
              <Text style={style.textCenterWhite}>Go Back</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
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
              rating={overallRating}
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
              rating={priceRating}
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
              rating={qualityRating}
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
              rating={clenlinessRating}
              selectedStar={(rating) => this.onStarPressClenliness(rating)}
              fullStarColor="#eaca97"
            />
            <Text style={style.textCenterBlack}>Please Leave a Comment: </Text>
            <TextInput
              style={style.inputBody}
              placeholder="Provide More Details About Your Visit"
              multiline
              onChangeText={(text) => {
                this.setState({ reviewBody: text });
              }}
              numberOfLines={4}
            />

            <TouchableOpacity
              style={style.mainButton}
              onPress={() => {
                this.profanityFilter();
              }}
            >
              <Text style={style.textCenterWhite}>Submit Review</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  }
}
CreateReviewPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
