import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

import DoubleClick from 'react-native-double-tap';
import StarRating from 'react-native-star-rating';
import style from '../../../Styles/stylesheet';

export default class ReviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      location_data: [],
      current_id: null,
      liked_reviews: [],
      current_name: '',
      imageLoad: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      const { route } = this.props;
      const { id, name, photoPath } = route.params;
      this.setState({ current_id: id, current_name: name, photoPath });

      this.setState({ imageLoad: true });
      this.getLocations(id);
      this.getInfo();
    });
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
          liked_reviews: responseJson.liked_reviews,
        });
        const newList = [];
        this.state.liked_reviews.forEach((item) => {
          newList.push(item.review.review_id);
        });
        this.setState({ liked_reviews: newList }, () => {
          console.log('Done');
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
        this.setState({ location_data: responseJson });
      })
      .catch((error) => {
        console.log(`error = ${error}`);
      });
  }

  async removeLike(locationID, reviewID) {
    const { navigation } = this.props;
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
    const { navigation } = this.props;

    console.log('Post Request made to addLike');
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

  isLiked(locationID, reviewID, likes) {
    const likeIcon = <Icon name="thumbs-up" size={20} color="#fff" />;
    const unlikeIcon = <Icon name="thumbs-o-up" size={20} color="#fff" />;
    if (this.state.liked_reviews.includes(reviewID)) {
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
            <Text style={style.likeButtonText}>{likeIcon} {likes} likes</Text>
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
              {unlikeIcon} {likes} likes </Text>
          </DoubleClick>
        </View>
      );
    }
  }

  locationInformation() {
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
        {this.state.imageLoad ? (
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

        <Text>Overall Rating</Text>
        {this.displayStarRating(
          30,
          style.starContainer,
          this.state.location_data.avg_overall_rating,
        )}
        <Text>Price Rating</Text>
        {this.displayStarRating(
          30,
          style.starContainer,
          this.state.location_data.avg_price_rating,
        )}
        <Text>Cleanliness Rating</Text>
        {this.displayStarRating(
          30,
          style.starContainer,
          this.state.location_data.avg_clenliness_rating,
        )}
        <Text>Quality Rating</Text>
        {this.displayStarRating(
          30,
          style.starContainer,
          this.state.location_data.avg_quality_rating,
        )}
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    if (this.state.isLoading == true) {
      return (
        <View>
          <ActivityIndicator size="large" />
        </View>
      );
    } return (
      <View style={style.mainContainer}>
        {/* <Text>Hello world</Text> */}
        <View style={style.mainHeader}>
          <Text style={style.mainTitle}>{this.state.current_name}</Text>
        </View>
        <View style={style.mainFooter}>
          <FlatList
            data={this.state.location_data.location_reviews}
            ListHeaderComponent={this.locationInformation()}
            renderItem={({ item, index }) => (
              <View style={style.resultContainer}>
                <Text style={style.containerTitle}>
                  {this.state.current_name}
                </Text>
                <Text>
                  Review ID:
                  {item.review_id}
                </Text>
                <View style={style.flexRow}>
                  <View style={style.flexOne}>
                    <Text>Overall Rating</Text>
                    <Text>
                      {this.displayStarRating(
                        20,
                        style.starContainer,
                        item.overall_rating,
                      )}
                    </Text>
                  </View>
                  <View style={style.flexEnd}>
                    <Text>Cleanliness Rating</Text>
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
                    <Text>Price Rating</Text>
                    <Text>
                      {this.displayStarRating(
                        20,
                        style.starContainer,
                        item.price_rating,
                      )}
                    </Text>
                  </View>
                  <View style={style.flexEnd}>
                    <Text>Quality Rating</Text>
                    <Text>
                      {this.displayStarRating(
                        20,
                        style.starContainer,
                        item.quality_rating,
                      )}
                    </Text>
                  </View>
                </View>
                <Text>User Comment: </Text>
                <Text>{item.review_body}</Text>
                <TouchableOpacity style={style.mainButton}>
                  <Text style={style.textCenterWhite}>
                    {this.isLiked(
                      this.state.current_id,
                      item.review_id,
                      item.likes,
                    )}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={style.mainButtonWhite}
                  onPress={() => {
                    navigation.navigate('ViewPhoto', {
                      id: this.state.current_id,
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
