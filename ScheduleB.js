import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList
} from 'react-native';
import lineColors from'./helpers.js';
import moment from'moment';
export default class Schedule extends Component {

constructor(props) {
	super(props);
	this.state = {
		loading: false
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
    width: width,
    justifyContent: 'space-between',
    backgroundColor: '#5B5B5B',
    marginTop: 10,
  },
});

console.log(this.props.sched)
if(this.props.sched)
	var nData = this.props.nTrains
    
	return 	<View >	
				<FlatList
					style={{marginTop: 4, paddingTop: 5, }}
					
					data={this.state.south}		 
					renderItem={({item}) => 
					<View style={{ backgroundColor: 'black', width: width, alignSelf: 'stretch', marginTop: 4,}}>

							<View style= {{ flex: 1, justifyContent: 'center', borderRadius: 36/2, width: 36, height: 36, backgroundColor: item.color, marginTop: 20}}>
								<Text style= {{textAlign: 'center', fontSize: 16,  color: 'black',marginLeft: 3, marginRight: 3, }}> {item.routeId}</Text>
							</View>

							<View style={{flex: 1, marginTop:8, justifyContent: 'center'}}>
								<Text style= {{textAlign: 'center', fontSize: 16, color: 'white', marginBottom: 20}}> {moment.unix(item.arrivalTime).format("HH:mm")}</Text>
							</View>
						</View>}
					 keyExtractor={item => item.arrivalTime}
				/>
				<GeoWatch navigation={this.props.navigation} />	
			</View>		
	}
}







