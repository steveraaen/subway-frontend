import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class StopsCont extends Component {
	constructor(props) {
		super(props) 
	}

	render() {
		if(this.props.stops) {

		return (
		<View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
			<View style={{width: '30%', height: '12%', marginBottom: 10, marginRight: 2, paddingTop: 10, backgroundColor: this.props.stops[0].properties.color }} >
				<Text style={{fontSize: 18, fontWeight: 'bold', textAlign: "center", marginBottom: 8}} >{this.props.stops[0].properties.stop_name}</Text>
				<Text style={{fontSize: 12, fontWeight: 'bold', textAlign: "center", paddingBottom: 8}} >{this.props.stops[0].distance.dist.toFixed(2) + " Miles Away"}</Text>
			</View>
			<View style={{width: '30%', height: '12%', marginBottom: 10, marginRight: 2, paddingTop: 10,  backgroundColor: this.props.stops[1].properties.color}} >
				<Text style={{fontSize: 18, fontWeight: 'bold', textAlign: "center", marginBottom: 8}} >{this.props.stops[1].properties.stop_name}</Text>
				<Text style={{fontSize: 12, fontWeight: 'bold', textAlign: "center", paddingBottom: 8}} >{this.props.stops[1].distance.dist.toFixed(2) + " Miles Away"}</Text>
			</View>
			<View style={{width: '30%', height: '12%', marginBottom: 10, paddingTop: 10,  backgroundColor: this.props.stops[2].properties.color}} >
				<Text style={{fontSize: 18, fontWeight: 'bold', textAlign: "center", marginBottom: 8}} >{this.props.stops[2].properties.stop_name}</Text>
				<Text style={{fontSize: 12, fontWeight: 'bold', textAlign: "center", paddingBottom: 8}} >{this.props.stops[2].distance.dist.toFixed(2) + " Miles Away"}</Text>	
			</View>
		</View>
			)

	} else {
		return <View><Text>Blag</Text></View>
	}
}
}