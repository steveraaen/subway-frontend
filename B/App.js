
import React, { Component } from 'react';
import {
  AppRegistry,
  AppState,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import axios from 'axios';
import lineColors from '../helpers.js';
import StopsCont from './StopsCont.js';
import Schedule from './Schedule.js';
import Status from'./Status.js';

class App extends Component<{}> {
    static navigationOptions = {
     headerTitle: 'Touch a stop to see upcoming trains',
     headerStyle: { backgroundColor: 'white' },
     headerTitleStyle: { color: 'gray', fontSize: 22 },
  };
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      lnglat: null,
      lineColors: lineColors,
      stops: null
    }
    this.getStops = this.getStops.bind(this);
   /* this.getStatus = this.getStatus.bind(this);*/
 
  }
/*  getStatus() {
    return axios.get('https://subs-backend.herokuapp.com/api/status', {
    }).then((resp) => {

      this.setState({
        status: resp,
        
      })
    })
  }*/
  getStops(lnglat) {
    /*return axios.get('http://127.0.0.1:5000/api/stops/', { */ 
     return axios.get('https://subs-backend.herokuapp.com/api/stops/', {
            params: {
                lng: this.state.longitude,
                lat: this.state.latitude,               
            }
        })    
      .then((response) => {
        var curColor;
        for(let i = 0; i < response.data.length; i++) {
          var resObj = response.data[i].properties;         
          var stpLine = resObj.stop_id[0];

          for(let lne in this.state.lineColors) {
            if(this.state.lineColors[lne].routeArray.includes(stpLine)) {
              curColor = this.state.lineColors[lne].color
              resObj.color = curColor                    
            }
          }
        }
        this.setState({ data: response.data,
                        loading: true 
                      });
      })
      .catch(err => console.log(err));
} 
    componentWillMount() {
        navigator.geolocation.getCurrentPosition(function(pos) {
            var { longitude, latitude, accuracy, heading } = pos.coords
            this.setState({
                longitude: pos.coords.longitude,
                latitude: pos.coords.latitude,
                lnglat: [pos.coords.longitude, pos.coords.latitude],
                position: pos.coords
            })
        console.log(this.state.latitude)
            this.getStops()
                    
        }.bind(this))
    }

  componentDidMount() {
      this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          position: position.coords,
         error: null,
        });
        console.log(this.state.latitude)
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 3000, distanceFilter: 50 },
)
  }
  componentWillUpdate() {
     this.getStops()
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }
  render() {
      
    var width = Dimensions.get('window').width;
    var height = Dimensions.get('window').height;
    const { navigate } = this.props.navigation;
   if(this.state.data) {
    return (
<View>
  <TouchableOpacity
    onPress={() => navigate('Status', {position: this.state.position, data: this.state.data})}
    style={styles.header}>
    <View>
      <Text style={{fontSize: 20, textAlign: 'center'}}>Console</Text>
    </View>
  </TouchableOpacity>

<ScrollView style={{height: height}} >
  <View style={styles.container}>
    <View style={{flex: 1, justifyContent: 'flex-start'}}>
        <StopsCont stops={this.state.data} navigation={this.props.navigation} position={this.state.position}/>
    </View>    
  </View>
  </ScrollView>
</View>

    );
  } else {
        return (
      <View style={styles.container}>

        <View><Text>.. Loading </Text></View>
      </View>
    );
  }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#5B5B5B',
    marginTop: 6,
    marginBottom: 2,
    paddingBottom: 2
  },
  instructions: {
    color: 'white',
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 5,
  },
  header: {
    backgroundColor: 'gray',
    marginTop: 15
  }
});

export const frontend = StackNavigator({
  App: { screen: App },
  Status: { screen: Status }
});

AppRegistry.registerComponent('frontend', () => frontend);
