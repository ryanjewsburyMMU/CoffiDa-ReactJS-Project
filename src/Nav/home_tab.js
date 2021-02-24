import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import FeedStack from './feedStack';
import Search from '../Comps/Screens/Main/search';
import NearMe from '../Comps/Screens/Main/nearMe';

import stylesLight from '.././Styles/stylesheet';
import stylesDark from '../././Styles/stylesheetDark';

const Tab = createBottomTabNavigator();

export default class Home_Tab extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  }

  async chooseStyle() {
    // Choose a stylesheet
    if (await AsyncStorage.getItem('darkMode') === 'true') {
      this.setState({ darkMode: true });
    } else {
      this.setState({ darkMode: false });
    }
  }

  render() {
    const style = this.state.darkMode ? stylesDark : stylesLight;

    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name == 'Feed') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name == 'Search') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name == 'Near Me') {
              iconName = focused ? 'radio' : 'radio-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#eaca97',
          inactiveTintColor: 'gray',
          style: {
            backgroundColor: style.tabBar.color,
          }
        }}
      >
        <Tab.Screen name="Feed" component={FeedStack} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Near Me" component={NearMe} />

      </Tab.Navigator>
    );
  }
}
