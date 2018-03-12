/**

NEWEST FILE

 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from "react";
import { AppRegistry, Platform, StyleSheet, Text, View } from "react-native";

import { Root } from "native-base";

import { StackNavigator } from "react-navigation";
import HomeScreen from "./src/home";
import BarcodeScanner from "./src/BarcodeScannerNEW";
import WelcomeScreen from "./src/screens/WelcomeScreenNEW";
import UserSelection from "./src/screens/UserSelectionNEW";
import IssueUpdate from "./src/screens/driver/IssueUpdate";
import LocationUpdate from "./src/screens/driver/LocationUpdate";
import PictureUpload from "./src/screens/driver/PictureUpload";
import ArbitrationUpdate from "./src/screens/sales/ArbitrationUpdate";
import ConversionsMain from "./src/screens/conversions/ConversionsMain";
import ConversionsForm from "./src/screens/conversions/ConversionsForm";
import VehicleInfo from "./src/screens/VehicleInfo";
import GoogleLogin from "./src/screens/GoogleLogin";
import UserAdministration from "./src/screens/UserAdministrationNEW";
import OneUser from "./src/screens/OneUser";
import Map from "./src/screens/Map";
import InventoryList from "./src/screens/InventoryList";
import PartsInventory from "./src/screens/PartsInventory";
//
//
// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' +
//     'Cmd+D or shake for dev menu',
//   android: 'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

const AppInventory = StackNavigator(
  {
    Home: { screen: WelcomeScreen },
    BarcodeScanner: { screen: BarcodeScanner },
    WelcomeScreen: { screen: WelcomeScreen },
    UserSelection: { screen: UserSelection },
    IssueUpdate: { screen: IssueUpdate },
    LocationUpdate: { screen: LocationUpdate },
    PictureUpload: { screen: PictureUpload },
    ArbitrationUpdate: { screen: ArbitrationUpdate },
    ConversionsMain: { screen: ConversionsMain },
    ConversionsForm: { screen: ConversionsForm },
    VehicleInfo: { screen: VehicleInfo },
    UserAdministration: { screen: UserAdministration },
    OneUser: { screen: OneUser },
    Map: { screen: Map },
    InventoryList: { screen: InventoryList },
    PartsInventory: { screen: PartsInventory }
  },
  {
    navigationOptions: {
      gesturesEnabled: false
    }
  }
);

//export default AppInventory;
export default () => (
  <Root>
    <AppInventory />
  </Root>
);

// export default class App extends Component<{}> {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>
//           Welcome to React Native!
//         </Text>
//         <Text style={styles.instructions}>
//           To get started, edit App.js
//         </Text>
//         <Text style={styles.instructions}>
//           {instructions}
//         </Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });
