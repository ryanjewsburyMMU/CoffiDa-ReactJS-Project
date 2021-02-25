import React, { Component } from 'react';

import {
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import StarRating from 'react-native-star-rating';
import PropTypes from 'prop-types';
import stylesLight from '../../../Styles/stylesheet';
import stylesDark from '../../../Styles/stylesheetDark';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cafeName: '',

      advancedFilter: false,
      valueOverall: 0,
      overallRatingActive: false,

      valuePrice: 0,
      priceRatingOverall: false,

      valueClenliness: 0,
      clenlinessRatingActive: false,

      valueQuality: 0,
      qualityRatingActive: false,

      searchIn: '',

      limit: 2,
      offset: 0,

      searchResponse: [],

      darkMode: null,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.chooseStyle();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.setState({ darkMode: null });
  }

  handleReviewPress(id, name) {
    const { navigation } = this.props;
    Alert.alert(`Would You Like To View${name}`, 'This will transfer you to the feed page, where you will be able to see reviews and more details.', [
      {
        text: 'Yes!',
        onPress: () => { navigation.navigate('ReviewPage', { id, name }); },
      },
      {
        text: 'No Thanks',
      },
    ]);
  }

  viewMore = () => {
    const { offset } = this.state;
    this.setState(
      {
        offset: offset + 2,
      },
      () => {
        this.createCurl();
      },
    );
  };

  viewLess = (offset_) => {
    const { offset } = this.state;
    if (offset_ === 0) {
      Alert.alert(
        'No Previous Results',
        'There are no results prior to the current ones on screen. Try "Next Page" to see more.',
      );
    } else {
      this.setState(
        {
          offset: offset - 2,
        },
        () => {
          this.createCurl();
        },
      );
    }
  };

  presentResults(style) {
    const { searchResponse, offset } = this.state;

    if (searchResponse === '') {
      return (
        <View />
      );
    }
    return (
      <View style={style.gapTop}>
        {/* Leave here? */}
        <View style={style.flexRow}>
          <View style={style.flexOne}>
            <TouchableOpacity
              onPress={() => {
                this.viewLess(offset);
              }}
            >
              <Text style={style.regularTextBlack}>Previous Page</Text>
            </TouchableOpacity>
          </View>
          <View style={style.flexEnd}>
            <TouchableOpacity
              onPress={() => {
                this.viewMore(searchResponse.length);
              }}
            >
              <Text style={style.regularTextBlack}>Next Page</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={searchResponse}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => { this.handleReviewPress(item.location_id, item.location_name); }}
            >
              <View style={style.flexEnd}>
                <View style={style.resultContainer}>
                  <Text style={style.containerTitle}>{item.location_name}</Text>
                  <Text style={style.regularTextBlack}>
                    {item.location_town}
                    {' '}
                  </Text>

                  <View style={style.flexRow}>
                    <View style={style.flexOne}>
                      <Text style={style.regularTextBlack}>Overall Rating</Text>
                      <Text>
                        {this.displayStarRating(
                          20,
                          style.starContainer,
                          item.avg_overall_rating,
                        )}
                      </Text>
                    </View>
                    <View style={style.flexEnd}>
                      <Text style={style.regularTextBlack}>Cleanliness Rating</Text>
                      <Text>
                        {this.displayStarRating(
                          20,
                          style.starContainer,
                          item.avg_clenliness_rating,
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
                          item.avg_price_rating,
                        )}
                      </Text>
                    </View>
                    <View style={style.flexEnd}>
                      <Text style={style.regularTextBlack}>Quality Rating</Text>
                      <Text>
                        {this.displayStarRating(
                          20,
                          style.starContainer,
                          item.avg_quality_rating,
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }

  advancedSearch(style) {
    const {
      advancedFilter, valueOverall, overallRatingActive, valuePrice, priceRatingOverall,
      valueClenliness, clenlinessRatingActive, valueQuality, qualityRatingActive, searchIn,

    } = this.state;
    if (advancedFilter === true) {
      return (
        // eslint-disable-next-line react/jsx-filename-extension
        <View>
          <View style={style.flexRow}>
            <View style={style.flexOne}>
              <View style={style.filterRow}>
                <View>
                  <Text style={style.textCenterBlack}>
                    Minimum Overall Rating?
                  </Text>
                  <Text style={style.textCenterBlack}>
                    {valueOverall}
                  </Text>
                </View>
                <View>
                  <CheckBox
                    value={overallRatingActive}
                    onValueChange={() => {
                      this.setState({
                        overallRatingActive: !overallRatingActive,
                      });
                    }}
                    tintColors={{ true: '#eaca97' }}
                  />
                </View>
                <View>
                  <View>
                    <Slider
                      style={style.sliderStyle}
                      step={1}
                      minimumValue={0}
                      maximumValue={5}
                      minimumTrackTintColor="#eaca97"
                      thumbTintColor="#eaca97"
                      maximumTrackTintColor="#eaca97"
                      value={valueOverall}
                      onValueChange={(value) => this.setState({ valueOverall: value })}
                      disabled={!overallRatingActive}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={style.flexOne}>
              <View style={style.filterRow}>
                <View>
                  <Text style={style.textCenterBlack}>
                    Minimum Price Rating?
                  </Text>
                  <Text style={style.textCenterBlack}>
                    {valuePrice}
                  </Text>
                </View>
                <View>
                  <CheckBox
                    value={priceRatingOverall}
                    onValueChange={() => {
                      this.setState({
                        priceRatingOverall: !priceRatingOverall,
                      });
                    }}
                    tintColors={{ true: '#eaca97' }}
                  />
                </View>
                <View>
                  <View>
                    <Slider
                      style={style.sliderStyle}
                      step={1}
                      minimumValue={0}
                      maximumValue={5}
                      minimumTrackTintColor="#eaca97"
                      thumbTintColor="#eaca97"
                      maximumTrackTintColor="#eaca97"
                      value={valuePrice}
                      onValueChange={(value) => this.setState({ valuePrice: value })}
                      disabled={!priceRatingOverall}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={style.flexRow}>
            <View style={style.flexOne}>
              <View style={style.filterRow}>
                <View>
                  <Text style={style.textCenterBlack}>
                    Min Cleanliness Rating?
                  </Text>
                  <Text style={style.textCenterBlack}>
                    {valueClenliness}
                  </Text>
                </View>
                <View>
                  <CheckBox
                    value={clenlinessRatingActive}
                    onValueChange={() => {
                      this.setState({
                        clenlinessRatingActive: !clenlinessRatingActive,
                      });
                    }}
                    tintColors={{ true: '#eaca97' }}
                  />
                </View>
                <View>
                  <View>
                    <Slider
                      style={style.sliderStyle}
                      step={1}
                      minimumValue={0}
                      maximumValue={5}
                      minimumTrackTintColor="#eaca97"
                      thumbTintColor="#eaca97"
                      maximumTrackTintColor="#eaca97"
                      value={valueClenliness}
                      onValueChange={(value) => this.setState({ valueClenliness: value })}
                      disabled={!clenlinessRatingActive}
                    />
                  </View>
                </View>
              </View>
            </View>
            {/* SECOND ROW */}
            <View style={style.flexOne}>
              <View style={style.filterRow}>
                <View>
                  <Text style={style.textCenterBlack}>
                    Minimum Quality Rating?
                  </Text>
                  <Text style={style.textCenterBlack}>
                    {valueQuality}
                  </Text>
                </View>
                <View>
                  <CheckBox
                    value={qualityRatingActive}
                    onValueChange={() => {
                      this.setState({ qualityRatingActive: !qualityRatingActive });
                    }}
                    tintColors={{ true: '#eaca97' }}
                  />
                </View>
                <View>
                  <View>
                    <Slider
                      style={style.sliderStyle}
                      step={1}
                      minimumValue={0}
                      maximumValue={5}
                      minimumTrackTintColor="#eaca97"
                      thumbTintColor="#eaca97"
                      maximumTrackTintColor="#eaca97"
                      value={valueQuality}
                      onValueChange={(value) => this.setState({ valueQuality: value })}
                      disabled={!qualityRatingActive}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View>
            <Text style={style.textCenterBlack}>Where Would You Like To Search?</Text>
            <Picker
              selectedValue={searchIn}
              style={style.pickerStyle}
              onValueChange={(itemValue) => this.setState({ searchIn: itemValue })}
            >
              <Picker.Item label="Everywhere" value="everywhere" />
              <Picker.Item label="My Favourite Locations" value="favourite" />
              <Picker.Item label="My Reviews" value="reviewed" />
            </Picker>
          </View>
        </View>
      );
    }
    return <View />;
  }

  async chooseStyle() {
    // Choose a stylesheet
    if (await AsyncStorage.getItem('darkMode') === 'true') {
      this.setState({ darkMode: true });
    } else {
      this.setState({ darkMode: false });
    }
  }

  // Consider Moving this somehow / fixing error
  displayStarRating(size, styles, rating) {
    return (
      <StarRating
        disabled={false}
        fullStarColor="#eaca97"
        maxStars={5}
        rating={rating}
        starSize={size}
        style={styles}
      />
    );
  }

  async createCurl() {
    const {
      cafeName, overallRatingActive, valueOverall, priceRatingOverall, valuePrice,
      qualityRatingActive, valueQuality, clenlinessRatingActive, valueClenliness, searchIn,
      limit, offset,
    } = this.state;

    if ((await AsyncStorage.getItem('@session_token')) == null) {
      Alert.alert('Please Login To Access This Feature');
    } else {
      let finalCurl = 'http://10.0.2.2:3333/api/1.0.0/find?';
      console.log(finalCurl);
      // Searching By Cafe Name
      if (cafeName !== '') {
        const searchName = cafeName.replace(/\s/g, '%20');
        finalCurl = `${finalCurl}q=${searchName}`;
      }

      // Searching By Overall Rating
      if (overallRatingActive === true) {
        finalCurl = `${finalCurl}&overall_rating=${valueOverall}`;
      }

      // Searching By Price Rating
      if (priceRatingOverall === true) {
        finalCurl = `${finalCurl}&price_rating=${valuePrice}`;
      }

      // Searching By Quality Rating
      if (qualityRatingActive === true) {
        finalCurl = `${finalCurl}&quality_rating=${valueQuality}`;
      }
      // Searching By Cleanliness Rating
      if (clenlinessRatingActive === true) {
        finalCurl = `${finalCurl}&clenliness_rating=${valueClenliness}`;
      }
      // Search In
      if (searchIn === 'favourite') {
        finalCurl = `${finalCurl}&searchIn=${searchIn}`;
      } else if (searchIn === 'reviewed') {
        finalCurl = `${finalCurl}&searchIn=${searchIn}`;
      }
      finalCurl = `${finalCurl}&limit=${limit}&offset=${offset}`;

      this.searchResults(finalCurl);
    }
  }

  async searchResults(finalCurl) {
    return fetch(finalCurl, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': await AsyncStorage.getItem('@session_token'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 400) {
          Alert.alert(
            `Incorrect Details (${response.status})`,
            'Please ensure your email and password are correct, if the problem persits please contact our team for more support.',
          );
        }
        if (response.status === 500) {
          console.log(
            `Server Error, Please try again soon.  ${response.status}`,
          );
          Alert.alert(
            'Connection Error',
            'We are struggling to connect with you! Please try again or contact our team for further support.',
          );
        }
      })
      .then(async (responseJson) => {
        const { offset } = this.state;
        if (responseJson == '') {
          // Handles No Search Results
          if (offset - 2 < 0) {
            Alert.alert('No results found');
          } else {
            // Handles Next Page
            this.setState(
              {
                offset: offset - 2,
              },
              () => {
                Alert.alert('No More Results found');
                this.createCurl();
              },
            );
          }
        }
        this.setState({
          searchResponse: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  resetFilters() {
    this.setState({
      valueOverall: 0,
      valuePrice: 0,
      valueClenliness: 0,
      valueQuality: 0,
    });
  }

  render() {
    const { darkMode, cafeName, advancedFilter } = this.state;
    const style = darkMode ? stylesDark : stylesLight;
    const searchIcon = <Icon name="search" size={20} color="#fff" />;

    if (darkMode === null) {
      return (
        <View><Text>Loading</Text></View>
      );
    } return (
      <View style={style.mainContainer}>
        <View style={style.mainHeader}>
          <Text style={style.mainTitle}>Search</Text>
        </View>
        <View style={style.mainFooter}>
          <View style={style.flexRow}>
            <TextInput
              style={style.searchBar}
              placeholder="Seach By Cafe Name Or Location"
              onChangeText={(text) => {
                this.setState({ cafeName: text, offset: 0 });
              }}
              value={cafeName}
            />
            <TouchableOpacity
              style={style.searchButton}
              onPress={() => {
                this.createCurl();
              }}
            >
              <Text style={style.searchIcon}>{searchIcon}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.setState({ advancedFilter: !advancedFilter });
            }}
          >
            <Text style={style.textCenterBlack}>Advanced Search</Text>
          </TouchableOpacity>
          {this.advancedSearch(style)}
          {this.presentResults(style)}
        </View>
      </View>
    );
  }
}
Search.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};
