import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

class GeoWatch extends Component {
    static navigationOptions = {
   headerTitle: '5 Nearest Stops',
  headerStyle: { backgroundColor: 'white' },
  headerTitleStyle: { color: 'gray', fontSize: 26 },
  };


  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
    };
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {

        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          heading: position.coords.heading,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );

  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    return (
      <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{fontSize: 14, color: 'yellow'}}>Latitude: {this.state.latitude}</Text>
        <Text style={{fontSize: 14, color: 'yellow'}}>Longitude: {this.state.longitude}</Text>
        <Text style={{fontSize: 14, color: 'yellow'}}>Longitude: {this.state.heading}</Text>
        {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
      </View>
    );
  }
}

export default GeoWatch;