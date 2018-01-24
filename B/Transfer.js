/*bwgv-ekpr-tnpf-rbfj*/
import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  FlatList,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import axios from 'axios';

export default class Transfer extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {

    return axios.get('http://127.0.0.1:5000/api/stops/', {
  })
}
  render() {

    return (
      <View>
        <Text>Hello</Text>
      </View>
      )
  }
}