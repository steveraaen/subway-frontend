
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
import moment from 'moment';
import axios from 'axios';
import lineColors from'../helpers.js';
import Schedule from'./Schedule.js';
export default class StopsCont extends Component {

	constructor(props) {
		super(props)
		this.state = {
			lineColors: lineColors,
			id: this.props.stops[0].properties.stop_id,
			feed:this.props.stops[0].properties.stop_feed
			}
			this.handlePress = this.handlePress.bind(this)			
					
		}
/*	 getSubways(id, line) { 
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
		
	}*/

	handlePress(id, feed) {
		 this.setState({
			id: id,
			feed: feed,
		})
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
						  	<Text style={{fontSize: 12, paddingLeft: 5,fontWeight: 'bold', textAlign: "center"}} >{item.distance.dist.toFixed(4) + " miles"}</Text>
						  </View>
				  </TouchableOpacity>}
			  keyExtractor={item => item.properties.stop_id}
			/>
			</ScrollView>
			<Schedule  stops={this.props.stops} id={this.state.id} feed={this.state.feed}/>
		</View>
		
		)
		console.log(item)
	}
}