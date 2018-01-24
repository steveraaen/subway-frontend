import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import AppB from'./B/App.js';
import Schedule from'./B/Schedule.js';
import MainMap from'./B/MainMap.js';



const RootNavigator = StackNavigator({

  AppB: {
    screen: AppB
  },
  MainMap: {
    screen: 
  },
  Schedule: {
    screen: Schedule
  }
});

export default RootNavigator;