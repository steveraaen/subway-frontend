
import React, { Component } from 'react';
import {
  AppRegistry,
  AppState,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import axios from 'axios';
import lineColors from './helpers.js';
import StopsContB from './StopsContB.js';
import Schedule from './Schedule.js';
import Splash from'./Splash.js';
import GeoWatch from'./GeoWatch.js';


class App extends Component<{}> {
    static navigationOptions = {
   headerTitle: 'Nearest Subway Stops',
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
    this.getStops = this.getStops.bind(this)
    this.getAll = this.getAll.bind(this) 
    this.getAll()
  }
 

  getStops(lnglat) {
   /* var stopsURL= 'http://127.0.0.1:5000/api/stops/'  */
     return axios.get('https://subs-backend.herokuapp.com/api/stops/', {
            params: {
                lng: this.state.longitude,
                lat: this.state.latitude,
                
            }
        })    
      .then((response) => {

console.log(response)
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
                        loading: false 
                      });
      })
      .catch(err => console.log(err));
} 
    componentWillMount() {

    }


    getAll() {
        navigator.geolocation.getCurrentPosition(function(pos) {
            var { longitude, latitude, accuracy, heading } = pos.coords
            this.setState({
                longitude: pos.coords.longitude,
                latitude: pos.coords.latitude,
                lnglat: [pos.coords.longitude, pos.coords.latitude],
                accuracy: pos.coords.accuracy,
                heading: pos.coords.heading
            })
            this.getStops()

        }.bind(this))
    }
  componentDidMount() {
     this.getAll()
  }

  render() {
      
    var width = Dimensions.get('window').width;
    var height = Dimensions.get('window').height;
    const { navigate } = this.props.navigation;
   if(this.state.data) {
    return (
<ScrollView style={{height: height}} >
  <View style={styles.container}>
    <View >
        <Text style={styles.instructions}>
          Touch a stop to view the schedule
        </Text>
    </View>
    <View style={{flex: 1, justifyContent: 'flex-start'}}>
        <StopsContB stops={this.state.data} navigation={this.props.navigation}/>
    </View>
    
  </View>
  </ScrollView>
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
});

export const frontend = StackNavigator({
  App: { screen: App },
  GeoWatch: { screen: GeoWatch },
  Splash: { screen: Splash },
});

AppRegistry.registerComponent('frontend', () => frontend);
