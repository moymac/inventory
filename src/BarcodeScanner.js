import React, { Component } from "react";
import {
  AppRegistry,
  Platform,
  StyleSheet,
  View,
  Vibration,
  Keyboard,
  KeyboardAvoidingView
} from "react-native";
import {
  Text,
  Title,
  Container,
  Header,
  Content,
  Footer,
  Form,
  Item,
  Input,
  Label,
  FooterTab,
  ActionSheet,
  Button
} from "native-base";
import { BarCodeScanner, Permissions } from "expo";

import { NavigationActions } from "react-navigation";
const COMMON = [
  "Update location",
  "Issue update",
  "Upload pictures",
  "Vehicle Info"
];
const BUTTONSDRIVER = [...COMMON, "Cancel"];
const BUTTONSSALES = [...COMMON, "Arbitration Update", "Cancel"];

export default class BarcodeScanner extends Component {
  state = {
    hasCameraPermission: null
  };

  async componentWillMount() {
    Keyboard.dismiss();
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  constructor(props) {
    super(props);

    this.state = {
      barcode: ""
    };
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });
        const myApiKey = "AIzaSyB_e7LpjDy5Nopf3DRrs1endVkQJ3lTCv4";
        fetch(
          "https://maps.googleapis.com/maps/api/geocode/json?address=" +
            position.coords.latitude +
            "," +
            position.coords.longitude +
            "&key=" +
            myApiKey
        )
          .then(response => response.json())
          .then(responseJson => {
            // console.log(
            //   "ADDRESS GEOCODE is BACK!! => " +
            //     JSON.stringify(responseJson.results[0].formatted_address)
            // );
            this.setState({
              address: JSON.stringify(responseJson.results[0].formatted_address)
            });
          });
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  static navigationOptions = {
    headerMode: "float",

    headerStyle: {
      backgroundColor: "rgba(0,0,0,0.1)",
      shadowOpacity: 0,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      padding: 0,
      margin: 0
    },
    //headerStyle: { backgroundColor: "transparent" },
    headerTintColor: "white",
    title: "SCAN VIN",
    headerTitleStyle: {
      alignSelf: "center",
      textAlign: "center"
    },
    headerLeft: null
  };

  buttonClick = () => {
    //  console.log('message');
    //  alert(this.state.username);
    //    AsyncStorage.setItem("userName", JSON.stringify(this.state.username));
    userType = this.state.barcode;
    scannedValue = this.state.barcode;
    //alert(this.state.barcode);

    var globalParams = {
      userType: this.state.barcode,
      scannedValue: this.state.barcode,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      address: this.state.address,
      error: this.state.error
    };
    //action: NavigationActions.navigate({ routeName: "SubProfileRoute" })

    switch (userType) {
      case "1":
        ActionSheet.show(
          {
            options: BUTTONSDRIVER,
            cancelButtonIndex: 4,
            title: scannedValue
          },
          buttonIndex => {
            //  alert(buttonIndex);
            this.setState({ clicked: BUTTONSDRIVER[buttonIndex] });
            switch (buttonIndex) {
              case 0:
                this.props.navigation.navigate("LocationUpdate", {
                  ...globalParams
                });
                break;
              case 1:
                this.props.navigation.navigate("IssueUpdate", {
                  ...globalParams
                });
                break;
              case 2:
                this.props.navigation.navigate("PictureUpload", {
                  ...globalParams
                });
                break;
              case 3:
                this.props.navigation.navigate("VehicleInfo", {
                  ...globalParams
                });
                break;
              default:
            }
          }
        );
        break;
      case "2":
        ActionSheet.show(
          {
            options: BUTTONSSALES,
            cancelButtonIndex: 5,
            title: scannedValue
          },
          buttonIndex => {
            //  alert(buttonIndex);
            this.setState({ clicked: BUTTONSSALES[buttonIndex] });
            switch (buttonIndex) {
              case 0:
                this.props.navigation.navigate("LocationUpdate", {
                  ...globalParams
                });
                break;
              case 1:
                this.props.navigation.navigate("IssueUpdate", {
                  ...globalParams
                });
                break;
              case 2:
                this.props.navigation.navigate("PictureUpload", {
                  ...globalParams
                });
                break;
              case 3:
                this.props.navigation.navigate("ArbitrationUpdate", {
                  ...globalParams
                });
              case 4:
                this.props.navigation.navigate("VehicleInfo", {
                  ...globalParams
                });
                break;
              default:
            }
          }
        );
        break;
      case "3":
        this.props.navigation.navigate("ConversionsMain", {
          scannedValue: scannedValue
        });
        break;
      default:
    }
  };
  _handleBarCodeRead = ({ type, data }) => {
    Vibration.vibrate(300);
    this.setState({ barcode: data });
  };
  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <BarCodeScanner
            onBarCodeRead={this._handleBarCodeRead}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={{
              borderBottomColor: "red",
              borderBottomWidth: 1,
              marginLeft: 35,
              marginRight: 35
            }}
          />
          <KeyboardAvoidingView
            behavior="padding"
            style={{
              flex: 1,
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0
            }}
          >
            <View
              style={{
                flex: 1
              }}
            >
              <Item
                style={{
                  flex: 1
                }}
              >
                <Input
                  style={{
                    flex: 1,
                    color: "white",
                    textAlign: "center",
                    backgroundColor: "rgba(0,0,0,0.3)",
                    fontSize: 30
                  }}
                  //  value = {this.state.name}
                  //  editable = {true}
                  //  placeholder = '{this.state.name}',
                  placeholder="VIN"
                  onChangeText={barcode => this.setState({ barcode })}
                  value={this.state.barcode}
                />
              </Item>

              <Button full onPress={this.buttonClick}>
                <Text>Start</Text>
              </Button>
            </View>
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
}

AppRegistry.registerComponent("BarcodeScanner", () => BarcodeScanner);
