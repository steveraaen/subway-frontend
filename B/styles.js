import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: this.state.width,
      flexDirection: flx,
      justifyContent: 'flex-start',
      marginTop: cmt,
      paddingTop: cpt,
      backgroundColor:'black',
    },
    title: {
      flex: .18,
      paddingTop: 5,
      paddingBottom: 5,
      justifyContent: 'center',
      backgroundColor:'#03003F',

    },
    titleText: {
      color: 'white',
      fontSize: 24,
      fontStyle: 'italic',
      fontWeight: 'bold',
      textAlign: ta,
      backgroundColor:'#03003F',
    },
    schedTitleTextNorth: {
      marginTop: schmt,
      color: '#00FDFF',
      fontSize: 18,
      fontStyle: 'italic',
      fontWeight: 'bold',
      backgroundColor:'#03003F',
      textAlign: 'center'
    },
    schedTitleTextSouth: {
      marginTop: schmt,
      color: 'pink',
      fontSize: 18,
      fontStyle: 'italic',
      fontWeight: 'bold',
      backgroundColor:'#03003F',
      textAlign: 'center'
    },
     chosenTitleText: {
      color: '#03003F',
      fontSize: 18,
      fontStyle: 'italic',
      fontWeight: 'bold',
      textAlign: ta,
    },
    scroll: {
      flex: 1,
      backgroundColor:'#03003F',

    },
    schedule: {
      flex: 1,
      backgroundColor:'#03003F',
      marginTop: 10,
      height: 300,
      paddingTop: spt,
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    stopsText: {
      fontSize:  20,
      fontWeight: 'bold',
      textAlign: "center",
      backgroundColor:'#03003F',
    },
    timeText: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'white',
      textAlign: "center",
      backgroundColor:'#03003F',
      marginBottom: 2
    },
    touchOp: {
      flex: .25,
      backgroundColor:'#03003F',
      borderBottomWidth: 1,
      borderBottomColor: 'gray',
    },  
    imageBar: {
      flexDirection: 'row',
      flexGrow: 1,
      justifyContent: 'space-around',
      alignItems: 'stretch',
      height: 44,
      backgroundColor: '#03003F',
      marginTop: cpt
  },  
    modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
    innerContainer: {
    alignItems: 'center',
    padding: 10
  },
    plainText: {
    paddingLeft:12,
    paddingRight:12,
    paddingTop: 6,
    color: 'white'
  },
    plainButton: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#00933C',
    width: 46,
    height: 30,
    borderRadius: 10,
  },
    autoPlaces: {
      flex: 1,
      flexDirection: 'column',
      flexGrow: 1,
    },
      mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    map: {
    ...StyleSheet.absoluteFillObject,
  }
  });
  export default styles