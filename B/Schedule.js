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
import moment from'moment';
import lineColors from'../helpers.js';

export default class Schedule extends Component {
constructor(props) {
	super(props);
	this.props.getSubways()	
	this.state = {
		loading: false,
		timeStamp: Math.round((new Date()).getTime() / 1000)
			
	}
	this.freshSched = this.freshSched.bind(this)
	mixins: [TimerMixin]
   
}
 freshSched() {
	var schedObj = this.props.sched;
	console.log(this.props)
	for(let trn in schedObj) {
	var north = schedObj[trn].N
	var south = schedObj[trn].S

	function clean(arr) {
	return arr.timeDif > 0
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
		var cleanNorth = north.filter(clean).slice(0, 4)
	

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
	var cleanSouth = south.filter(clean).slice(0, 4)
	}
	this.setState({ 
				north: cleanNorth,
				south: cleanSouth
				})
 }

componentWillReceiveProps(){
	this.freshSched()

	}
 componentDidMount() {

 	this.props.getSubways().catch((error)=>{
     console.log("Api call error");
     alert(error.message);
  });
 	var intA = this.setInterval(() => {
 		this.freshSched()
		
}, 30000) 	
 }
  	componentWillUnmount() {
	clearInterval(this.intA);
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
  },
  debug: {
  	height: 15,
  	backgroundColor: 'black',
  	marginTop: 20
  }

});

console.log(this.props.sched)
/*if(this.props.sched)*/
	return ( 
	<View>
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
	</View>

		)	
	}
}
reactMixin(Schedule.prototype, TimerMixin);







