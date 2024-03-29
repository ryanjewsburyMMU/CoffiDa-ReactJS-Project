import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import stylesLight from '../../../Styles/stylesheet';
import stylesDark from '../../../Styles/stylesheetDark';

export default class CameraPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentID: 0,
      reviewID: 0,
      darkMode: null,
    };
  }

  componentDidMount() {
    this.chooseStyle();
    const { route } = this.props;
    const { id } = route.params;
    this.setState(
      {
        currentID: id,
      },
      () => {
        this.getInfo();
      },
    );
  }

  async getInfo() {
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/user/${await AsyncStorage.getItem('@user_id')}`,
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
        const newList = [];
        responseJson.reviews.forEach((item) => {
          newList.push(item.review.review_id);
        });
        const highestValue = Math.max.apply(Math, newList);
        this.setState({ reviewID: highestValue });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  takePicture = async () => {
    const options = { quality: 0.5, base64: true };
    const data = await this.camera.takePictureAsync(options);

    Alert.alert(
      'You Have Taken a Photo',
      'Your photo has been saved, would you like to view this photo, or take another one?',
      [
        {
          text: 'Submit Photo',
          onPress: () => this.postPhoto(data),
        },
        {
          text: 'Retake Photo',
          onPress: () => console.log('Retake Pressed'),
        },
      ],
    );
  };

  async postPhoto(data) {
    const { navigation } = this.props;
    const { currentID, reviewID } = this.state;
    return fetch(
      `http://10.0.2.2:3333/api/1.0.0/location/${currentID}/review/${reviewID}/photo`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'image/jpeg',
          'X-Authorization': await AsyncStorage.getItem('@session_token'),
        },
        body: data,
      },
    )
      .then((response) => {
        if (response.status === 200) {
          Alert.alert(
            'Thanks!',
            'We have submitted your review, you can check your review in Profile - My Reviews!',
            [
              {
                text: 'Okay',
                onPress: () => navigation.navigate('Feed'),
              },
            ],
          );
        }
        if (response.status === 400) {
          Alert.alert(
            'An Error Occured! (Error:400)',
            'Please Check your input and try again. ',
          );
        }
        if (response.status === 401) {
          Alert.alert(
            'Are You Logged In? (Error:401)',
            'An error occured, this usually means your not logged in.',
          );
        }
        if (response.status === 404) {
          Alert.alert(
            'An Error Occured (Error:404)?',
            'An error occured, this usually means your not logged in.',
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
    const { darkMode } = this.state;
    const camera = <Icon name="camera" size={50} color="#fff" />;
    const style = darkMode ? stylesDark : stylesLight;

    return (
      <View style={style.displayCamera}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          captureAudio={false}
          defaultTouchToFocus
          mirrorImage={false}
          style={style.flexOne}
        />
        <TouchableOpacity
          onPress={() => {
            this.takePicture();
          }}
        >
          <Text style={style.cameraBorder}>{camera}</Text>
        </TouchableOpacity>
        <View style={style.cameraHeader}>
          <Text style={style.cameraTitle}>Camera</Text>
        </View>
      </View>
    );
  }
}

CameraPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};
