import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions, 
  Button,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native';
import MapView from 'react-native-maps';
export default class MainMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
    
  };
  }
/*componentWillMount() {
  console.log(this.props.navigation.state.params.props.coordinates[0])
  this.setState({
    stopLocation: 
      {
        longitude: this.props.navigation.state.params.props.coordinates[0],
        latitude: this.props.navigation.state.params.props.coordinates[1]
      }
  })
}*/


  render() {
const styles= StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  }
    })
    return (
      <View style={styles.map}> 
        <Image 
        source={require('../NYC_subway-4D.svg')}
        />
      </View>
)
}
}