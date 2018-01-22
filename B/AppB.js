/*bwgv-ekpr-tnpf-rbfj*/
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import lineColors from '../helpers.js';
import Schedule from './Schedule.js';
import FadeInView from './AppC.js';
import Menu from './MainMenu.js';

class AppB extends Component {
    static navigationOptions = {
     headerTitle: 'Real-Time Subways',
     headerStyle: { backgroundColor: 'gray' },
     headerTitleStyle: {  color: 'white', fontSize:22, fontWeight: 'bold', fontStyle: 'italic'}
  };
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      uLnglat: null,
      lineColors: lineColors,
      modalVisible: false
    }
    this.getStops = this.getStops.bind(this)
    this.getSchedule = this.getSchedule.bind(this)
    this.freshSched = this.freshSched.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    mixins: [TimerMixin]
    console.log(this.state.appState)
  }
// ---------------------------------------------------------
  openModal() {
    this.setState({modalVisible:true});
  }

  closeModal() {
    this.setState({modalVisible:false});
  }
  getStops(lng,lat) {
    /*return axios.get('http://127.0.0.1:5000/api/stops/', { */ 
     return axios.get('https://subs-backend.herokuapp.com/api/stops/', {
            params: {
                lng: this.state.uLongitude,
                lat: this.state.uLatitude,               
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
                        id: response.data[0].properties.stop_id,
                        feed: response.data[0].properties.stop_feed,
                        name: response.data[0].properties.stop_name,
                        coordinates: response.data[0].geometry.coordinates,
                        title: response.data[0].properties.stop_name,
                        distance: response.data[0].distance.dist,
                        route: response.data[0].properties.stop_id[0],
                       
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
    console.log(trn)
    console.log([trn])
    console.log(schedObj[trn])
  var north = schedObj[trn].N
  var south = schedObj[trn].S
  

  function clean(arr) {
  return arr.timeDif > 0
  }

  for(let n in north) {
    var nameId = north[n].routeId
    var routeId = Object.keys(schedObj)
  
    for(let lc in lineColors){
      if(lineColors[lc].routeArray.includes(nameId)) {       
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
                uLongitude: pos.coords.longitude,
                uLatitude: pos.coords.latitude,
                uLnglat: [pos.coords.longitude, pos.coords.latitude],
                uPosition: pos.coords
            })
        console.log(this.state.latitude)

      this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          uLatitude: position.coords.latitude,
          uLongitude: position.coords.longitude,
          uPosition: position.coords,
         error: null,
        }, () => {
          this.getStops(this.state.longitude, this.state.latitude)
        });
        console.log(this.state.latitude)
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true,  distanceFilter: 20 },
)
      
        }.bind(this)) 
  var intA = setInterval(() => {
    this.freshSched()
  this.setState({ 
      timeStamp: Math.round((new Date()).getTime() / 1000),
        north: this.state.north,
        south: this.state.south
        })    
}, 30000)      
    }

// ----------------------------------------------------

componentWillUnmount() {
  clearInterval(this.intA);
  }
  handlePress(id, feed, name, coordinates, color, distance, route) {
     this.setState({
      id: id,
      feed: feed,
      name: name,
      coordinates: coordinates,
      color: color,
      distance: distance,
      route: route
    }, () => {
      this.getSchedule(this.state.id, this.state.feed)
    })
}

// ------------------------------------------------
  render() {
const { navigate } = this.props.navigation;
    var width = Dimensions.get('window').width;
    var height = Dimensions.get('window').height;     
    return  ( 

      <View style={{backgroundColor:'black'}}> 
      <TouchableOpacity
        onPress={() => navigate('Menu', {props: this.state})}
      >
        <Text style={{ textAlign: 'right', marginRight: 10, paddingTop: 10}}>
         <Ionicons name="ios-navigate-outline" style={{flex: 1, fontSize: 30, color: 'white', fontWeight: 'bold'}}></Ionicons>  
        </Text>  
         </TouchableOpacity>   
      <ScrollView 
      style={{height: 270,  marginBottom: 6}}
      pagingEnabled={true}>
      <FlatList 
      scrollEventThrottle={1}
        style={{marginTop: 6}}
        data={this.state.data} 
        renderItem={({item}) => 
          <TouchableOpacity 
            onPress={() => this.handlePress(item.properties.stop_id, item.properties.stop_feed, item.properties.stop_name, item.geometry.coordinates, item.properties.color, item.distance.dist, item.properties.stop_id[0])}      
            style={{ alignSelf: 'stretch', marginTop: 4, marginBottom: 4, paddingBottom: 5, backgroundColor: item.properties.color}}>
              <View style={{justifyContent: 'center', borderWidth: 0}} >
                <Text style={{fontSize: 20, paddingLeft: 5,fontWeight: 'bold', textAlign: "center", paddingTop: 2, paddingBottom: 2}} >{item.properties.stop_name}</Text>
              </View>
              <View style={{justifyContent: 'center'}} >
                <Text style={{fontSize: 18, paddingLeft: 5,fontWeight: 'bold', textAlign: "center", paddingTop: 2, paddingBottom: 2}} >{item.distance.dist.toFixed(3) + " miles"}</Text>
              </View>
          </TouchableOpacity>}
        keyExtractor={item => item.properties.stop_id}
      />
      </ScrollView>
      <View style={{height: 400, marginTop: 20}}>
      <Schedule stops={this.state.data} north={this.state.north} south={this.state.south} name={this.state.name}lat={this.state.uLatitude} lng={this.state.uLongitude} markers={this.state.markers} LatLng={this.state.coordinates} color={this.state.color} distance={this.state.distance} route={this.state.route}/>
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
    marginTop: 18,
    paddingBottom: 2
  },
  instructions: {
    color: 'white',
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
  },


});
export const frontend = StackNavigator({
  AppB: { 
    screen: AppB,
   },
   AppC: {
    screen: AppB,
   },
   Menu: {
    screen: Menu,
   }
});
AppRegistry.registerComponent('frontend', () => frontend);




