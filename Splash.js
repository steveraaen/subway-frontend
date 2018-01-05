
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';


export default class Splash extends Component {
	constructor(props) {
		super(props);
		this.state = ({
			loading: true
		})
	}
	render() {

	return	<View>
			<Text>Splash</Text>
		</View>
	}
}