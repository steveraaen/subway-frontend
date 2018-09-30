/*bwgv-ekpr-tnpf-rbfj*/
import React, { Component } from 'react';
import {
  ActivityIndicator,
  AlertIos,
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
import Rescale from './Rescale.js';
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
/*import Busses from './Busses.js';*/

  
export default class AppC extends Component {
/*    static navigationOptions = {
      header: null,
     headerMode: 'screen',
     headerTitle: 'Real-Time Subways',
     headerStyle: { backgroundColor: 'gray', height: 50 },
     headerTitleStyle: {  color: 'white', fontSize:22, fontWeight: 'bold', fontStyle: 'italic'},

  };*/
  constructor(props) {
    super(props);
    this.state = {
      iconColor: "gray",
      loading: true,
      appState: AppState.currentState,
      uLnglat: null,
      lineColors: lineColors,
      modalVisible: false,
      orientation: Rescale.isPortrait() ? 'portrait' : 'landscape',
      devicetype: Rescale.isTablet() ? 'tablet' : 'phone',
      boros: ["Brooklyn", "Bronx", "Queens", "New York", "Manhattan", "Staten Island"],
     
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
    this.getPlaces = this.getPlaces.bind(this)
    this.revGeocode = this.revGeocode.bind(this)
    this.autoC = this.autoC.bind(this)
    this.handlePlacePress = this.handlePlacePress.bind(this)
    this.getDirections = this.getDirections.bind(this)
    this._handleAppStateChange = this._handleAppStateChange.bind(this)
/*    this.getTransfers = this.getTransfers.bind(this)*/
    this.mergeStopsTransfers = this.mergeStopsTransfers.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.checkIfInNYC = this.checkIfInNYC.bind(this)
/*    this.getBusses = this.getBusses.bind(this)*/
    mixins: [TimerMixin]
    const dim = Dimensions.get('screen');
    
  }
// ---------------------------------------------------------
  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!' + nextAppState)
      this.getStops()
    } 
    this.setState({appState: nextAppState});
  }
    openModal() {
      this.setState({modalVisible:true, input: null, autoResp: null});
       navigator.geolocation.clearWatch(this.watchID);
    }

    closeModal() {
      this.setState({modalVisible:false});
    }

     
/*    getBusses() {
      return axios.get('https://bustime.mta.info/api/where/stops-for-location.json?lat=40.6766600&lon=-73.9839440&latSpan=0.005&lonSpan=0.005&key=d780a773-f505-402c-b6cb-4a9939fbe07a')
        .then((response) => {
          if(response) {
          this.setState({
            busStops: response
          })
        } else {
          console.log('failed response to busses')
        }
        })  
    }*/
    getStops() {
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
       /*   console.log(response.data[i].distance.dist)*/

          var resObj = response.data[i].properties;         
          var stpLine = resObj.stop_id[0];
          if(response.data[i].distance.dist > .5) {
            response.data[i].distMeasurement = "miles";
            response.data[i].dist = parseFloat(response.data[i].distance.dist).toFixed(2);
          } else if(response.data[i].distance.dist < .5 && response.data[i].distance.dist > .2) {
              response.data[i].distMeasurement = "yards";
              response.data[i].dist = parseInt(response.data[i].distance.dist * 1760)           
          } else if(response.data[i].distance.dist < .2) {
              response.data[i].distMeasurement = "feet";
              response.data[i].dist = parseInt(response.data[i].distance.dist * 5280)          
          }
          for(let lne in this.state.lineColors) {
            if(this.state.lineColors[lne].routeArray.includes(stpLine)) {
              curColor = this.state.lineColors[lne].color
              resObj.color = curColor                    
            }
          }
          
          if(response.data[i].distance.dist < 1)
            var stopCount = i
            
        }
        this.setState({ stopCount: stopCount,
                        data: response.data,
                        length:response.data.length,
                        id: response.data[0].properties.stop_id,
                        feed: response.data[0].properties.stop_feed,
                        name: response.data[0].properties.stop_name,
                        color: response.data[0].properties.color,
                        coordinates: response.data[0].geometry.coordinates,
                        title: response.data[0].properties.stop_name,
                        distance: response.data[0].distance.dist,
                        route: response.data[0].properties.stop_id[0],
                       
                      }, function()  {
                        this.getSchedule(this.state.id, this.state.feed);                      
                      });
      })
      .catch(err => console.log(err));
} 
// -----------------------------------------------------
getSchedule(id, line) { 
  console.log(this.state.feed)
  console.log(this.state.id)

    return axios.get('https://subs-backend.herokuapp.com/api/train/', { 
    /*return axios.get('http://127.0.0.1:5000/api/train/', {*/ 
      params: {
        id: this.state.id,
        feed: this.state.feed
        }
    }).then((responseData) => { 
      if(responseData) {
    this.setState({
      loading: false,
      schedule: responseData.data.schedule
      }, () => {
        console.log(responseData.data.schedule)
        this.freshSched(this.state.schedule)
      })       
     } }).catch(function(error) { 
      this.setState({
        noDataMessage: `Schedule for ${this.state.name} is not currently avalable`
      })
        console.log('problem with getSchedule')
  throw error;
    });   
  }
 freshSched() {
  console.log(this.state.schedule)
if(this.state.schedule) {
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
  console.log(cleanNorth)
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
  console.log(this.state.north)
} else {
  this.setState({
    north: null,
    south: null
  })
   console.log(this.state.north)
}
  clearInterval(this.intA);
 }  
 getDirections() {
  return axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=place_id:ChIJyev6ia1bwokRXgmtESUdllI&destination=place_id:ChIJIYJS7qxZwokRNj43jDKKNCc&key=AIzaSyD0Zrt4a_yUyZEGZBxGULidgIWK05qYeqs', {

  }).then((docs) => {
    console.log(docs)
    this.setState({
      directions: docs
    })
  })
 }
    revGeocode(lat, lng) {      
    var lat= parseFloat(this.state.uLatitude).toFixed(6); 
      var lng= parseFloat(this.state.uLatitude).toFixed(6) ;
     return axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + parseFloat(this.state.uLatitude).toFixed(6) +',' + parseFloat(this.state.uLongitude).toFixed(6) + '&key=AIzaSyD0Zrt4a_yUyZEGZBxGULidgIWK05qYeqs', {
        }).then((doc) => {
          for(let i =0; i < this.state.boros.length; i++) {
            if(doc.data.results[0].formatted_address.includes(this.state.boros[i])) {
              this.closeModal()
              console.log(doc.data.results[0].formatted_address)
              this.setState({
                inNYC: true,
               /* modalVisible: false,*/
                curBoro: this.state.boros[i],
                curPlaceId: doc.data.results[0].place_id
              })
            }  
              navigator.geolocation.clearWatch(this.watchID);
                    
          }
          this.setState({
            address:  doc.data.results[0].formatted_address.split(",")[0] + ", " + doc.data.results[0].formatted_address.split(",")[1],
            latitude: doc.data.results[0].geometry.location[1],
            longitude: doc.data.results[0].geometry.location[0],
            placeName: doc.data.results[0]
          })
        }).catch(function(error) {
       throw error
    }); 

  }
    getPlaces(place) {
     return axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + place + '&radius=50000&minLength=2&administrative_area_level_1=NewYork&key=AIzaSyD0Zrt4a_yUyZEGZBxGULidgIWK05qYeqs', {
        }).then((resp) => {
          this.setState({
            autoResp: resp.data.predictions
          })
          console.log(resp)
        }).catch(function(error) {
       throw error
    }); 
  }
