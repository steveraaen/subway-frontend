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
import SplashScreen from 'react-native-splash-screen';
import lineColors from '../colors.js';
import Schedule from './Schedule.js';
import FadeInView from './Animations.js';
import MainMap from './MainMap.js';

class AppB extends Component {
    static navigationOptions = {
      header: null,
     headerMode: 'screen',
     headerTitle: 'Real-Time Subways',
     headerStyle: { backgroundColor: 'gray', height: 50 },
     headerTitleStyle: {  color: 'white', fontSize:22, fontWeight: 'bold', fontStyle: 'italic'},

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
    mixins: [TimerMixin]
    console.log(this.state.appState)
  }
// ---------------------------------------------------------

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
  componentDidMount() {
       SplashScreen.hide();
  }
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

      <View style={{backgroundColor:'black', height: height}}> 
      <View style={{height: 24, marginBottom: 6, backgroundColor: 'gray'}}></View>
       <View style={{flex: 1, flexDirection: 'row', marginTop:14, marginBottom:40, alignItems: 'stretch'}}>
       <View style={{marginBottom:20}}> 
            <Text style={{ marginLeft: 10, marginBottom: 16, textAlign: 'center',  color: 'white', fontSize: 24, color: 'white', fontWeight: 'bold'}}> RealTime Subways</Text>
        </View>
        <View style={{flex: 1, width:40}}>
          <TouchableOpacity onPress={() => navigate('MainMap', {props: this.state.data})}> 
             <Text style={{ marginRight: 10, textAlign: 'right'}}>
               <Ionicons name="ios-navigate-outline" style={{fontSize: 30, color: 'white', fontWeight: 'bold'}}></Ionicons>  
            </Text>       
        </TouchableOpacity> 
        </View>

        </View> 
        <View style={{height: 224}}>
      <ScrollView 
      
      pagingEnabled={true}>
      <FlatList 
      scrollEventThrottle={1}
        style={{marginTop: 6}}
        data={this.state.data} 
        renderItem={({item}) => 
          <TouchableOpacity 
            onPress={() => this.handlePress(item.properties.stop_id, item.properties.stop_feed, item.properties.stop_name, item.geometry.coordinates, item.properties.color, item.distance.dist, item.properties.stop_id[0])}      
            style={{ height: 46, alignSelf: 'stretch', marginTop: 4, marginBottom: 4, paddingBottom: 5, backgroundColor: item.properties.color}}>
              <View style={{justifyContent: 'center', borderWidth: 0}} >
                <Text style={{fontSize: 18, paddingLeft: 5,fontWeight: 'bold', textAlign: "center", paddingTop: 2, paddingBottom: 2}} >{item.properties.stop_name}</Text>
              </View>
              <View style={{justifyContent: 'center'}} >
                <Text style={{fontSize: 16, paddingLeft: 5,fontWeight: 'bold', textAlign: "center", paddingTop: 2, paddingBottom: 2}} >{item.distance.dist.toFixed(2) + " miles"}</Text>
              </View>
          </TouchableOpacity>}
        keyExtractor={item => item.properties.stop_id}
      />
      </ScrollView>
      </View>
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
   MainMap: {
    screen: MainMap,
   }
});
AppRegistry.registerComponent('frontend', () => frontend);