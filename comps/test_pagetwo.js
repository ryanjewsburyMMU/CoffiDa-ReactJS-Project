import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
} from 'react-native';
import DoubleClick from 'react-native-double-tap';
import { TouchableOpacity } from 'react-native-gesture-handler';
 
export default class App extends React.Component {
    render() {
      return (
        <View>
          <DoubleClick
            singleTap={() => {
              console.log("single tap");
            }}
            doubleTap={() => {
              console.log("double tap");
            }}
            delay={200}
          >
            <Text>Open up App.js to start working on your app!</Text>
            <Text>Changes you make will automatically reload.</Text>
            <Text>Shake your phone to open the developer menu.</Text>
          </DoubleClick>
        </View>
      );
    }
  }