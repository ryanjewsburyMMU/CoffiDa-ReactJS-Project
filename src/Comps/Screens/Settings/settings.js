import React, { Component } from 'react';
import {
  View, Text, ToastAndroid, BackHandler, Alert,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import stylesLight from '../../../Styles/stylesheet';
import stylesDark from '../../../Styles/stylesheetDark';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: null,
      buttonText: '',
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
  }

  handleThemeChange() {
    const { darkMode } = this.state;
    if (darkMode === false) {
      this.setState({ buttonText: 'Disable Dark Mode' });
      this.changeStyleDark();
    } if (darkMode === true) {
      this.setState({ buttonText: 'Enable Dark Mode' });
      this.changeStyleLight();
    }
  }

  async changeStyleLight() {
    // Choose a stylesheet
    ToastAndroid.show('Disabled Dark Mode', ToastAndroid.SHORT);
    await AsyncStorage.setItem('darkMode', 'false');
    this.setState({ darkMode: false });
  }

  async changeStyleDark() {
    // Choose a stylesheet
    ToastAndroid.show('Enabled Dark Mode', ToastAndroid.SHORT);
    await AsyncStorage.setItem('darkMode', 'true');
    this.setState({ darkMode: true });
  }

  async chooseStyle() {
    if (await AsyncStorage.getItem('darkMode') === 'true') {
      this.setState({ darkMode: true, buttonText: 'Disable Dark Mode' });
    } else {
      this.setState({ darkMode: false, buttonText: 'Enable Dark Mode' });
    }
  }

  handleClose = () => {
    Alert.alert(
      'Are You Sure?',
      'Are you sure you want to exit the app?',
      [
        {
          text: 'Cancel',
        },
        { text: 'Yes', onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: true },
    );
  }

  render() {
    const { darkMode, buttonText } = this.state;
    const style = darkMode ? stylesDark : stylesLight;

    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <View style={style.mainContainer}>
        <View style={style.mainHeader}>
          <Text style={style.mainTitle}>Settings</Text>
        </View>
        <View style={style.mainFooter}>
          <Text style={style.textCenterBlack}>Settings Page</Text>
          <View style={style.flexRow}>
            <View style={style.flexOne}>
              <Text style={style.mainButtonWhite}>Dark Mode: </Text>
            </View>
            <View style={style.flexOne}>
              <TouchableOpacity style={style.mainButton} onPress={() => { this.handleThemeChange(); }}>
                <Text style={style.textCenterWhite}>{buttonText}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={style.flexRow}>
            <View style={style.flexOne}>
              <Text style={style.mainButtonWhite}>Close App</Text>
            </View>
            <View style={style.flexOne}>
              <TouchableOpacity style={style.mainButton} onPress={() => { this.handleClose(); }}>
                <Text style={style.textCenterWhite}>Click To Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
Settings.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
