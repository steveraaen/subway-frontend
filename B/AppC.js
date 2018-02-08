/*bwgv-ekpr-tnpf-rbfj*/
import React, { Component } from 'react';
import {
  AppRegistry,
  AppState,
  Button,
  Dimensions,
  Platform,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  Text,
  View,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Rescale
    from './Rescale.js';
import { StackNavigator } from 'react-navigation';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin'
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from 'react-native-splash-screen';
import Swiper from 'react-native-swiper';
import lineColors from '../colors.js';
import Schedule from './Schedule.js';
import FadeInView from './Animations.js';
import ChooseLoc from './ChooseLoc.js';

  
class AppC extends Component {
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
      devicetype: Rescale.isTablet() ? 'tablet' : 'phone',
      boros: ["Brooklyn, NY", "Bronx, NY", "Queens, NY", "New York, NY", "Manhattan, NY", "Staten Island, NY"],
      inNYC: false,
   /*   placeName: 'Rockefeller',*/

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
    this.geocode = this.geocode.bind(this)
    this.revGeocode = this.revGeocode.bind(this)
    mixins: [TimerMixin]
    const dim = Dimensions.get('screen');
    
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
 } /*${this.state.latitude, this.state.longitude}40.758740,-73.978674*/
    revGeocode(lat, lng) {
      
    var lat= parseFloat(this.state.uLatitude).toFixed(6); 
      var lng= parseFloat(this.state.uLatitude).toFixed(6) ;
     return axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + parseFloat(this.state.uLatitude).toFixed(6) +',' + parseFloat(this.state.uLongitude).toFixed(6) + '&key=AIzaSyD0Zrt4a_yUyZEGZBxGULidgIWK05qYeqs', {

        }).then((doc) => {
          for(let i =0; i < this.state.boros.length; i++) {
            if(doc.data.results[0].formatted_address.includes(this.state.boros[i])) {
              this.setState({
                inNYC: true,
                curBoro: this.state.boros[i]
              })
            }            
          }
          this.setState({
            address:  doc.data.results[0].formatted_address
          })
        }).catch(function(error) {
       throw error
    }); 
  }

    

    geocode(place) {
     return axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + place + '&location=40.704745,-73.920052&radius=50000&key=AIzaSyD0Zrt4a_yUyZEGZBxGULidgIWK05qYeqs', {
        }).then((resp) => {
          this.setState({
            autoResp: resp
          })
          console.log(resp)
        }).catch(function(error) {
       throw error
    }); 
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
          this.getStops(this.state.longitude,this.state.latitude)
          this.revGeocode(this.state.uLatitude,this.state.uLongitude)
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
  componentWillUpdate() {

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

         if(this.state.inNYC === false) {
        var index= 1
      }
      else {
        var index= 0
      }
  
    

    StatusBar.setHidden('hidden': false)
    StatusBar.setBarStyle("dark-content")
  const { navigate } = this.props.navigation;

  if(this.state.orientation === 'portrait') {
    scrollSize = 240;
    hght = this.state.height;
    wdth = this.state.width;
    flx = "column";
    cmt = 24;
    cpt = 4;
    ttxt = 20;
    ta = "center";
    ml = 0;
    schmt = 0;
    scrmt = 12;
    spt = 0;

  } else if(this.state.orientation === 'landscape') {
    scrollSize = 240;
    schedSize = this.state.height;
    wdth = this.state.width * .5;
    hght = this.state.height;
    flx = "row";
    cmt = 24;
    cpt = 0;
    ttxt = 18;
    ta = "center";
    ml= 30;
    schmt = 26;
    scrmt = 12;
    spt= 32;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: this.state.width,
      flexDirection: flx,
      justifyContent: 'flex-start',
      marginTop: cmt,
      paddingTop: cpt,
      backgroundColor:'black',
    },
    title: {
      flex: .18,
      paddingTop: 5,
      paddingBottom: 5,
      justifyContent: 'center',
      backgroundColor:'#03003F',

    },
    titleText: {
      color: 'white',
      fontSize: 24,
      fontStyle: 'italic',
      fontWeight: 'bold',
      textAlign: ta,
      backgroundColor:'#03003F',
    },
    schedTitleTextNorth: {
      marginTop: schmt,
      color: '#00FDFF',
      fontSize: 18,
      fontStyle: 'italic',
      fontWeight: 'bold',
      backgroundColor:'#03003F',
      textAlign: 'center'
    },
    schedTitleTextSouth: {
      marginTop: schmt,
      color: 'pink',
      fontSize: 18,
      fontStyle: 'italic',
      fontWeight: 'bold',
      backgroundColor:'#03003F',
      textAlign: 'center'
    },
     chosenTitleText: {
      color: '#03003F',
      fontSize: 18,
      fontStyle: 'italic',
      fontWeight: 'bold',
      textAlign: ta,
    },
    scroll: {
      flex: .86,
      backgroundColor:'#03003F',

    },
    schedule: {
      flex: .9,
      backgroundColor:'#03003F',
      marginTop: 10,
      height: 300,
      paddingTop: spt,
      flexDirection: 'row',
      flexWrap: 'wrap'
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
      flex: .25,
      backgroundColor:'#03003F',
      borderBottomWidth: 1,
      borderBottomColor: 'gray',
    },  
    imageBar: {
      flexDirection: 'row',
      flexGrow: 1,
      justifyContent: 'space-around',
      alignItems: 'stretch',
      height: 44,
      backgroundColor: '#03003F',
      marginTop: cpt
  },  
    modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
    innerContainer: {
    alignItems: 'center',
    padding: 10
  },
    plainText: {
    paddingLeft:12,
    paddingRight:12,
    paddingTop: 6,
    color: 'white'
  },
    plainButton: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#00933C',
    width: 46,
    height: 30,
    borderRadius: 10,
  },
    autoPlaces: {
      flex: 1,
      flexDirection: 'column',
      flexGrow: 1,
    },
    map: {
    ...StyleSheet.absoluteFillObject,
  }
  });

    return  ( 
      <View style={styles.container}> 
     
          <Modal
              visible={this.state.modalVisible}
              animationType={'slide'}
              onRequestClose={() => this.closeModal()}
          >
          <View style={styles.imageBar}>
          <Image  source={require('../assets/d20x3.png')} />
          <Text style={{color: '#C0C0C0', paddingTop:12, fontSize: 24, fontWeight: 'bold', fontFamily: 'Bradley Hand'}}>Nearby Subways </Text>
          </View>

            <View style={styles.modalContainer}>
            <View style={styles.scroll}>
              <View style={styles.innerContainer}> 
                <Button
                    onPress={() => this.closeModal()}
                    title="Close"
                >
                </Button>             
                  <Text style={styles.timeText}>
                     Nearest Subways should work well for you in {this.state.curBoro}.
                  </Text>
                </View>
              <View >
                  <Text style={styles.plainText}>
                      This app tries to do one thing - navigate the New York City subway system from your current location.
                  </Text>
                  <Text style={styles.plainText}>
                       Scroll down on the top section to see more stations. Tap a station to view the schedule.
                       The lower half of the screen displays the departure times. It defaults to displaying southbound trains, but by swiping left
                       you will see the northbound schedule.  One further swipe left displays a map plotting your location and the location of the selected stop.
                   </Text>
            </View>
              </View>
            </View>
          </Modal>
         <View style={styles.scroll}>
         <View style={{height: 50}}>
         <Swiper
            loop={false}
            index={index}
            loadMinimal={true}
            showsPagination={false}
            style={{height: 44}}>
          <View style={styles.imageBar}>
          <Image  source={require('../assets/d20x3.png')} />
          <Text style={{color: '#C0C0C0', paddingTop:12, fontSize: 24, fontWeight: 'bold', fontFamily: 'Bradley Hand'}}>Nearby Subways </Text>
         <TouchableOpacity onPress={() => this.openModal()} >        
        <Text style={{paddingTop: 6}}>  <Icon name="ios-information-circle" size={20} color="white"/></Text>       
          </TouchableOpacity>
          </View>
             <View style={styles.imageBar}>
               <TextInput  
                  autoCorrect={false}
                  value={this.state.input}
                  style={{height: 30, borderColor: 'gray', borderWidth: 1, width: 220, backgroundColor: 'white'}}
                  onChangeText={(text) => this.setState({input: text}, (text) => {this.geocode(this.state.input)})}                 
                /> 
                <TouchableOpacity>
                  <View style={styles.plainButton}>
                    <Text style={{textAlign: 'center', color: 'black',fontSize:16, fontWeight: 'bold'}}>Find</Text>
                  </View>
                </TouchableOpacity>       
          </View>
        </Swiper>
     </View>
        <ScrollView 
        
        pagingEnabled={true}>
        <FlatList 
        scrollEventThrottle={1}       
          data={this.state.data} 
          renderItem={({item}) =>       
            <TouchableOpacity 
              style={styles.touchOp}
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
  AppC: { 
    screen: AppC,
   }
});
AppRegistry.registerComponent('frontend', () => frontend);