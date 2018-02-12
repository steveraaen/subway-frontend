import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions, 
  Button,
  FlatList,
  TouchableOpacity
} from 'react-native';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin'
import Swiper from 'react-native-swiper';
import axios from 'axios';
import moment from'moment';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import lineColors from'../colors.js';
import FadeInView from'./Animations.js';
import nice from '../niceMap.js';
export default class Schedule extends Component {
constructor(props) {
	super(props);
	this.state={
		fadeAnim: new Animated.Value(0),
	}
}
componentWillUpdate() {
}
componentWillReceiveProps() {
	if(this.props.LatLng) {
	 const latlng = {
	 	latitude: this.props.LatLng[1],
	 	longitude: this.props.LatLng[0]
	 }
	 this.setState({
	 	coordinate: latlng,
	 	userLocation: {
	 		latitude: this.props.lat,
	 		longitude: this.props.lng
	 	}
	 })
}
}
render() {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height; 

if(this.props.north || this.props.south) {
	return ( 
		<Swiper
		loop={false}
		
		>
		<View style={this.props.styles.mapContainer}>
		<View style={{marginBottom: 16}}><Text style={this.props.styles.schedTitleTextNorth}>Northbound</Text></View>
		<Text style={this.props.styles.chosenTitleText}><Text style={{color: this.props.color}}>{this.props.name}</Text></Text>	
			<FlatList
				style={{height:380, marginTop: 8}}
				header={"Northbound Trains"}
				data={this.props.north}
				renderItem={({item}) => 
					<FadeInView>
						<View style= {{flex: 1, flexDirection: 'row', alignContent: 'space-around', marginTop: 8, marginLeft: 34}}>
							<View style={{flex: .2}}><Text style= {{ fontSize: 22,  fontWeight: 'bold', color: item.color, textAlign: 'center'}}>{item.routeId}</Text></View>	
							<View style={{flex: .3}}><Text style={{ fontSize: 16, color: '#A7A9AC', fontWeight: 'bold'}}>{moment.unix(item.departureTime).format("HH:mm")}</Text></View>
							<View style={{flex: .1}}><Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold'}}>{Math.round(((moment.unix(item.departureTime) / 1000) - Math.round((new Date()).getTime() / 1000)) / 60)}</Text></View>
							<View style={{flex: .3}}><Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold'}}>minutes</Text></View>
						</View>
					</FadeInView>}
				 keyExtractor={item => item.departureTime}
			/>			 
			</View>
		<View style={this.props.styles.mapContainer}>
		<View style={{marginBottom: 16}}><Text style={this.props.styles.schedTitleTextSouth}>Southbound</Text></View>
		<Text style={this.props.styles.chosenTitleText}><Text style={{color: this.props.color}}>{this.props.name}</Text></Text>	
			<FlatList
				style={{height:380, marginTop: 8}}
				header={"Southbound Trains"}
				data={this.props.south}
				renderItem={({item}) => 
					<FadeInView>
						<View style= {{flex: 1, flexDirection: 'row', alignContent: 'space-around', marginTop: 8, marginLeft: 34}}>
							<View style={{flex: .2}}><Text style= {{ fontSize: 22,  fontWeight: 'bold', color: item.color, textAlign: 'center'}}>{item.routeId}</Text></View>	
							<View style={{flex: .3}}><Text style={{ fontSize: 16, color: '#A7A9AC', fontWeight: 'bold'}}>{moment.unix(item.departureTime).format("HH:mm")}</Text></View>
							<View style={{flex: .1}}><Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold'}}>{Math.round(((moment.unix(item.departureTime) / 1000) - Math.round((new Date()).getTime() / 1000)) / 60)}</Text></View>
							<View style={{flex: .3}}><Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold'}}>minutes</Text></View>
						</View>
					</FadeInView>}
				 keyExtractor={item => item.departureTime}
			/>			 
			</View>



<View style={this.props.styles.mapContainer}>	
      <MapView
      scrollEnabled={false}  
      	zoomEnabled={false}   
      	rotateEnabled={false}   
      	scrollEnabled={false}   
      	pitchEnabled={false}   
      	style={this.props.styles.map}
      	customMapStyle={nice}
			showsUserLocation={true}
			followsUserLocation={true}
			provider={PROVIDER_GOOGLE}
	   	region={{
	      latitude: this.props.lat,
	      longitude: this.props.lng,
	      latitudeDelta: 0.03,
	      longitudeDelta: 0.03,
    }}>
    <MapView.Marker
    pinColor={this.props.color}
      coordinate={this.state.coordinate}
      title={this.props.route} 
      description={this.props.name}
    />

  </MapView>
 </View>
		</Swiper>
	
		)
		} else return (
			<View style={{justifyContent: 'center', paddingLeft: 30}}><Text style={{color: "#FF6319", fontSize: 20, textAlign: 'center'}}>Waiting for data from the MTA</Text></View>
			)	
		}
	}
reactMixin(Schedule.prototype, TimerMixin);