/*  getTransfers(route) {
    return axios.get('http://127.0.0.1:5000/api/xfer/', { 
    return axios.get('https://subs-backend.herokuapp.com/api/xfer/', { 

      params: {
        route: this.state.route,
        
        }
    }).then((resp) => {

      this.setState({
        transfers: resp
      }, () => {
        this.mergeStopsTransfers(this.state.transfers)
      })
    })
  }*/
  mergeStopsTransfers(tfrs) {
   
      console.log(tfrs)
    
  }
  checkIfInNYC() {
    if(this.state.inNYC) {
    console.log('In NY')
      this.closeModal()
    }
    else {
      console.log('Not In NY')
      this.openModal()
    }
  }
// ----------------------------------------------------
    componentWillMount() { 
this.setState({loading: true})
        navigator.geolocation.getCurrentPosition(function(pos) {
            var { longitude, latitude, accuracy, heading } = pos.coords
            this.setState({
                uLongitude: pos.coords.longitude,
                uLatitude: pos.coords.latitude,
                uLnglat: [pos.coords.longitude, pos.coords.latitude],
                uPosition: pos.coords,
                deviceLng: pos.coords.longitude,
                deviceLat: pos.coords.latitude,
                loading: false
            })
      this.watchId = navigator.geolocation.watchPosition(
      (position) => {
            this.setState({
                uLatitude: position.coords.latitude,
                uLongitude: position.coords.longitude,
                uPosition: position.coords,
                deviceLng: pos.coords.longitude,
                deviceLat: pos.coords.latitude,
         error: null,
        }, () => {
          this.revGeocode(this.state.uLatitude,this.state.uLongitude)
          this.getStops(this.state.longitude,this.state.latitude)          
        });      
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true,  distanceFilter: 50 },
)      
        }.bind(this)) 
  var intA = setInterval(() => {
    this.freshSched()
    this.setState({ 
      timeStamp: Math.round((new Date()).getTime() / 1000),
        north: this.state.north,
        south: this.state.south,

        })    
      }, 15000)                
    } 
    handlePlacePress(id) {      
      return axios.get('https://maps.googleapis.com/maps/api/place/details/json?placeid='+id+'&key=AIzaSyD0Zrt4a_yUyZEGZBxGULidgIWK05qYeqs', {
    /*  return axios.get('https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&key=AIzaSyD0Zrt4a_yUyZEGZBxGULidgIWK05qYeqs', {*/
      }).then((respon) => {
        this.setState({
          details: respon,
          uLatitude: respon.data.result.geometry.location.lat,
          uLongitude: respon.data.result.geometry.location.lng,
          address: respon.data.result.formatted_address.split(",")[0] + ", " + respon.data.result.formatted_address.split(",")[1],
          uPlaceId: respon.data.result.place_id,
          iconColor: 'white',
          modalVisible: false

        }, () => {
          this.getStops()
        })
      })
      this.getDirections()
      clearInterval(this.intA);
    }
  autoC(inp) {
    if(this.state.autoResp) {
    return (
      <View>
        <FlatList 
          scrollEventThrottle={1}       
          data={inp} 
          renderItem={({item}) =>       
            <TouchableOpacity 
              style={{height: 30}}
              onPress={() => this.handlePlacePress(item.place_id)}      
              >
                <View style={{ height: 40}} >
                   <Text numberOfLines={1}style={{fontSize: 16,fontWeight: 'bold', color: 'white'}} >{item.description.split(",")[0] + "," + item.description.split(",")[1] +  "," + item.description.split(",")[2]  }</Text>
                </View>
            </TouchableOpacity>}
          keyExtractor={item => item.id}
        />
          <View style={{marginTop: 20}}> 
            <Text style={{color: 'yellow', textAlign: 'center', fontSize: 14, fontWeight: 'bold', paddingTop: 8}}>Tap on a place to see the nearest subway stations and next trains.</Text>
          </View>
        </View>
      )
    }
  }

