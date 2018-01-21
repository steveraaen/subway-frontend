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
import lineColors from'../helpers.js';
import FadeInView from'./AppC.js';

export default class Schedule extends Component {
constructor(props) {
	super(props);
	this.state={
		fadeAnim: new Animated.Value(0),
	}
}
componentWillUpdate() {
	if(this.props.stops && this.props.north && this.props.south) {
	
}
}
componentWillReceiveProps() {
/*console.log(this.props)*/
}
render() {



    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height; 

    function time(t) {
    	if(time < 30) {
    		color: 'yellow'
    	} else {
    		color: ''
    	}
    }

    const styles = StyleSheet.create({
  container: {
    flex: 1,  
    flexDirection: 'column',
    height: 240,
    backgroundColor: 'black',
    paddingTop: 2,
    paddingBottom: 2,
    marginBottom: 2
  },
  north: {
  	fontSize: 16,
  	color: 'white',
  	fontWeight: 'bold',
  	textAlign: 'center',
  	paddingBottom: 6
  },
  south: {
  	fontSize: 16,
  	color: 'white',
  	fontWeight: 'bold',
  	textAlign: 'left',
  },
  train: {
  	backgroundColor: 'black', 
  	paddingTop: 2,
  	marginTop: 2,

  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
/*if(this.props.sched)*/
if(this.props.north) {
	return ( 

		<Swiper>
					<View style={styles.container} >
				<Text style={styles.north}>{this.props.name}   -    South</Text>	
				<FlatList
					style={{marginTop: 2, paddingTop: 2, }}
					header={"Northbound Trains"}
					data={this.props.south}		 
					renderItem={({item}) => 
					<FadeInView>
							<View style= {{ flex: 1, justifyContent: 'center', marginTop: 4}}>
								<Text style= {{textAlign: 'center', fontSize: 18,  fontWeight: 'bold', color: 'black',marginLeft: 3, marginRight: 3, backgroundColor: item.color }}> {item.routeId}</Text>
							</View>

							<View style={{flex: 1, marginTop:8, paddingBottom: 2, marginBottom: 2,justifyContent: 'center'}}>
								<Text style= {{textAlign: 'center', fontSize: 14, color: 'white', fontWeight: 'bold'}}> {moment.unix(item.departureTime).format("HH:mm") + "                   "  +  Math.round(((moment.unix(item.departureTime) / 1000) - Math.round((new Date()).getTime() / 1000)) / 60) + " minutes"}</Text>
							</View>
						</FadeInView>}
					 keyExtractor={item => item.departureTime}
				/>			 
			</View>
			<View style={styles.container} >
			<Text style={styles.north}>North    -    {this.props.name}</Text>	
			
				<FlatList
					style={{marginTop: 2, paddingTop: 2, }}
					header={"Northbound Trains"}
					data={this.props.north}		 
					renderItem={({item}) => 
					<FadeInView>
							<View style= {{ flex: 1, justifyContent: 'center', marginTop: 4}}>
								<Text style= {{textAlign: 'center', fontSize: 18,  fontWeight: 'bold', color: 'black',marginLeft: 3, marginRight: 3, backgroundColor: item.color }}> {item.routeId}</Text>
							</View>
							<View style={{flex: 1, marginTop:8, paddingBottom: 2, marginBottom: 2,justifyContent: 'center'}}>
								<Text style= {{textAlign: 'center', fontSize: 14, color: 'white', fontWeight: 'bold'}}> {moment.unix(item.departureTime).format("HH:mm") + "                   "  +  Math.round(((moment.unix(item.departureTime) / 1000) - Math.round((new Date()).getTime() / 1000)) / 60) + " minutes"}</Text>
							</View>
						</FadeInView>}
					 keyExtractor={item => item.departureTime}
				/>			 
			</View>	
{/*			      <MapView
			      style={styles.map}
				    initialRegion={{
				      latitude: this.props.lat,
				      longitude: this.props.lng,
				      latitudeDelta: 0.0322,
				      longitudeDelta: 0.0121,
    }}
  />*/}
		</Swiper>
	
		)
		} else return (
			<View><Text>Waiting</Text></View>
			)	
		}
	}
reactMixin(Schedule.prototype, TimerMixin);







