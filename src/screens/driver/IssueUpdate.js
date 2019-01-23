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
import React, { Component } from "react";
import { AppRegistry, Platform, Alert } from "react-native";
import { appendToSheet, updateSheet } from "../../Calls";

export default class IssueUpdate extends Component {
  state = {
    issueDesc: "",
    comment: "",
    issdeserror: false,
    commerror: false,
    vin: "",
    location: ""
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
    let issdes = this.state.issueDesc;
    let commnt = this.state.comment;
    if (issdes.length < 3) {
      this.setState({ issdeserror: true });
    } else if (commnt.length < 3) {
      this.setState({ issdeserror: false });

      this.setState({ commerror: true });
    } else {
      this.setState({ commerror: false });

      let data = [
        this.state.vin,
        this.state.userName,
        this.state.latitude,
        this.state.longitude,
        this.state.location,
        this.state.comment,
        this.state.issueDesc,
        "",
        "",
        new Date()
      ];
      appendToSheet(this.state.accessToken, "AllScans", data);
      updateSheet(
        this.state.accessToken,
        "barcode",
        "VehicleIssues",
        this.state.vin,
        data
      );
      Alert.alert(
        "Issue updated",
        vin,
        [
          {
            text: "Scan other vehicle",
            onPress: () => this.props.navigation.navigate("BarcodeScanner")
          }
          // {
          //   text: "Get vehicle data",
          //   onPress: () =>
          //     this.props.navigation.navigate("VehicleInfo", {
          //       scannedValue: vin
          //     })
          // }
        ],
        { cancelable: true }
      );
    }
    ///UPDATE TO GOOGLE SHEETS
  };
  static navigationOptions = {
    title: "Issue update",
    headerLeft: null
  };
  render() {
    // const { params } = this.props.navigation.state;
    // vin = params.scannedValue;
    // this.state.location = params.address;
    //  this.setState({ location: locat });
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
            <Item stackedLabel error={this.state.issdeserror}>
              <Label>Issue Description</Label>
              <Input
                onChangeText={issueDesc => this.setState({ issueDesc })}
                multiline={true}
                numberOfLines={2}
              />
            </Item>
            <Item stackedLabel last error={this.state.commerror}>
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

AppRegistry.registerComponent("IssueUpdate", () => IssueUpdate);
