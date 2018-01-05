import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native';
export default class StopsContC extends Component {
	constructor(props) {
		super(props) 
		this.handlePress = this.handlePress.bind(this)
	}

	handlePress(e) {
		
		this.setState({})
		console.log(e)
		e.preventDefault()
	}

	render() {

    var width = Dimensions.get('window').width;
    var height = Dimensions.get('window').height; 
		if(this.props.stops) {
		return (
		<View style={{flex: 1, flexDirection: 'column', marginTop: 20, marginBottom: 20}}>
			<TouchableOpacity idx={1} onPress={this.handlePress.bind(this)} data-feed={this.props.stops[0].properties.stop_feed} data-feed={this.props.stops[0].properties.stop_id}style={{width: width, alignSelf: 'stretch', height: '8%', justifyContent: 'center', marginBottom: 6, backgroundColor: this.props.stops[0].properties.color }}>
				<View>
					<Text style={{fontSize: 18, fontWeight: 'bold', textAlign: "center",}} >{this.props.stops[0].properties.stop_name + " is " + this.props.stops[0].distance.dist.toFixed(2) + " Miles Away"}</Text>				
				</View>
			</TouchableOpacity>
			<TouchableOpacity idx={2}  onPress={this.handlePress} data-feed={this.props.stops[1].properties.stop_feed} data-feed={this.props.stops[1].properties.stop_id}style={{width: width, alignSelf: 'stretch', height: '8%', justifyContent: 'center', marginBottom: 6,   backgroundColor: this.props.stops[1].properties.color}}>
				<View  >
					<Text style={{fontSize: 18, fontWeight: 'bold', textAlign: "center"}} >{this.props.stops[1].properties.stop_name + " is " + this.props.stops[1].distance.dist.toFixed(2) + " Miles Away"}</Text>
				</View>
			</TouchableOpacity>	
			<TouchableOpacity idx={3} onPress={this.handlePress} data-feed={this.props.stops[2].properties.stop_feed} data-feed={this.props.stops[2].properties.stop_id}style={{width: width, alignSelf: 'stretch', height: '8%', justifyContent: 'center', marginBottom: 6,   backgroundColor: this.props.stops[2].properties.color}}>
				<View >
					<Text style={{fontSize: 18, fontWeight: 'bold', textAlign: "center"}} >{this.props.stops[2].properties.stop_name + " is " + this.props.stops[2].distance.dist.toFixed(2) + " Miles Away"}</Text>
				</View>
			</TouchableOpacity>	
			<TouchableOpacity  idx={4} onPress={this.handlePress} data-feed={this.props.stops[3].properties.stop_feed} data-feed={this.props.stops[3].properties.stop_id} style={{width: width, alignSelf: 'stretch', height: '8%', justifyContent: 'center', marginBottom: 6,   backgroundColor: this.props.stops[3].properties.color}}>
				<View  >
					<Text style={{fontSize: 18, fontWeight: 'bold', textAlign: "center"}} >{this.props.stops[3].properties.stop_name + " is " + this.props.stops[3].distance.dist.toFixed(2) + " Miles Away"}</Text>
				</View>
			</TouchableOpacity>
			<TouchableOpacity idx={5} onPress={this.handlePress} data-feed={this.props.stops[4].properties.stop_feed} data-feed={this.props.stops[4].properties.stop_id} style={{width: width, alignSelf: 'stretch', height: '8%', justifyContent: 'center', marginBottom: 6,   backgroundColor: this.props.stops[4].properties.color}}>	
				<View  >
					<Text style={{fontSize: 18, fontWeight: 'bold', textAlign: "center"}} >{this.props.stops[4].properties.stop_name + " is " + this.props.stops[4].distance.dist.toFixed(2) + " Miles Away"}</Text>
				</View>
			</TouchableOpacity>
		</View>
			)
	} else {
		return <View><Text>There seems to be a problem getting data</Text></View>
	}
	}
}

