import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions, 
  Picker,
  FlatList
} from 'react-native';
import lineColors from'./helpers.js';
import moment from'moment';
export default class Schedule extends Component {

constructor(props) {
	super(props);
	this.state = {
		loading: false,
		timeStamp: Math.round((new Date()).getTime() / 1000),
	}
}
componentWillReceiveProps(){
	var curColor;	
	var schedObj = this.props.sched;

	for(let trn in schedObj) {
		var north = schedObj[trn].N.slice(0, 4)
		var south = schedObj[trn].S.slice(0, 4)
	}
	for(let n in north) {
		var nId = north[n].routeId		
		for(let lc in lineColors){
			if(lineColors[lc].routeArray.includes(nId)) {
				console.log(lineColors[lc].color)
				north[n].color = lineColors[lc].color
			}
		}
	}	
	this.setState({north: north})	
	for(let s in south) {
		var sId = south[s].routeId		
		for(let lc in lineColors){
			if(lineColors[lc].routeArray.includes(sId)) {
				console.log(lineColors[lc].color)
				south[s].color = lineColors[lc].color
			}
		}
	}
	this.setState({south: south})
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
  },
});

console.log(this.props.sched)
/*if(this.props.sched)*/
	return 	<View style={styles.container} >
				<Text>Hello</Text>	
				<FlatList
					style={{marginTop: 2, paddingTop: 2, }}
					header={"Northbound Trains"}
					data={this.state.south}		 
					renderItem={({item}) => 
					<View style={{ backgroundColor: 'black',  marginTop: 4, height: 46}}>

							<View style= {{ flex: 1, justifyContent: 'center', marginTop: 4}}>
								<Text style= {{textAlign: 'center', fontSize: 16,  fontWeight: 'bold', marginBottom: 16, marginTop: 16, color: 'black',marginLeft: 3, marginRight: 3, backgroundColor: item.color }}> {item.routeId}</Text>
							</View>

							<View style={{flex: 1, marginTop:8, justifyContent: 'center'}}>
								<Text style= {{textAlign: 'center', fontSize: 16, color: 'white', fontWeight: 'bold', marginBottom: 16, marginTop: 16}}> {moment.unix(item.arrivalTime).format("HH:mm") + "                   "  +  Math.round(((moment.unix(item.arrivalTime) / 1000) - this.state.timeStamp) / 60) + " minutes"}</Text>
							</View>
						</View>}
					 keyExtractor={item => item.arrivalTime}
				/>
			
			</View>		
	}
}







