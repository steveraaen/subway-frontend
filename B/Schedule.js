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
import MapView from 'react-native-maps';
import lineColors from'../colors.js';
import FadeInView from'./Animations.js';

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
	 console.log(latlng)
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
    console.log(this.props.orientation)

if(this.props.north || this.props.south) {
	return ( 
		<Swiper
		loop={false}
		index={0}
		>
		<View >
		<Text style={this.props.styles.schedTitleTextSouth}>Southbound</Text>
		<Text style={this.props.styles.chosenTitleText}><Text style={{color: this.props.color}}>{this.props.name}</Text></Text>	
			<FlatList
				style={{height:380, marginTop: 10}}
				header={"Northbound Trains"}
				data={this.props.south}		 
				renderItem={({item}) => 
					<FadeInView>
						<View style= {{ justifyContent: 'center', marginTop: 12, alignSelf: 'center'}}>
							<Text style= {{ fontSize: 22,  fontWeight: 'bold', color: item.color}}><Text>{item.routeId}			</Text>
							<Text style= {{ fontSize: 16, color: 'white', fontWeight: 'bold'}}>			{moment.unix(item.departureTime).format("HH:mm")}<Text>			{Math.round(((moment.unix(item.departureTime) / 1000) - Math.round((new Date()).getTime() / 1000)) / 60)}<Text>			minutes</Text></Text></Text></Text>
						</View>
					</FadeInView>}
				 keyExtractor={item => item.departureTime}
			/>			 
			</View>
		<View >
		<Text style={this.props.styles.schedTitleTextNorth}>Northbound</Text>
		<Text style={this.props.styles.chosenTitleText}><Text style={{color: this.props.color}}>{this.props.name}</Text></Text>	
			<FlatList
				style={{height:380, marginTop: 10}}
				header={"Northbound Trains"}
				data={this.props.north}		 
				renderItem={({item}) => 
					<FadeInView>
						<View style= {{ justifyContent: 'center', marginTop: 12, alignSelf: 'center'}}>
							<Text style= {{ fontSize: 22,  fontWeight: 'bold', color: item.color}}><Text>{item.routeId}			</Text>
							<Text style= {{ fontSize: 16, color: 'white', fontWeight: 'bold'}}>			{moment.unix(item.departureTime).format("HH:mm")}<Text>			{Math.round(((moment.unix(item.departureTime) / 1000) - Math.round((new Date()).getTime() / 1000)) / 60)}<Text>			minutes</Text></Text></Text></Text>
						</View>
					</FadeInView>}
				 keyExtractor={item => item.departureTime}
			/>			 
			</View>


<View style={this.props.styles.map}>	
      <MapView
      	style={this.props.styles.map}
      	zoomEnabled={true}
			rotateEnabled={false}
			scrollEnabled={false}
			showsUserLocation={true}
			followsUserLocation={true}
			fitToElements={true}
			mapType={"hybrid"}
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
			<View><Text>Waiting</Text></View>
			)	
		}
	}
reactMixin(Schedule.prototype, TimerMixin);






