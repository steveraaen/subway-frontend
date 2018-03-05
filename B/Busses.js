import React, { Component } from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  Platform,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  Text,
  View,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity }
  	from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';/*
http://bustime.mta.info/api/where/agencies-with-coverage.xml?key=d780a773-f505-402c-b6cb-4a9939fbe07a
 http://bustime.mta.info/api/where/routes-for-agency/MTA%20NYCT.json?key=d780a773-f505-402c-b6cb-4a9939fbe07a
 http://bustime.mta.info/api/where/stops-for-location.json?lat=40.748433&lon=-73.985656&latSpan=0.005&lonSpan=0.005&key=d780a773-f505-402c-b6cb-4a9939fbe07a
 http://bustime.mta.info/api/where/stop/MTA_STOP-ID.xml?key=d780a773-f505-402c-b6cb-4a9939fbe07a
 http://bustime.mta.info/api/siri/stop-monitoring.json?key=d780a773-f505-402c-b6cb-4a9939fbe07a&OperatorRef=MTA&MonitoringRef=308209&LineRef=MTA%20NYCT_B63
*/export default class Busses extends Component{
	constructor(props) {
		super(props);
		this.state = {
			latLng: []
		}
}
     render() {
     	return (
     			<View><Text>.</Text></View>
     		)
     }
}





















