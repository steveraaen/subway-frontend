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
import lineColors from'./helpers.js';
import Schedule from'./Schedule.js';
export default class StopsContB extends Component {

	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			lineColors: lineColors,
			loading: true,
			id: this.props.stops[0].properties.stop_id,
			feed:this.props.stops[0].properties.stop_feed,
			timeStamp: Math.round((new Date()).getTime() / 1000),
			}
			this.getSubways = this.getSubways.bind(this);
			this.handlePress = this.handlePress.bind(this)
			
		}
	

	getSubways(id, line) {    
    var northTrains = [];
    var southTrains = [];
    return axios.get('https://subs-backend.herokuapp.com/api/train', { 
    	params: {
	    	id: this.state.id,
	    	feed: this.state.feed
	    	}
    })
      .then((responseData) => {
      	
		this.setState({
			loading: false,
			schedule: responseData.data.schedule,
		})     
      })
	}
	handlePress(id, feed, item) {
		console.log(item)
		this.setState({
			id: id,
			feed: feed
		}, function(id, feed) {
			this.getSubways(this.state.id, this.state.feed)
		})
		
		/*this.props.navigation.navigate('Schedule')*/
	}

	render() {
    var width = Dimensions.get('window').width;
    var height = Dimensions.get('window').height; 
		
		return  (
			
			<View style={{marginRight: width * .05, marginLeft: width * .05, }}>
			<ScrollView style={{height: height * .4}}>
			<FlatList	
			  style={{marginTop: 10}}
			  data={this.props.stops} 
			  renderItem={({item}) => 
				  <TouchableOpacity 
					  onPress={() => this.handlePress(item.properties.stop_id, item.properties.stop_feed)}  		 
					  style={{width: width, height: height * .07, alignSelf: 'stretch', marginTop: 4,  paddingBottom: 5, backgroundColor: item.properties.color }}>
						  <View style={{justifyContent: 'center'}} >
						  	<Text style={{fontSize: 14, paddingLeft: 5,fontWeight: 'bold', textAlign: "center"}} >{item.properties.stop_name}</Text>
						  </View>
						  <View style={{justifyContent: 'center'}} >
						  	<Text style={{fontSize: 12, paddingLeft: 5,fontWeight: 'bold', textAlign: "center"}} >{item.distance.dist.toFixed(2) + " miles"}</Text>
						  </View>
				  </TouchableOpacity>}
			  keyExtractor={item => item.properties.stop_id}
			/>
			</ScrollView>
			<Schedule timeStamp={this.state.timeStamp} sched={this.state.schedule} stops={this.props.stops} nTrains={this.state.nTrains} sTrains={this.state.sTrains} getSubways={this.getSubways}/>
		</View>
		
		)
		console.log(item)
	}
}