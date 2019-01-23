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
import { appendToSheet, updateSheet } from "../../Calls";
export default class ArbitrationUpdate extends Component {
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
    let data = [
      this.state.vin,
      this.state.userName,
      this.state.latitude,
      this.state.longitude,
      this.state.location,
      this.state.selectedStatus,
      this.state.note,
      new Date()
    ];
    //appendToSheet(this.state.accessToken, "Conversions", data);
    //console.log(apptosht);
    updateSheet(
      this.state.accessToken,
      "barcode",
      "Arbitration",
      this.state.vin,
      data
    );

    Alert.alert(
      "Conversion status updated",
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
    ); ///UPDATE TO GOOGLE SHEETS
  };
  static navigationOptions = {
    title: "Arbitration update",
    headerLeft: null
  };
  onValueChangeStatus(value: string) {
    this.setState({
      selectedStatus: value
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
              Arbitration status
            </Text>
            <Picker
              mode="dropdown"
              placeholder="Arbitration status"
              selectedValue={this.state.selectedStatus}
              onValueChange={this.onValueChangeStatus.bind(this)}
            >
              <Item label="PSI" value="PSI" />
              <Item label="Arbitration" value="Arbitration" />
              <Item label="Passed" value="Passed" />
            </Picker>

            <Item stackedLabel last>
              <Label>Arbitration reason</Label>

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

AppRegistry.registerComponent("ArbitrationUpdate", () => ArbitrationUpdate);
