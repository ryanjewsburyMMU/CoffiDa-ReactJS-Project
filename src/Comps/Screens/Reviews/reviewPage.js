import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import DoubleClick from 'react-native-double-tap';
import StarRating from 'react-native-star-rating';
import stylesLight from '../../../Styles/stylesheet';
import stylesDark from '../../../Styles/stylesheetDark';

export default class ReviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      locationData: [],
      currentID: null,
      liked_reviews: [],
      currentName: '',
      imageLoad: true,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.chooseStyle();
      const { route } = this.props;
      const { id, name, photoPath } = route.params;
      this.setState({ currentID: id, currentName: name, photoPath });

      this.setState({ imageLoad: true });
      this.getLocations(id);
      this.getInfo();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
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
        console.log(responseJson.liked_reviews);
        const newList = [];
        responseJson.liked_reviews.forEach((item) => {
          newList.push(item.review.review_id);
        });
        this.setState({ liked_reviews: newList }, () => {
          console.log(this.state.liked_reviews);
          this.setState({ isLoading: false });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async getLocations(id) {
    console.log('Finding Locations');
    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 404) {
          ToastAndroid.show('Cannot Fetch Data (404)', ToastAndroid.SHORT);
        }
        if (response.status === 500) {
          ToastAndroid.show('Connection Error (500)', ToastAndroid.SHORT);
        }
      })

      .then(async (responseJson) => {
        this.setState({ locationData: responseJson });
      })
      .catch((error) => {
        console.log(`error = ${error}`);
      });
  }

  async removeLike(locationID, reviewID) {
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${
        locationID
      }/review/${
        reviewID
      }/like`,
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
          ToastAndroid.show('Removed like', ToastAndroid.SHORT);
          this.getInfo(locationID);
          this.getLocations(locationID);
        }
        if (response.status === 401) {
          ToastAndroid.show('Error Removing like (401)', ToastAndroid.SHORT);
        }
        if (response.status === 403) {
          ToastAndroid.show('Error Removing like (403)', ToastAndroid.SHORT);
        }
        if (response.status === 404) {
          ToastAndroid.show('Error Removing like (404)', ToastAndroid.SHORT);
        }
        if (response.status === 500) {
          ToastAndroid.show('Unable to Connect to Server (500)', ToastAndroid.SHORT);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async addLike(locationID, reviewID) {
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${
        locationID
      }/review/${
        reviewID
      }/like`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          ToastAndroid.show('Liked Review', ToastAndroid.SHORT);
          this.getInfo(locationID);
          this.getLocations(locationID);
        }
        if (response.status === 400) {
          ToastAndroid.show('Error Liking Review (400)', ToastAndroid.SHORT);
        }
        if (response.status === 401) {
          ToastAndroid.show('Error Liking Review (401)', ToastAndroid.SHORT);
        }
        if (response.status === 404) {
          ToastAndroid.show('Review Not Found (401)', ToastAndroid.SHORT);
        }
        if (response.status === 500) {
          ToastAndroid.show('A Server Error Occured (500)', ToastAndroid.SHORT);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  displayStarRating(size, style, rating) {
    return (
      <StarRating
        disabled={false}
        fullStarColor="#eaca97"
        maxStars={5} // 5
        rating={rating}
        starSize={size} // 20
        style={style}
      />
    );
  }

  isLiked(locationID, reviewID, likes, style) {
    const { liked_reviews } = this.state;
    const likeIcon = <Icon name="thumbs-up" size={20} color="#fff" />;
    const unlikeIcon = <Icon name="thumbs-o-up" size={20} color="#fff" />;
    if (liked_reviews.includes(reviewID)) {
      return (
        <View>
          <DoubleClick
            singleTap={() => {
              this.removeLike(locationID, reviewID);
            }}
            doubleTap={() => {
              this.addLike(locationID, reviewID);
            }}
            delay={200}
          >
            <Text style={style.likeButtonText}>
              {likeIcon}
              {' '}
              {likes}
              {' '}
              likes
            </Text>
          </DoubleClick>
        </View>
      );
    // eslint-disable-next-line no-else-return
    } else {
      return (
        <View>
          <DoubleClick
            singleTap={() => {
              this.removeLike(locationID, reviewID);
            }}
            doubleTap={() => {
              this.addLike(locationID, reviewID);
            }}
            delay={200}
          >
            <Text style={style.likeButtonText}>
              {unlikeIcon}
              {' '}
              {likes}
              {' '}
              likes
            </Text>
          </DoubleClick>
        </View>
      );
    }
  }

  locationInformation(style) {
    const { imageLoad, locationData } = this.state;
    // The header of the flat list, contains info about coffee shop.
    return (
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Text style={style.containerTitle}>Average Ratings</Text>
        {imageLoad ? (
          <Image
            style={{ height: 100, width: 100 }}
            source={{
              uri:
                'https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ',
            }}
          />
        ) : (
          <View />
        )}

        <Text style={style.textCenterBlack}>Overall Rating</Text>
        {this.displayStarRating(
          30,
          style.starContainer,
          locationData.avg_overall_rating,
        )}
        <Text style={style.textCenterBlack}>Price Rating</Text>
        {this.displayStarRating(
          30,
          style.starContainer,
          locationData.avg_price_rating,
        )}
        <Text style={style.textCenterBlack}>Cleanliness Rating</Text>
        {this.displayStarRating(
          30,
          style.starContainer,
          locationData.avg_clenliness_rating,
        )}
        <Text style={style.textCenterBlack}>Quality Rating</Text>
        {this.displayStarRating(
          30,
          style.starContainer,
          locationData.avg_quality_rating,
        )}
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
      darkMode, isLoading, currentName, locationData, currentID,
    } = this.state;
    const style = darkMode ? stylesDark : stylesLight;

    const { navigation } = this.props;
    if (isLoading === true) {
      return (
        <View style={style.mainContainer}>
          <View style={style.mainHeader}>
            <View style={style.flexRow}>
              <Text style={style.mainTitle}> Cafe Page</Text>
            </View>
          </View>
          <View style={style.mainFooter}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={style.textCenterBlack}> This Page Is Loading...</Text>
              <ActivityIndicator size="large" color="#eaca97" />
            </View>
          </View>
        </View>
      );
    } return (
      <View style={style.mainContainer}>
        {/* <Text>Hello world</Text> */}
        <View style={style.mainHeader}>
          <Text style={style.mainTitle}>{currentName}</Text>
        </View>
        <View style={style.mainFooter}>
          <View style={style.gapBottom}>
            <TouchableOpacity style={style.mainButton} onPress={() => { navigation.goBack(); }}>
              <Text style={style.textCenterWhite}>Go Back</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={locationData.location_reviews}
            ListHeaderComponent={this.locationInformation(style)}
            renderItem={({ item, index }) => (
              <View style={style.resultContainer}>
                <Text style={style.containerTitle}>
                  {currentName}
                </Text>
                <View style={style.flexRow}>
                  <View style={style.flexOne}>
                    <Text style={style.regularTextBlack}>Overall Rating</Text>
                    <Text>
                      {this.displayStarRating(
                        20,
                        style.starContainer,
                        item.overall_rating,
                      )}
                    </Text>
                  </View>
                  <View style={style.flexEnd}>
                    <Text style={style.regularTextBlack}>Cleanliness Rating</Text>
                    <Text>
                      {this.displayStarRating(
                        20,
                        style.starContainer,
                        item.clenliness_rating,
                      )}
                    </Text>
                  </View>
                </View>
                <View style={style.flexRow}>
                  <View style={style.flexOne}>
                    <Text style={style.regularTextBlack}>Price Rating</Text>
                    <Text>
                      {this.displayStarRating(
                        20,
                        style.starContainer,
                        item.price_rating,
                      )}
                    </Text>
                  </View>
                  <View style={style.flexEnd}>
                    <Text style={style.regularTextBlack}>Quality Rating</Text>
                    <Text>
                      {this.displayStarRating(
                        20,
                        style.starContainer,
                        item.quality_rating,
                      )}
                    </Text>
                  </View>
                </View>
                <Text style={style.regularTextBlack}>User Comment: </Text>
                <Text style={style.regularTextBlack}>{item.review_body}</Text>
                <TouchableOpacity style={style.mainButton}>
                  <Text style={style.textCenterWhite}>
                    {this.isLiked(
                      currentID,
                      item.review_id,
                      item.likes,
                      style,
                    )}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={style.mainButtonWhite}
                  onPress={() => {
                    navigation.navigate('ViewPhoto', {
                      id: currentID,
                      review_id: item.review_id,
                    });
                  }}
                >
                  <Text>View Photos</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}
ReviewPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
