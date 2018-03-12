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
  Button,
  Picker,
  ListItem,
  Right,
  Radio
} from "native-base";
import { updateSheet } from "../../Calls";
export default class ConversionsForm extends Component {
  state = {
    comment: "",
    vin: "",
    location: "",
    accessToken: ""
  };
  componentWillMount() {
    const { params } = this.props.navigation.state;
    this.state.vin = params.scannedVIN;
    this.state.scannedFaceplate = params.scannedFaceplate;
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
      this.state.selectedWorkCode,
      this.state.latitude,
      this.state.longitude,
      this.state.location,
      new Date(),
      this.state.note,
      this.state.scannedFaceplate,
      this.state.selectedCompletion
    ];
    //appendToSheet(this.state.accessToken, "Conversions", data);
    //console.log(apptosht);
    updateSheet(this.state.accessToken, "Conversions", this.state.vin, data);

    Alert.alert(
      "Conversion status updated",
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
    title: "Conversion update",
    headerLeft: null
  };
  onValueChangeWC(value: string) {
    this.setState({
      selectedWorkCode: value
    });
  }
  onValueChangeCompletion(value: string) {
    this.setState({
      selectedCompletion: value
    });
  }
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
            <Item disabled>
              <Label>Faceplate</Label>
              <Input
                disabled
                value={this.state.scannedFaceplate}
                numberOfLines={2}
              />
            </Item>
            <Item stackedLabel>
              <Label>Location</Label>
              <Input
                multiline={true}
                onChangeText={location => this.setState({ location })}
                value={this.state.location}
              />
            </Item>
            <Text
              style={{
                textAlign: "center",
                paddingTop: 15
              }}
            >
              Work code
            </Text>
            <Picker
              mode="dropdown"
              placeholder="Work code"
              selectedValue={this.state.selectedWorkCode}
              onValueChange={this.onValueChangeWC.bind(this)}
            >
              <Item label="F" value="f" />
              <Item label="R" value="r" />
              <Item label="RF" value="rf" />
            </Picker>
            <Text
              style={{
                textAlign: "center",
                paddingTop: 15
              }}
            >
              Completion status
            </Text>

            <Picker
              mode="dropdown"
              placeholder="Completion status"
              selectedValue={this.state.selectedCompletion}
              onValueChange={this.onValueChangeCompletion.bind(this)}
            >
              <Item label="Completed" value="completed" />
              <Item label="Pending" value="pending" />
            </Picker>

            <Item stackedLabel last>
              <Label>Notes</Label>

              <Input
                onChangeText={notes => this.setState({ notes })}
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

AppRegistry.registerComponent("ConversionsForm", () => ConversionsForm);
