
import React, { Component } from 'react';
import {
  AppRegistry,
  AppState,
  Dimensions,
  StyleSheet,
  FlatList,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin'
import axios from 'axios';
import lineColors from '../helpers.js';
import Schedule from './Schedule.js';
import Status from'./Status.js';

class AppB extends Component {
    static navigationOptions = {
     headerTitle: 'Closest Subway Stations',
     headerStyle: { backgroundColor: 'white' },
     headerTitleStyle: { color: 'gray', fontSize: 22 },
  };
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      lnglat: null,
      lineColors: lineColors
    }
    this.getStops = this.getStops.bind(this)
    this.getSchedule = this.getSchedule.bind(this)
    this.freshSched = this.freshSched.bind(this)
    mixins: [TimerMixin]
  }
// ---------------------------------------------------------
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
        console.log(response.data[0].properties.stop_id)
        this.setState({ data: response.data,
                        id: response.data[0].properties.stop_id,
                        feed: response.data[0].properties.stop_feed,
                        loading: true 
                      },() => {
                        this.getSchedule(this.state.id, this.state.feed)
                      });
      })
      .catch(err => console.log(err));
} 
// -----------------------------------------------------
getSchedule(id, line) { 
    return axios.get('https://subs-backend.herokuapp.com/api/train/', { 
      params: {
        id: this.state.id,
        feed: this.state.feed
        }
    }).then((responseData) => { 
    this.setState({
      loading: false,
      schedule: responseData.data.schedule
      }, () => {
        this.freshSched(this.state.schedule)
      })       
      }).catch(function(error) {
        console.log('problem with getSchedule')
  throw error;
    });
    
  }
 freshSched(p) {
  var schedObj = this.state.schedule;

  for(let trn in schedObj) {
  var north = schedObj[trn].N
  var south = schedObj[trn].S

  function clean(arr) {
  return arr.timeDif > 0
  }
  for(let n in north) {
    var nId = north[n].routeId    
    for(let lc in lineColors){
      if(lineColors[lc].routeArray.includes(nId)) {       
        north[n].color = lineColors[lc].color
      }
    }
    north[n].timeStamp = Math.round((new Date()).getTime() / 1000)
    north[n].timeDif = north[n].departureTime - north[n].timeStamp
    } 
    var cleanNorth = north.filter(clean).slice(0, 4)
  
  for(let s in south) {
    var sId = south[s].routeId    
    for(let lc in lineColors){
      if(lineColors[lc].routeArray.includes(sId)) {       
        south[s].color = lineColors[lc].color
      }
    }
  south[s].timeStamp = Math.round((new Date()).getTime() / 1000)
  south[s].timeDif = south[s].departureTime - south[s].timeStamp
  }
  var cleanSouth = south.filter(clean).slice(0, 4)
  }
  this.setState({ 
        north: cleanNorth,
        south: cleanSouth,
        timeStamp: Math.round((new Date()).getTime() / 1000)
        })
 }
// ----------------------------------------------------
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

      this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          position: position.coords,
         error: null,
        }, () => {
          this.getStops()
        });
        console.log(this.state.latitude)
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 5 },
)
      
        }.bind(this)) 
  var intA = setInterval(() => {
    this.freshSched()
  this.setState({ 
      timeStamp: Math.round((new Date()).getTime() / 1000),
        north: this.state.north,
        south: this.state.south
        })    
}, 15000)      
    }

// ----------------------------------------------------

componentWillUnmount() {
  clearInterval(this.intA);
  }
  handlePress(id, feed) {
     this.setState({
      id: id,
      feed: feed,
    }, () => {
      this.getSchedule(this.state.id, this.state.feed)
    })
}

// ------------------------------------------------
  render() {

    var width = Dimensions.get('window').width;
    var height = Dimensions.get('window').height;     
    return  ( 

      <View style={{marginRight: 20, marginLeft: 20,}}>

        <Text style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold', fontStyle: 'italic', paddingTop: 20}}>Touch a stop to see the schedule</Text>
      <ScrollView style={{height: 190, marginTop: 10}}>
      <FlatList 
        style={{marginTop: 10}}
        data={this.state.data} 
        renderItem={({item}) => 
          <TouchableOpacity 
            onPress={() => this.handlePress(item.properties.stop_id, item.properties.stop_feed, item.properties.stop_name)}      
            style={{ height: 40, alignSelf: 'stretch', marginTop: 4,  paddingBottom: 5, backgroundColor: item.properties.color}}>
              <View style={{justifyContent: 'center', borderWidth: 0}} >
                <Text style={{fontSize: 16, paddingLeft: 5,fontWeight: 'bold', textAlign: "center"}} >{item.properties.stop_name}</Text>
              </View>
              <View style={{justifyContent: 'center'}} >
                <Text style={{fontSize: 14, paddingLeft: 5,fontWeight: 'bold', textAlign: "center"}} >{item.distance.dist.toFixed(3) + " miles"}</Text>
              </View>
          </TouchableOpacity>}
        keyExtractor={item => item.properties.stop_id}
      />
      </ScrollView>
      <View style={{height: 280, marginTop: 20}}>
      <Schedule stops={this.state.data} north={this.state.north} south={this.state.south}/>
    </View>
    </View>
    
    )
    console.log(item)
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#5B5B5B',
    marginTop: 16,
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
  AppB: { screen: AppB }
});
AppRegistry.registerComponent('frontend', () => frontend);




