import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import moment from 'moment';
import lineColors from'./helpers.js';
import Schedule from'./Schedule.js';
export default class StopsContB extends Component {

	constructor(props) {
		super(props)
		this.state = {
			lineColors: lineColors,
			loading: true
			/*ts: Math.round((new Date()).getTime() / 1000)*/
		}
this.getSubways = this.getSubways.bind(this);
this.handlePress = this.handlePress.bind(this)
	}
	getSubways() {
	console.log(this.props)
    var trainURL= 'https://subs-backend.herokuapp.com/api/train'; 
    var northTrains = [];
    var southTrains = [];
    fetch(trainURL)
      .then(response => response.json())
      .then((responseData) => {
        var curColor;
        for(let stp in responseData.schedule) {
        	var northSched = responseData.schedule[stp].N;
        	var southSched = responseData.schedule[stp].S;
        
        for(let i = 0; i < northSched.length; i++) {
        	northTrains.push(moment.unix(northSched[i].arrivalTime).format("HH:mm"))
        	}
        for(let i = 0; i < southSched.length; i++) {
        	southTrains.push(southSched[i].arrivalTime)
        	}
        }
		this.setState({
			loading: false,
			schedule: responseData.schedule,
			nTrains: northTrains,
			sTrains: southTrains,

		})     
      })
	}
	componentWillMount() {
		this.getSubways()
	}
	handlePress() {
		console.log("Pressed");
		this.getSubways()
		/*this.props.navigation.navigate('Schedule')*/
	}

	render() {
    var width = Dimensions.get('window').width;
    var height = Dimensions.get('window').height; 

		console.log(this.props)
		return  <View style={{marginRight: width * .03, marginLeft: width * .03, }}>
			<FlatList	
			  style={{marginTop: 20}}
			  data={this.props.stops} 
			  renderItem={({item}) => 
			  <TouchableOpacity 
			  onPress={this.handlePress.bind(item)}  		 
			  style={{width: width, alignSelf: 'stretch', marginTop: 4, paddingTop: 5, paddingBottom: 5, backgroundColor: item.properties.color }}>
				  <View style={{justifyContent: 'center'}} >
				  	<Text style={{fontSize: 18, paddingLeft: 5,fontWeight: 'bold', textAlign: "center"}} >{item.properties.stop_name}</Text>
				  </View>
				  <View style={{justifyContent: 'center'}} >
				  	<Text style={{fontSize: 16, paddingLeft: 5,fontWeight: 'bold', textAlign: "center"}} >{item.distance.dist.toFixed(2) + " miles"}</Text>
				  </View>
				  </TouchableOpacity>}
			  keyExtractor={item => item.properties.stop_id}
			/>
			<Schedule sched={this.state.schedule} stops={this.props.stops} nTrains={this.state.nTrains} sTrains={this.state.sTrains}/>
		</View>

		console.log(item)
	}













}