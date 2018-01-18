import React, { Component } from 'react';
import {
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
import lineColors from'../helpers.js';

export default class Schedule extends Component {
constructor(props) {
	super(props);

	/*this.freshSched = this.freshSched.bind(this)
	this.getSubways = this.getSubways.bind(this)
	mixins: [TimerMixin]  */
}
componentWillReceiveProps(nextProps) {
	if(this.props.stops) {
		console.log(this.props)
/*		this.setState({
			id: this.nextProps.stops[0].properties.stop_id,
			feed:this.nextProps.stops[0].properties.stop_feed		
	})*/
	}
}

render() {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height; 

    const styles = StyleSheet.create({
  container: {
    flex: 1,  
    flexDirection: 'column',
    height: 200,
    backgroundColor: '#5B5B5B',
    paddingTop: 2,
    paddingBottom: 2,
    marginBottom: 2
  },
  north: {
  	fontSize: 16,
  	color: 'white',
  	fontWeight: 'bold',
  	textAlign: 'center'
  },
  train: {
  	backgroundColor: 'black', 
  	paddingTop: 2,
  	marginTop: 2
  },
  debug: {
  	height: 15,
  	backgroundColor: 'black',
  	marginTop: 20
  }

});
/*if(this.props.sched)*/
if(this.props.north) {
	return ( 

		<Swiper>
					<View style={styles.container} >
				<Text style={styles.north}>Southbound Trains</Text>	
				<FlatList
					style={{marginTop: 2, paddingTop: 2, }}
					header={"Northbound Trains"}
					data={this.props.south}		 
					renderItem={({item}) => 
					<View style={styles.train}>
							<View style= {{ flex: 1, justifyContent: 'center', marginTop: 4}}>
								<Text style= {{textAlign: 'center', fontSize: 14,  fontWeight: 'bold', color: 'black',marginLeft: 3, marginRight: 3, backgroundColor: item.color }}> {item.routeId}</Text>
							</View>

							<View style={{flex: 1, marginTop:8, paddingBottom: 2, marginBottom: 2,justifyContent: 'center'}}>
								<Text style= {{textAlign: 'center', fontSize: 14, color: 'white', fontWeight: 'bold'}}> {moment.unix(item.departureTime).format("HH:mm") + "                   "  +  Math.round(((moment.unix(item.departureTime) / 1000) - Math.round((new Date()).getTime() / 1000)) / 60) + " minutes"}</Text>
							</View>
						</View>}
					 keyExtractor={item => item.departureTime}
				/>			 
			</View>
			<View style={styles.container} >
			<Text style={styles.north}>Northbound Trains</Text>	
			
				<FlatList
					style={{marginTop: 2, paddingTop: 2, }}
					header={"Northbound Trains"}
					data={this.props.north}		 
					renderItem={({item}) => 
					<View style={styles.train}>
							<View style= {{ flex: 1, justifyContent: 'center', marginTop: 4}}>
								<Text style= {{textAlign: 'center', fontSize: 16,  fontWeight: 'bold', color: 'black',marginLeft: 3, marginRight: 3, backgroundColor: item.color }}> {item.routeId}</Text>
							</View>
							<View style={{flex: 1, marginTop:8, paddingBottom: 2, marginBottom: 2,justifyContent: 'center'}}>
								<Text style= {{textAlign: 'center', fontSize: 14, color: 'white', fontWeight: 'bold'}}> {moment.unix(item.departureTime).format("HH:mm") + "                   "  +  Math.round(((moment.unix(item.departureTime) / 1000) - Math.round((new Date()).getTime() / 1000)) / 60) + " minutes"}</Text>
							</View>
						</View>}
					 keyExtractor={item => item.departureTime}
				/>			 
			</View>	
		</Swiper>
	
		)
		} else return (
			<View><Text>Waiting</Text></View>
			)	
}
	}

reactMixin(Schedule.prototype, TimerMixin);







