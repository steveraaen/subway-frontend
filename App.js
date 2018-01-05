
import React, { Component } from 'react';
import {
  AppRegistry,
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
   headerTitle: '5 Nearest Stops',
  headerStyle: { backgroundColor: 'white' },
  headerTitleStyle: { color: 'gray', fontSize: 26 },
  };
  constructor(props) {
    super(props);
    this.state = {
      lnglat: null,
      lineColors: lineColors,
      stops: null
    }
    this.getStops = this.getStops.bind(this)
    this.getAll = this.getAll.bind(this)
  }
 

  getStops(lnglat) {
    /*var stopsURL= 'https://subs-backend.herokuapp.com/api/stops'*/  
     return axios.get('http://127.0.0.1:5000/api/stops/', {
            params: {
                lng: this.state.longitude,
                lat: this.state.latitude 
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
        this.setState({ data: response.data.slice(0, 5),
                        loading: false 
                      });
      })
      .catch(err => console.log(err));
} 
    getAll() {
        navigator.geolocation.getCurrentPosition(function(pos) {
            var { longitude, latitude, accuracy } = pos.coords
            this.setState({
                longitude: pos.coords.longitude,
                latitude: pos.coords.latitude,
                lnglat: [pos.coords.longitude, pos.coords.latitude],
                accuracy: pos.coords.accuracy
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
<ScrollView>
  <View style={styles.container}>
    <View >
        <Text style={styles.instructions}>
          Touch a Stop To View The Schedule
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
    marginTop: 10,
  },
  instructions: {
    color: 'white',
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 10,
  },
});

export const frontend = StackNavigator({
  App: { screen: App },
  GeoWatch: { screen: GeoWatch },
  Splash: { screen: Splash },
});

AppRegistry.registerComponent('frontend', () => frontend);
