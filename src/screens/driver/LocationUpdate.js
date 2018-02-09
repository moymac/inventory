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
  Button
} from "native-base";
import { appendToSheet, updateSheet } from "../../Calls";
export default class LocationUpdate extends Component {
  state = {
    comment: "",
    vin: "",
    location: "",
    accessToken: ""
  };
  componentWillMount() {
    const { params } = this.props.navigation.state;
    vin = params.scannedValue;
    this.state.vin = params.scannedValue;
    this.state.userName = params.userName;
    this.state.location = params.address;
    this.state.latitude = params.latitude;
    this.state.longitude = params.longitude;
    this.state.accessToken = params.accessToken;
  }
  buttonClick = () => {
    //VIN	User	latitude	longitude	Address	Arbitration	Reason	Faceplate	LastUpdate
    let data = [
      this.state.vin,
      this.state.userName,
      this.state.latitude,
      this.state.longitude,
      this.state.location,
      this.state.comment,
      "",
      "",
      "",
      new Date()
    ];
    appendToSheet(this.state.accessToken, "AllScans", data);
    //console.log(apptosht);
    updateSheet(
      this.state.accessToken,
      "VehicleLocations",
      this.state.vin,
      data
    );

    Alert.alert(
      "Location updated",
      vin,
      [
        {
          text: "Scan other vehicle",
          onPress: () => this.props.navigation.navigate("BarcodeScanner")
        },
        {
          text: "Get vehicle data",
          onPress: () =>
            this.props.navigation.navigate("VehicleInfo", {
              scannedValue: vin
            })
        }
      ],
      { cancelable: true }
    ); ///UPDATE TO GOOGLE SHEETS
  };
  static navigationOptions = {
    title: "Location update",
    headerLeft: null
  };
  render() {
    const { params } = this.props.navigation.state;

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
          <Button block success onPress={this.buttonClick}>
            <Text>Update</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

AppRegistry.registerComponent("LocationUpdate", () => LocationUpdate);
