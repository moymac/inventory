import React, { Component } from "react";
import { AppRegistry, Platform, Alert, BackHandler } from "react-native";
import {
  Container,
  Header,
  Content,
  Item,
  Input,
  Label,
  Form,
  Text,
  ListItem,
  Body,
  CheckBox,
  Button,
  FooterTab,
  Footer,
  Title
} from "native-base";
import { appendToSheet, updateSheet, getVehicleSaleDate } from "../../Calls";
import { CalendarList } from "react-native-calendars";
import PopupDialog, {
  SlideAnimation,
  DialogButton,
  DialogTitle
} from "react-native-popup-dialog";

export default class RecallPickup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: "",
      vin: "",
      location: "",
      accessToken: "",
      saleDate: "no data",
      needsWork: false
    };
  }
  componentWillMount = async () => {
    const { params } = this.props.navigation.state;
    const saleDate = await getVehicleSaleDate(params.scannedValue);
    this.setState({
      vin: params.scannedValue,
      userName: params.userName,
      location: params.address,
      latitude: params.latitude,
      longitude: params.longitude,
      accessToken: params.accessToken,
      folderId: params.folderId,
      saleDate
    });
  };
  //
  // buttonClick = () => {
  //   //VIN	User	latitude	longitude	Address	Arbitration	Reason	Faceplate	LastUpdate
  //
  //   let data = [
  //     this.state.vin,
  //     this.state.userName,
  //     this.state.latitude,
  //     this.state.longitude,
  //     this.state.location,
  //     this.state.comment,
  //     "No",
  //     this.state.folderId,
  //     "",
  //     new Date().toLocaleString("en-CA")
  //   ];
  //   appendToSheet(this.state.accessToken, "AllScans", data);
  //   //console.log(apptosht);
  //   // updateSheet(
  //   //   this.state.accessToken,
  //   //   "barcode",
  //   //   "AtPennsylvania",
  //   //   this.state.vin,
  //   //   data
  //   // );
  //   appendToSheet(this.state.accessToken, "RecallPickup", data);
  //
  //   Alert.alert(
  //     "Arrived at Pennsylvania",
  //     this.state.vin,
  //     [
  //       {
  //         text: "Scan other vehicle",
  //         onPress: () => this.props.navigation.navigate("BarcodeScanner")
  //       },
  //       {
  //         text: "Get vehicle data",
  //         onPress: () =>
  //           this.props.navigation.navigate("VehicleInfo", {
  //             scannedValue: this.state.vin
  //           })
  //       }
  //     ],
  //     { cancelable: true }
  //   ); ///UPDATE TO GOOGLE SHEETS
  // };
  static navigationOptions = {
    title: "Recall pick up",
    headerLeft: null
  };
  updatePress = () => {
    let data = [
      this.state.vin,
      this.state.userName,
      this.state.latitude,
      this.state.longitude,
      this.state.location,
      this.state.comment,
      "Yes",
      this.state.folderId,
      "",
      new Date().toLocaleString("en-CA")
    ];
    appendToSheet(this.state.accessToken, "AllScans", data);
    //console.log(apptosht);
    // updateSheet(
    //   this.state.accessToken,
    //   "barcode",
    //   "AtPennsylvania",
    //   this.state.vin,
    //   data
    // );
    appendToSheet(this.state.accessToken, "RecallPickup", data);

    this.props.navigation.navigate("PennsylvaniaPictures", {
      ...this.props.navigation.state.params,
      selection: "Recall pick up",
      folderId: this.state.folderId
    });
  };

  render() {
    const { params } = this.props.navigation.state;
    const { needsWork, vin, saleDate } = this.state;
    return (
      <Container>
        <Content>
          <Form>
            <Item disabled>
              <Label>VIN</Label>
              <Input disabled value={vin} numberOfLines={2} />
            </Item>
            <Item stackedLabel>
              <Label>Location</Label>
              <Input
                multiline={true}
                onChangeText={location => this.setState({ location })}
                value={this.state.location}
              />
            </Item>

            <Item stackedLabel last>
              <Label>Comment</Label>

              <Input
                onChangeText={comment => this.setState({ comment })}
                multiline={true}
                numberOfLines={10}
                style={{ height: 100 }}
              />
            </Item>
          </Form>
          <Text />

          <Footer>
            <FooterTab>
              <Button onPress={this.updatePress}>
                <Text>Submit</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Content>
      </Container>
    );
  }
}

AppRegistry.registerComponent("RecallPickup", () => RecallPickup);
