import React, { Component } from 'react';
import {
WebView,
View,
Text,
StyleSheet
} from 'react-native';

export default class Status extends Component {
	constructor(props) {
		super(props)
/*		this.state={
			data: this.props.navigation.state.params.status.data.subway
		}*/
	}
	componentDidMount() {
		
	}
	  render() {
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
  }
})
    return (
			<View >		
					<View style={styles.container}>
						<Text style= {styles.north}> Latitude : {this.props.navigation.state.params.position.longitude} </Text>
					</View>	
					<View style={styles.container}>
						<Text style= {styles.north}> Longitude : {this.props.navigation.state.params.position.latitude}</Text>
					</View>	
					<View style={styles.container}>
						<Text style= {styles.north}> Heading : {this.props.navigation.state.params.position.heading} </Text>
					</View>	
					<View style={styles.container}>
						<Text style= {styles.north}> Timestamp : </Text>
					</View>			
			</View>
    );
  }
}