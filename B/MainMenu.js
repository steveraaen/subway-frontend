import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions, 
  Button,
  FlatList,
  Modal,
  TouchableOpacity
} from 'react-native';
import MapView from 'react-native-maps';
export default class Menu extends Component {
  constructor(props) {
    super(props)
    this.state = {
    
  };
  }
componentWillMount() {
  console.log(this.props.navigation.state.params.props.coordinates[0])
  this.setState({
    stopLocation: 
      {
        longitude: this.props.navigation.state.params.props.coordinates[0],
        latitude: this.props.navigation.state.params.props.coordinates[1]
      }
  })
}


  render() {
const styles= StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  }
    })
    return (
      <View style={styles.map}> 
          <MapView
              style={styles.map}
              zoomEnabled={true}
            rotateEnabled={false}
            scrollEnabled={false}
            initialRegion={{
              latitude: this.props.navigation.state.params.props.uLatitude,
              longitude: this.props.navigation.state.params.props.uLongitude,
              latitudeDelta: 0.0322,
              longitudeDelta: 0.0121,
    }}>
    <MapView.Marker
    pinColor={this.props.color}
      coordinate={this.state.stopLocation}
      title={`The ${this.props.route} ${this.props.name}`}
      /*description={marker.description}*/
    />


  </MapView>
 </View>
)
}
}