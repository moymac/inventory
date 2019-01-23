import React, { Component } from "react";
import { AsyncStorage, Text } from "react-native";

import { Root } from "native-base";

import { StackNavigator } from "react-navigation";
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
import UserAdministration from "./src/screens/UserAdministrationNEW";
import OneUser from "./src/screens/OneUser";
import Map from "./src/screens/Map";
import InventoryList from "./src/screens/InventoryList";
import PartsInventory from "./src/screens/PartsInventory";
import GatePass from "./src/screens/driver/GatePass";
import BodyshopDelivery from "./src/screens/pennsylvania/BodyshopDelivery";
import AuctionDelivery from "./src/screens/pennsylvania/AuctionDelivery";
import PennsylvaniaArrival from "./src/screens/pennsylvania/PennsylvaniaArrival";
import PennsylvaniaPictures from "./src/screens/pennsylvania/PennsylvaniaPictures";
import { refreshToken, getAllShipping } from "./src/Calls";
import RecallPickup from "./src/screens/pennsylvania/RecallPickup";
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
    PartsInventory: { screen: PartsInventory },
    GatePass: { screen: GatePass },
    BodyshopDelivery: { screen: BodyshopDelivery },
    AuctionDelivery: { screen: AuctionDelivery },
    PennsylvaniaArrival: { screen: PennsylvaniaArrival },
    PennsylvaniaPictures: { screen: PennsylvaniaPictures },
    RecallPickup: { screen: RecallPickup }
  },
  {
    navigationOptions: {
      gesturesEnabled: false
    }
  }
);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { ShippingList: null, newToken: null };
  }
  async componentDidMount() {
    let storageItem = await AsyncStorage.getItem("refreshToken");
    const rfrshToken = await JSON.parse(storageItem);
    let newToken = await refreshToken(rfrshToken);
    this.setState({ newToken });

    await getAllShipping();
    // console.log(ShippingList ? "loaded" : "notloaded");

    // this.setState({ ShippingList });
    // this.timer = setInterval(
    //   () => this.refreshAccessToken(rfrshToken),
    //   1700000
    // );
  }

  render() {
    return (
      <Root>
        {this.state.newToken !== null ? (
          <AppInventory
          // screenProps={{ shippingList: this.state.ShippingList }}
          />
        ) : (
          <Text>Loading...</Text>
        )}
      </Root>
    );
  }
}
