import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Search from '../Comps/Screens/Main/search';

const Stack = createStackNavigator();

export default class SearchStack extends Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Search" component={Search} />
      </Stack.Navigator>

    );
  }
}
