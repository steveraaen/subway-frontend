
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import moment from 'moment';
import axios from 'axios';
import lineColors from'../helpers.js';
import Schedule from'./Schedule.js';
export default class StopsCont extends Component {

	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			lineColors: lineColors,
			loading: true,
			id: this.props.stops[0].properties.stop_id,
			feed:this.props.stops[0].properties.stop_feed
			}
			this.getSubways = this.getSubways.bind(this);
			this.handlePress = this.handlePress.bind(this)			
		}

	 getSubways(id, line) {    
/*return axios.get('http://127.0.0.1:5000/api/train/', { */
    return axios.get('https://subs-backend.herokuapp.com/api/train/', { 
    	params: {
	    	id: this.state.id,
	    	feed: this.state.feed
	    	}
    }).then((responseData) => {	
		this.setState({
			loading: false,
			schedule: responseData.data.schedule
			})  		 
      }).catch(function(error) {
      	console.log('problem with getSubways')
  throw error;
});
	}
	handlePress(id, feed) {
		 this.setState({
			id: id,
			feed: feed,

		},((i, f) => { 
	this.getSubways(id, feed)		
		})
		)
}
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }
	render() {
    var width = Dimensions.get('window').width;
    var height = Dimensions.get('window').height; 		
		return  (			
			<View style={{marginRight: 20, marginLeft: 20, }}>
			<ScrollView style={{height: 190}}>
			<FlatList	
			  style={{marginTop: 10}}
			  data={this.props.stops} 
			  renderItem={({item}) => 
				  <TouchableOpacity 
					  onPress={() => this.handlePress(item.properties.stop_id, item.properties.stop_feed, item.properties.stop_name)}  		 
					  style={{ height: 40, alignSelf: 'stretch', marginTop: 4,  paddingBottom: 5, backgroundColor: item.properties.color}}>
						  <View style={{justifyContent: 'center', borderWidth: 0}} >
						  	<Text style={{fontSize: 14, paddingLeft: 5,fontWeight: 'bold', textAlign: "center"}} >{item.properties.stop_name}</Text>
						  </View>
						  <View style={{justifyContent: 'center'}} >
						  	<Text style={{fontSize: 12, paddingLeft: 5,fontWeight: 'bold', textAlign: "center"}} >{item.distance.dist.toFixed(2) + " miles"}</Text>
						  </View>
				  </TouchableOpacity>}
			  keyExtractor={item => item.properties.stop_id}
			/>
			</ScrollView>
			<Schedule  sched={this.state.schedule} stops={this.props.stops}   position={this.props.position} getSubways={this.getSubways}/>
		</View>
		
		)
		console.log(item)
	}
}