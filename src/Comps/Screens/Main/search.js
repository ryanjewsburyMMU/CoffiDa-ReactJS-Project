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
import stylesLight from '../../../Styles/stylesheet';
import stylesDark from '../../../Styles/stylesheetDark';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cafe_name: '',

      advancedFilter: false,
      value_overall: 0,
      overall_rating_active: false,

      value_price: 0,
      price_rating_active: false,

      value_clenliness: 0,
      clenliness_rating_active: false,

      value_quality: 0,
      quality_rating_active: false,

      search_in: '',

      limit: 2,
      offset: 0,

      searchResponse: [],

      darkMode: null,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.chooseStyle();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.setState({ darkMode: null })
  }

  viewMore = () => {
    console.log(`OFFSET = ${this.state.offset}`);
    this.setState(
      {
        offset: this.state.offset + 2,
      },
      () => {
        this.createCurl();
      },
    );
  };

  viewLess = (offset) => {
    if (offset === 0) {
      Alert.alert(
        'No Previous Results',
        'There are no results prior to the current ones on screen. Try "Next Page" to see more.',
      );
    } else {
      this.setState(
        {
          offset: this.state.offset - 2,
        },
        () => {
          this.createCurl();
        },
      );
    }
  };

  presentResults(style) {
    if (this.state.searchResponse == '') {
      return (
        <View>
          <Text />
        </View>
      );
    }
    return (
      <View style={style.gapTop}>
        {/* Leave here? */}
        <View style={style.flexRow}>
          <View style={style.flexOne}>
            <TouchableOpacity
              onPress={() => {
                this.viewLess(this.state.offset);
              }}
            >
              <Text style={style.regularTextBlack}>Previous Page</Text>
            </TouchableOpacity>
          </View>
          <View style={style.flexEnd}>
            <TouchableOpacity
              onPress={() => {
                this.viewMore(this.state.searchResponse.length);
              }}
            >
              <Text style={style.regularTextBlack}>Next Page</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={this.state.searchResponse}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                { console.log(`You clicked id ${item.location_id}`);}
              }}
            >
              <View style={style.flexEnd}>
                <View style={style.resultContainer}>
                  <Text style={style.containerTitle}>{item.location_name}</Text>
                  <Text style={style.regularTextBlack}>{item.location_town} </Text>

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
                    <View style={{ flex: 1 }}>
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
    if (this.state.advancedFilter === true) {
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
                    {this.state.value_overall}
                  </Text>
                </View>
                <View>
                  <CheckBox
                    value={this.state.overall_rating_active}
                    onValueChange={() => {
                      this.setState({
                        overall_rating_active: !this.state.overall_rating_active,
                      });
                    }}
                    tintColors={{ true: '#eaca97' }}
                  />
                </View>
                <View>
                  <View>
                    <Slider
                      style={{ width: 150, height: 40 }}
                      step={1}
                      minimumValue={0}
                      maximumValue={5}
                      minimumTrackTintColor="#eaca97"
                      thumbTintColor="#eaca97"
                      maximumTrackTintColor="#eaca97"
                      value={this.state.value_overall}
                      onValueChange={(value) => this.setState({ value_overall: value })}
                      disabled={!this.state.overall_rating_active}
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
                    {this.state.value_price}
                  </Text>
                </View>
                <View>
                  <CheckBox
                    value={this.state.price_rating_active}
                    onValueChange={() => {
                      this.setState({
                        price_rating_active: !this.state.price_rating_active,
                      });
                    }}
                    tintColors={{ true: '#eaca97' }}
                  />
                </View>
                <View>
                  <View>
                    <Slider
                      style={{ width: 150, height: 40 }}
                      step={1}
                      minimumValue={0}
                      maximumValue={5}
                      minimumTrackTintColor="#eaca97"
                      thumbTintColor="#eaca97"
                      maximumTrackTintColor="#eaca97"
                      value={this.state.value_price}
                      onValueChange={(value) => this.setState({ value_price: value })}
                      disabled={!this.state.price_rating_active}
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
                    {this.state.value_clenliness}
                  </Text>
                </View>
                <View>
                  <CheckBox
                    value={this.state.clenliness_rating_active}
                    onValueChange={() => {
                      this.setState({
                        clenliness_rating_active: !this.state
                          .clenliness_rating_active,
                      });
                    }}
                    tintColors={{ true: '#eaca97' }}
                  />
                </View>
                <View>
                  <View>
                    <Slider
                      style={{ width: 150, height: 40 }}
                      step={1}
                      minimumValue={0}
                      maximumValue={5}
                      minimumTrackTintColor="#eaca97"
                      thumbTintColor="#eaca97"
                      maximumTrackTintColor="#eaca97"
                      value={this.state.value_clenliness}
                      onValueChange={(value) => this.setState({ value_clenliness: value })}
                      disabled={!this.state.clenliness_rating_active}
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
                    {this.state.value_quality}
                  </Text>
                </View>
                <View>
                  <CheckBox
                    value={this.state.quality_rating_active}
                    onValueChange={() => {
                      this.setState({ quality_rating_active: !this.state.quality_rating_active });
                    }}
                    tintColors={{ true: '#eaca97' }}
                  />
                </View>
                <View>
                  <View>
                    <Slider
                      style={{ width: 150, height: 40 }}
                      step={1}
                      minimumValue={0}
                      maximumValue={5}
                      minimumTrackTintColor="#eaca97"
                      thumbTintColor="#eaca97"
                      maximumTrackTintColor="#eaca97"
                      value={this.state.value_quality}
                      onValueChange={(value) => this.setState({ value_quality: value })}
                      disabled={!this.state.quality_rating_active}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View>
            <Text style={style.textCenterBlack}>Where Would You Like To Search?</Text>
            <Picker
              selectedValue={this.state.search_in}
              style={{ height: 50, width: '100%', color: '#fff' }}
              onValueChange={(itemValue, itemIndex) => this.setState({ search_in: itemValue })}
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
  };

  async chooseStyle() {
    // Choose a stylesheet
    if (await AsyncStorage.getItem('darkMode') === 'true'){
      this.setState({darkMode: true})
    }else{
      this.setState({darkMode: false})
    }
  }

  // Consider Moving this somehow / fixing error
  // eslint-disable-next-line class-methods-use-this
  displayStarRating(size, styles, rating, style) {
    return (
      // eslint-disable-next-line react/jsx-filename-extension
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
    if ((await AsyncStorage.getItem('@session_token')) == null) {
      Alert.alert('Please Login To Access This Feature');
    } else {
      let finalCurl = 'http://10.0.2.2:3333/api/1.0.0/find?';
      console.log(finalCurl);
      // Searching By Cafe Name
      if (this.state.cafe_name != '') {
        const search_name = this.state.cafe_name.replace(/\s/g, '%20');
        finalCurl = `${finalCurl}q=${search_name}`;
      }

      // Searching By Overall Rating
      if (this.state.overall_rating_active == true) {
        finalCurl = `${finalCurl}&overall_rating=${this.state.value_overall}`;
      }

      // Searching By Price Rating
      if (this.state.price_rating_active == true) {
        finalCurl = `${finalCurl}&price_rating=${this.state.value_price}`;
        console.log('Price Rating is true');
      }

      // Searching By Quality Rating
      if (this.state.quality_rating_active == true) {
        finalCurl = `${finalCurl}&quality_rating=${this.state.value_quality}`;
        console.log('Quality Rating is true');
      }
      // Searching By Cleanliness Rating
      if (this.state.clenliness_rating_active == true) {
        finalCurl = `${finalCurl}&clenliness_rating=${this.state.value_clenliness}`;
        console.log('Cleaniness Rating is true');
      }
      // Search In
      if (this.state.search_in == 'favourite') {
        finalCurl = `${finalCurl}&search_in=${this.state.search_in}`;
      } else if (this.state.search_in == 'reviewed') {
        finalCurl = `${finalCurl}&search_in=${this.state.search_in}`;
      }
      finalCurl = `${finalCurl}&limit=${this.state.limit}&offset=${this.state.offset}`;

      this.searchResults(finalCurl);
    }
  }

  async searchResults(finalCurl) {
    console.log('Searching the database for your search queires');
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
        console.log('something here');
        if (responseJson == '') {
          // Handles No Search Results
          if (this.state.offset - 2 < 0) {
            Alert.alert('No results found');
          } else {
            // Handles Next Page
            this.setState(
              {
                offset: this.state.offset - 2,
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
      value_overall: 0,
      value_price: 0,
      value_clenliness: 0,
      value_quality: 0,
    });
  }

  render() {
    const style = this.state.darkMode ? stylesDark : stylesLight;
    const { navigation } = this.props;
    const searchIcon = <Icon name="search" size={20} color="#fff" />;
    if (this.state.darkMode === null){
      return(
        <View><Text>Loading</Text></View>
      )
    }return (
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
                this.setState({ cafe_name: text }), this.setState({ offset: 0 });
              }}
              value={this.state.cafe_name}
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
              this.setState({ advancedFilter: !this.state.advancedFilter });
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
