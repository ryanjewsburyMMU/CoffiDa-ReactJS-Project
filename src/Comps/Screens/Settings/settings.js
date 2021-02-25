/* eslint-disable */

import React, { Component } from 'react';
import {
  View, Text, Image, ActivityIndicator, Alert, ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import stylesLight from '../../../Styles/stylesheet';
import stylesDark from '../../../Styles/stylesheetDark';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Geolocation from 'react-native-geolocation-service';
export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: null,
      buttonText: "",
      locationPermission: false
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.chooseStyle();
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  async chooseStyle() {
    if (await AsyncStorage.getItem('darkMode') === 'true'){
      this.setState({darkMode: true, buttonText: "Disable Dark Mode"})
    }else{
      this.setState({darkMode: false, buttonText: "Enable Dark Mode"})
    }
  }

  async changeStyleDark() {
    // Choose a stylesheet
    ToastAndroid.show("Enabled Dark Mode", ToastAndroid.SHORT);
    await AsyncStorage.setItem('darkMode', 'true');
    this.setState({ darkMode: true });
  }

  async changeStyleLight() {
    // Choose a stylesheet
    ToastAndroid.show("Disabled Dark Mode", ToastAndroid.SHORT);
    await AsyncStorage.setItem('darkMode', 'false');
    this.setState({ darkMode: false });
  }

  handleThemeChange(){
      console.log("Something is happening, just not sure what")
      if(this.state.darkMode == false){
          this.setState({buttonText: "Disable Dark Mode"})
          this.changeStyleDark()
      }if(this.state.darkMode == true){
        this.setState({buttonText: "Enable Dark Mode"})
        this.changeStyleLight()
    }
  }

  render() {
    const style = this.state.darkMode ? stylesDark : stylesLight;
    const { navigation } = this.props;
    console.log(this.state.photo);
    
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <View style={style.mainContainer}>
        <View style={style.mainHeader}>
          <Text style={style.mainTitle}>Settings</Text>
        </View>
        <View style={style.mainFooter}>
            <TouchableOpacity style={style.mainButton} onPress={()=>{this.handleThemeChange()}}>
                <Text style={style.textCenterWhite}>{this.state.buttonText}</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}