// ----------------------------------------------------
  componentDidMount() {
        this.setState({
            orientation: Rescale.isPortrait() ? 'portrait' : 'landscape',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
        });
    AppState.addEventListener('change', this._handleAppStateChange);  

  }

componentWillUnmount() {
  clearInterval(this.intA);
navigator.geolocation.clearWatch(this.watchID);
  Dimensions.removeEventListener("change", this.handler);
  AppState.removeEventListener('change', this._handleAppStateChange);
  }
  handlePress(id, feed, name, coordinates, color, distance, route, transfers) {

     this.setState({
      id: id,
      feed: feed,
      name: name,
      coordinates: coordinates,
      color: color,
      distance: distance,
      route: route,

    }, () => {
      this.getSchedule(this.state.id)
    /*  this.getTransfers(this.state.route)*/
    })
}
// ------------------------------------------------
  render() {

/*  const { navigate } = this.props.navigation;*/

  if(this.state.orientation === 'portrait') {
    hght = this.state.height;
    wdth = this.state.width;
    flx = "column";
    revflx= "row";
    cpt = 6;
    ttxt = 20;
    ta = "center";
    schmt = 0;
    schflx = 1.28;
    scrflx = 1.15
    iconLeft= 30;
  } else if(this.state.orientation === 'landscape') {

    flx = "row";
    revflx= "column";
    cpt = 6;
    ttxt = 18;
    ta = "center";
    schmt = 40;
    schflx = 1.6;
    scrflx = 1.2;
    iconLeft= 0;
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: this.state.width,
      height: this.state.height,
      flexDirection: flx,
      justifyContent: 'flex-start',
    /*  marginTop: cmt,*/
      paddingTop: cpt,
      backgroundColor:'#03003F',
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
      color: '#C0C0C0',
      fontSize: 18,
      fontStyle: 'italic',
      fontWeight: 'bold',
      backgroundColor:'#03003F',
      textAlign: 'left',
      paddingLeft: 14
    },
    schedTitleTextSouth: {
      marginTop: schmt,
      color: '#C0C0C0',
      fontSize: 18,
      fontStyle: 'italic',
      fontWeight: 'bold',
      backgroundColor:'#03003F',
      textAlign: 'right',
      paddingRight: 14
    },
     chosenTitleText: {
      color: '#03003F',
      fontSize: 18,
      fontStyle: 'italic',
      fontWeight: 'bold',
      textAlign: ta,
    },
    scroll: {
      flex: scrflx,
     /* paddingTop: 6,*/
      backgroundColor:'#03003F',
      marginTop:10,
      marginBottom:1
    },
    modalForm: {
      flex: 1,
      backgroundColor:'#03003F',
    },
    schedule: {
      flex: schflx,
      backgroundColor:'#03003F',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    stopsText: {

      fontSize:  16,
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
      flex: .32,
      marginLeft: 0,
      marginRight: 30,
      borderBottomWidth: 1
    },  
    imageBar: {
      flex: .14,
      flexDirection: revflx,
      justifyContent: 'space-between',
      backgroundColor: '#03003F',
      paddingTop: 20,
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
      color: 'yellow',
      fontSize:16,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingBottom: 6,
      color: 'white',
      backgroundColor: '#03003F'
  },
    autoPlaces: {
      flexGrow: .3,
      width: this.state.width,
      marginTop:14,
      marginLeft: 14,
    },
    mapContainer: {
      flex: 1,
      justifyContent: 'center',
      
  },
  iconLeft: {
    alignItems: 'flex-end', 
    marginTop:8, 
    marginLeft: iconLeft
  },
    map: {
    ...StyleSheet.absoluteFillObject,
  }
  });
  if(this.state.data) {
    return  ( 
      <View style={styles.container}>   
            <View>
         <StatusBar barStyle="light-content" hidden ={false} style={{marginTop: 44}}/>
      </View>
          <Modal              
              transparent={false}
              supportedOrientations={['portrait', 'landscape']}
              visible={this.state.modalVisible}
              animationType={'fade'}
            
          >
          <View style={styles.imageBar}>
              <TouchableOpacity
                onPress={() => this.closeModal()}
              >
                <Text style={{paddingTop: 14}}><Icon name="ios-arrow-down" size={24} color="white"/></Text>  
                  
              </TouchableOpacity>
          </View>
            <View style={styles.modalContainer}>
            <View style={styles.modalForm}>
          <View style={{marginTop: 12, marginBottom: 18}} >  
                 <Text style={styles.timeText}>
                     Enter the name of a place, or an address in New York City.
                  </Text>        
             <View style={{alignItems: 'center', marginTop: 12}}>
               <TextInput  
                  placeHolder="Madison Square Garden "
                  autoCorrect={false}
                  value={this.state.input}
                  style={{height: 30, paddingLeft: 20, borderColor: 'gray', borderWidth: 1, width: 220, backgroundColor: 'white'}}          
                  onChangeText={(text) => this.setState({input: text}, (text) => {this.getPlaces(this.state.input)})}                 
                />                                   
            </View>
            <View style={styles.autoPlaces}>{this.autoC(this.state.autoResp)}
           </View>
            </View>
       

              </View>
            </View>
          </Modal>   
        
          <View style={styles.imageBar}>  
              <View style={styles.iconLeft}>   
                <TouchableOpacity onPress={() => this.setState({uLongitude: this.state.deviceLng, uLatitude: this.state.deviceLat, iconColor: "gray"}, () => {this.getStops(this.state.uLongitude, this.state.uLatitude)})} >        
                  <Text style={{paddingTop: 1}}>  <Icon name="ios-navigate-outline" size={28} color={this.state.iconColor}/></Text>                             
                </TouchableOpacity>
              </View>           
              <View style={{alignItems: 'flex-start', marginTop:8, marginRight: 30}}>   
                <TouchableOpacity onPress={() => this.openModal()} >        
                  <Text style={{paddingTop: 1}}>  <Icon name="ios-search" size={28} color="white"/></Text>                             
                </TouchableOpacity>
              </View> 
          </View>
          <View style={styles.scroll}>
          <View style={{alignItems: 'center'}}><Text numberOfLines={1} style={{fontSize: 14, color: 'white'}}>{this.state.address}</Text></View>
           <View style={{ marginBottom: 14, marginTop: 6, alignItems: 'center'}}><Text style={{ fontSize: 20, fontWeight:'bold', fontFamily:'ChalkboardSE-Bold', color: 'white'}}>{this.state.stopCount}<Text style={{color: 'coral',fontSize: 22, fontFamily: 'BradleyHandITCTT-Bold', fontWeight: 'bold'}}>  Nearby Subways</Text></Text>
            
           </View>
           <View style={{backgroundColor: '#34A5DA', height: 2, marginLeft: 30, marginRight: 30}}></View>
        
        <ScrollView       
        pagingEnabled={true}>
        <FlatList 
          scrollToIndex={0}
          scrollEventThrottle={1}       
          data={this.state.data} 
          renderItem={({item}) =>       
            <TouchableOpacity 
              style={{flex: .32,marginLeft: 30,marginRight: 30, borderBottomWidth: 1,borderBottomColor: item.properties.color}} 
              onPress={() => this.handlePress(item.properties.stop_id, item.properties.stop_feed, item.properties.stop_name, item.geometry.coordinates, item.properties.color, item.distance.dist, item.properties.stop_id[0], item.transfers)}      
              >
                <View style={styles.title} >
                  <Text allowFontScaling={true} style={styles.stopsText}><Text style={{color: item.properties.color}}>{item.properties.stop_name}</Text></Text>
                 <Text allowFontScaling={true} style={styles.timeText} >{item.dist}<Text style={{fontSize: 18}}>  {item.distMeasurement}</Text></Text>
                </View>
            </TouchableOpacity>}
          keyExtractor={item => item.properties.stop_id}
        />
        </ScrollView>
        </View>
        <View style={{backgroundColor: '#34A5DA', height: 2, marginBottom: 10, marginLeft: 30, marginRight: 30}}></View>
        <View style={styles.schedule}>
        <Schedule styles={styles} stops={this.state.data} north={this.state.north} south={this.state.south} name={this.state.name}lat={this.state.uLatitude} lng={this.state.uLongitude} markers={this.state.markers} LatLng={this.state.coordinates} color={this.state.color} distance={this.state.distance} route={this.state.route} orientation={this.state.orientation} height={this.state.height} width={this.state.width} ploc={this.state.address}/>
      </View>
    </View> 
    )} else { 
  return ( 
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Image 
        source={require('../assets/nearbyScreenShot.png')}
        style={{height: this.state.height, width: this.state.width}}
        />
     
      
      
    </View>)}
   
  }
}

/*export const nearby = StackNavigator({
  AppC: { 
    screen: AppC,
   }
});
AppRegistry.registerComponent('nearby', () => nearby);*/




