import React, { Component } from 'react';
import {
	StyleSheet,
  Text,
  View,
  Dimensions, 
  Button,
  FlatList,
  Picker,
  ScrollView,
  TouchableOpacity
} from 'react-native';

export default class ChooseLoc extends Component {
		render() {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height; 
			return (
         <View >
         <ScrollView style={{height: 40, width: width, backgroundColor: 'white'}} >
            <Picker
            index= {0} >
               <Picker.Item label = "Steve" value = "steve" style={{color: 'black'}} />
               <Picker.Item label = "Ellen" value = "ellen" />
               <Picker.Item label = "Maria" value = "maria" />
            </Picker>
         </ScrollView>  
         </View>
         )
      }
}