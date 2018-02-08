/*bwgv-ekpr-tnpf-rbfj*/
import React, { Component } from 'react';
import {
  AppRegistry,
  AppState,
  Dimensions,
  Platform,
  StyleSheet,
  FlatList,
  Text,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import Rescale
    from './Rescale.js';
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
      modalVisible: false,
      orientation: Rescale.isPortrait() ? 'portrait' : 'landscape',
      devicetype: Rescale.isTablet() ? 'tablet' : 'phone'
    }
    Dimensions.addEventListener('change', () => {
        this.setState({
            orientation: Rescale.isPortrait() ? 'portrait' : 'landscape',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
        });
    });
    this.getStops = this.getStops.bind(this)
    this.getSchedule = this.getSchedule.bind(this)
    this.freshSched = this.freshSched.bind(this)
    mixins: [TimerMixin]
    console.log(this.state.appState)
    const dim = Dimensions.get('screen');
    console.log(dim)
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
                        color: response.data[0].properties.color,
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
  Dimensions.removeEventListener("change", this.handler);
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
    StatusBar.setHidden('hidden': false)
    StatusBar.setBarStyle("dark-content")
  const { navigate } = this.props.navigation;

  console.log(this.state.orientation)
  console.log(this.state.width)
  console.log(this.state.height)
  

  if(this.state.orientation === 'portrait') {

    hght = this.state.height;
    wdth = this.state.width;
    flx = "column";
    cmt = 0;
    cpt = 18;
    ttxt = 20;
    ta = "center";
    ml = 0;
    schmt = 12;
    scrmt = 12;
 

  } else if(this.state.orientation === 'landscape') {
    scrollSize = 240;
    schedSize = this.state.height;
    wdth = this.state.width * .5;
    hght = this.state.height;
    flx = "row";
    cmt = 0;
    cpt = 18;
    ttxt = 18;
    ta = "center";
    ml= 30;
    schmt = 48;
    scrmt = 12;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: this.state.width,
      flexDirection: flx,
      justifyContent: 'flex-start',
      marginTop: cmt,
      paddingTop: cpt,
      /*backgroundColor:'#222222',*/
    },
    title: {
      flex: .12,
      marginTop: 10,
      marginBottom: 10,
      backgroundColor:'#03003F',
     /* paddingLeft: ml*/
    },
    titleText: {
      color: 'white',
      fontSize: 24,
      fontStyle: 'italic',
      fontWeight: 'bold',
      textAlign: ta,
      backgroundColor:'#03003F',
    },
    schedTitleText: {
      marginTop: schmt,
      color: 'pink',
      fontSize: 18,
      fontStyle: 'italic',
      fontWeight: 'bold',
      textAlign: ta,
      backgroundColor:'#03003F',
    },
     chosenTitleText: {
      color: '#03003F',
      fontSize: 18,
      fontStyle: 'italic',
      fontWeight: 'bold',
      textAlign: ta,
    },
    scroll: {
      flex: .5,
      paddingBottom: 12,
      backgroundColor:'#03003F',
    },
    schedule: {
      flex: .5,
      backgroundColor:'#03003F',
    },
    stopsText: {
      fontSize:  20,
      fontWeight: 'bold',
      textAlign: "center",
      backgroundColor:'#03003F',
    },
    timeText: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'white',
      textAlign: "center",
      backgroundColor:'#03003F',
      marginBottom: 2
    },
    touchOp: {
     backgroundColor:'#03003F',
     borderBottomWidth: 1,
     borderBottomColor: 'gray',
    },
    map: {
    ...StyleSheet.absoluteFillObject,
  }
  });

    return  ( 
      <View style={styles.container}> 
        <StatusBar></StatusBar>
         <View style={styles.scroll}>
          <View style={styles.title}>
          <Text style={styles.titleText}>Nearest Subways</Text>
          </View>
     
        <ScrollView 
        
        pagingEnabled={true}>
        <FlatList 
        scrollEventThrottle={1}       
          data={this.state.data} 
          renderItem={({item}) =>       
            <TouchableOpacity 
              /*style={styles.touchOp}*/
              onPress={() => this.handlePress(item.properties.stop_id, item.properties.stop_feed, item.properties.stop_name, item.geometry.coordinates, item.properties.color, item.distance.dist, item.properties.stop_id[0])}      
              >
                <View style={styles.title} >
                  <Text style={styles.stopsText}><Text style={{color: item.properties.color}}>{item.properties.stop_name}</Text></Text>
                 <Text style={styles.timeText} >{item.distance.dist.toFixed(2) + " miles"}</Text>
                </View>
            </TouchableOpacity>}
          keyExtractor={item => item.properties.stop_id}
        />
        </ScrollView>
        </View>
        <View style={styles.schedule}>
        <Schedule styles={styles} stops={this.state.data} north={this.state.north} south={this.state.south} name={this.state.name}lat={this.state.uLatitude} lng={this.state.uLongitude} markers={this.state.markers} LatLng={this.state.coordinates} color={this.state.color} distance={this.state.distance} route={this.state.route} orientation={this.state.orientation} height={this.state.height} width={this.state.width}/>
      </View>
    </View>
 
    )
    console.log(item)
  }
}

export const frontend = StackNavigator({
  AppB: { 
    screen: AppB,
   },
   MainMap: {
    screen: MainMap,
   }
});
AppRegistry.registerComponent('frontend', () => frontend);