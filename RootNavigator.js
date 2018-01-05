import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import App from'./App.js';
import StopdsContB from'./StopdsContB.js';
import Schedule from'./Schedule.js';
import Splash from'./Splash.js';
import GeoWatch from'./GeoWatch.js';


const RootNavigator = StackNavigator({
  Splash: {
    screen: Splash
  },
  Home: {
    screen: App
  },
  Stops: {
    screen: StopdsContB
  },
  Schedule: {
    screen: Schedule
  },
  GeoWatch: {
    screen: GeoWatch
  }
});

export default RootNavigator;