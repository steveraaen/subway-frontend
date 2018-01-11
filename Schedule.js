import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions, 
  Button,
  FlatList
} from 'react-native';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin'
import Swiper from 'react-native-swiper';
import moment from'moment';
import lineColors from'./helpers.js';


export default class Schedule extends Component {

constructor(props) {
	props.getSubways()	
	super(props);
	this.state = {
		loading: false,
		timeStamp: Math.round((new Date()).getTime() / 1000)		
	}
	this.freshStops = this.freshStops.bind(this)
}
 freshStops() {
 		var curColor;	
	var schedObj = this.props.sched;
	console.log(this.props)
	for(let trn in schedObj) {

		var north = schedObj[trn].N.slice(0, 4)
		var south = schedObj[trn].S.slice(0, 4)
	}
	for(let n in north) {
		var nId = north[n].routeId		
		for(let lc in lineColors){
			if(lineColors[lc].routeArray.includes(nId)) {				
				north[n].color = lineColors[lc].color
			}
		}
		north[n].timeStamp = Math.round((new Date()).getTime() / 1000)
		north[n].timeDif = north[n].departureTime - north[n].timeStamp
	}

	/*this.setState({north: north})	*/
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
	this.setState({ 
				north: north,
				south: south
				})
 }

componentWillReceiveProps(){
	this.freshStops()

	}
 componentDidMount() {

 	this.props.getSubways()
 	this.setInterval(() => {
 		this.freshStops()
	this.setState({ 
			timeStamp: Math.round((new Date()).getTime() / 1000),
				north: this.state.north,
				south: this.state.south
				}) 		
}, 10000)
 	
 }
render() {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height; 

    const styles = StyleSheet.create({
  container: {
    flex: 1,  
    flexDirection: 'column',
    backgroundColor: '#5B5B5B',
    paddingTop: 2,
    paddingBottom: 2,
    marginTop:10,
    marginBottom: 2
  },
  north: {
  	fontSize: 12,
  	color: 'white',
  	fontWeight: 'bold',
  	textAlign: 'center'
  },
  train: {
  	backgroundColor: 'black', 
  	paddingTop: 2,
  	marginTop: 2
  }

});

console.log(this.props.sched)
/*if(this.props.sched)*/
	return ( 
		<Swiper>
			<View style={styles.container} >
				<Text style={styles.north}>Northbound Trains (Swipe for Southbound)</Text>	
				<FlatList
					style={{marginTop: 2, paddingTop: 2, }}
					header={"Northbound Trains"}
					data={this.state.north}		 
					renderItem={({item}) => 
					<View style={styles.train}>

							<View style= {{ flex: 1, justifyContent: 'center', marginTop: 4}}>
								<Text style= {{textAlign: 'center', fontSize: 12,  fontWeight: 'bold', color: 'black',marginLeft: 3, marginRight: 3, backgroundColor: item.color }}> {item.routeId}</Text>
							</View>

							<View style={{flex: 1, marginTop:8, paddingBottom: 2, marginBottom: 2,justifyContent: 'center'}}>
								<Text style= {{textAlign: 'center', fontSize: 12, color: 'white', fontWeight: 'bold'}}> {moment.unix(item.departureTime).format("HH:mm") + "                   "  +  Math.round(((moment.unix(item.departureTime) / 1000) - this.state.timeStamp) / 60) + " minutes"}</Text>
							</View>
						</View>}
					 keyExtractor={item => item.departureTime}
				/>			 
			</View>	
			<View style={styles.container} >
				<Text style={styles.north}>Southbound Trains (Swipe for Northbound)</Text>	
				<FlatList
					style={{marginTop: 2, paddingTop: 2, }}
					header={"Northbound Trains"}
					data={this.state.south}		 
					renderItem={({item}) => 
					<View style={styles.train}>

							<View style= {{ flex: 1, justifyContent: 'center', marginTop: 4}}>
								<Text style= {{textAlign: 'center', fontSize: 12,  fontWeight: 'bold', color: 'black',marginLeft: 3, marginRight: 3, backgroundColor: item.color }}> {item.routeId}</Text>
							</View>

							<View style={{flex: 1, marginTop:8, paddingBottom: 2, marginBottom: 2,justifyContent: 'center'}}>
								<Text style= {{textAlign: 'center', fontSize: 12, color: 'white', fontWeight: 'bold'}}> {moment.unix(item.departureTime).format("HH:mm") + "                   "  +  Math.round(((moment.unix(item.departureTime) / 1000) - this.state.timeStamp) / 60) + " minutes"}</Text>
							</View>
						</View>}
					 keyExtractor={item => item.departureTime}
				/>			 
			</View>	
	
		</Swiper>
		)	
	}
}
reactMixin(Schedule.prototype, TimerMixin);







