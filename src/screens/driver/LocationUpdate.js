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
  Icon,
  Button,
  Picker
} from "native-base";
import { appendToSheet, updateSheet } from "../../Calls";
import { getAdesaLocationName } from "../../utils";

const locationOptions = [
  { label: "Lane C", value: "LaneC" },
  { label: "Employee Parking lot", value: "Employee Parking Lot" },
  { label: "Shut A", value: "Shut A" },
  { label: "Customer Parking Lot", value: "Customer Parking Lot" },
  { label: "Inside", value: "Inside" },
  { label: "Back 40 Row1", value: "Back 40 Row1" },
  { label: "Back 40 Row2", value: "Back 40 Row2" },
  { label: "Back 40 Row3", value: "Back 40 Row3" },
  { label: "Back 40 Row4", value: "Back 40 Row4" },
  { label: "Back 40 Row5", value: "Back 40 Row5" },
  { label: "Back 40 Row6", value: "Back 40 Row6" },
  { label: "Back 40 Row7", value: "Back 40 Row7" },
  { label: "Back 40 Row8", value: "Back 40 Row8" },
  { label: "Back 40 Row9", value: "Back 40 Row9" },
  { label: "Back 40 Row10", value: "Back 40 Row10" },

  { label: "Unknown/Annex", value: "Unknown Annex" }
];

export default class LocationUpdate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: "",
      vin: "",
      location: "",
      accessToken: ""
    };
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    vin = params.scannedValue;
    // this.state.vin = params.scannedValue;
    // this.state.userName = params.userName;
    // this.state.location = params.address;
    // this.state.latitude = params.latitude;
    // this.state.longitude = params.longitude;
    // this.state.accessToken = params.accessToken;
    let adesaname = getAdesaLocationName(params.latitude, params.longitude);

    this.setState({
      vin: params.scannedValue,
      userName: params.userName,
      location: params.address,
      latitude: params.latitude,
      longitude: params.longitude,
      accessToken: params.accessToken,
      comment: adesaname
    });
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
      "barcode",
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
  static navigationOptions = ({ navigation }) => ({
    title: "Location update",
    headerLeft: (
      <Button transparent small onPress={() => navigation.goBack()}>
        <Icon name="log-out" />
      </Button>
    )
  });
  render() {
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
            {/*    <Item picker>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                placeholder="Adesa location"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.adesaLocation}
                onValueChange={adesaLocation =>
                  this.setState({ adesaLocation })
                }
              >
                {locationOptions.map((option, i) => (
                  <Picker.Item
                    key={i}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </Item>   */}
            <Item stackedLabel last>
              <Label>Comment</Label>

              <Input
                onChangeText={comment => this.setState({ comment })}
                value={this.state.comment}
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
