import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../Comps/Screens/Profile/profile';
import SignUp from '../Comps/Screens/Profile/signup';
import Login from '../Comps/Screens/Profile/login';
import EditProfile from '../Comps/Screens/Profile/profile_details';
import MyReviews from '../Comps/Screens/Profile/myReviews';
import EditReview from '../Comps/Screens/Profile/editReviewPage';
import FavouriteLocations from '../Comps/Screens/Profile/favouriteLocations';

const Stack = createStackNavigator();

export default class ProfileStack extends Component {
  render() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="MyReviews" component={MyReviews} />
        <Stack.Screen name="EditReview" component={EditReview} />
        <Stack.Screen name="FavouriteLocations" component={FavouriteLocations} />
      </Stack.Navigator>

    );
  }
}
