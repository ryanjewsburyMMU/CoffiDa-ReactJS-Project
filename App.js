import 'react-native-gesture-handler';
import React, { Component } from 'react';
import MainNav from './src/Nav/mainNav';

// Main app that calls the main navigation
export default class App extends Component {
  render() {
    return (
      <MainNav />
    );
  }
}
