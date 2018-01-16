import React, { Component } from 'react';
import {
WebView,
View,
Text
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
    return (
    	<View>
    		<Text>Hello</Text>
    	</View>
    );
  }
}