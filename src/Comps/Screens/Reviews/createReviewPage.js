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
import profFilter from '../../../Data/ProfanityFilter.json';
import stylesLight from '../../../Styles/stylesheet';
import stylesDark from '../../../Styles/stylesheetDark';

export default class CreateReviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_id: '',
      current_name: '',
      overallRating: 0,
      priceRating: 0,
      qualityRating: 0,
      clenlinessRating: 0,
      reviewBody: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.chooseStyle();
      const { route } = this.props;
      const { id, name } = route.params;
      this.setState({ current_id: id });
      this.setState({ current_name: name });
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
    const { navigation } = this.props;
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${this.state.current_id}/review`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
        body: JSON.stringify({
          overall_rating: this.state.overallRating,
          price_rating: this.state.priceRating,
          quality_rating: this.state.qualityRating,
          clenliness_rating: this.state.clenlinessRating,
          review_body: this.state.reviewBody,
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
                    id: this.state.current_id,
                  });
                },
              },
              {
                text: 'No',
                onPress: () => {
                  navigation.goBack(),
                  ToastAndroid.show('Review Submitted', ToastAndroid.SHORT);
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
    if (await AsyncStorage.getItem('darkMode') === 'true'){
      this.setState({darkMode: true})
    }else{
      this.setState({darkMode: false})
    }
  }

  render() {
    const style = this.state.darkMode ? stylesDark : stylesLight;

    const { navigation } = this.props;

    return (// eslint-disable-next-line react/jsx-filename-extension
      <View style={style.mainContainer}>
        <View style={style.mainHeader}>
          <Text style={style.mainTitle}>
            Write a Review For
            {' '}
            {this.state.current_name}
          </Text>
        </View>
        <View style={style.mainFooter}>
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
              rating={this.state.overallRating}
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
              rating={this.state.priceRating}
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
              rating={this.state.qualityRating}
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
              rating={this.state.clenlinessRating}
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
