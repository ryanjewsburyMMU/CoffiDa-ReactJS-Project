import 'react-native-gesture-handler';
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import FeedStack from './feedStack';
import Search from '../Comps/Screens/Main/search';
import NearMe from '../Comps/Screens/Main/nearMe';

const Tab = createBottomTabNavigator();

export default class HomeTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const { darkMode } = this.state;

    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Feed') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'Near Me') {
              iconName = focused ? 'radio' : 'radio-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#eaca97',
          inactiveTintColor: 'gray',
          style: {
            backgroundColor: darkMode ? '#424242' : '#fff',
          },
        }}
      >
        <Tab.Screen name="Feed" component={FeedStack} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Near Me" component={NearMe} />

      </Tab.Navigator>
    );
  }
}

HomeTab.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};
