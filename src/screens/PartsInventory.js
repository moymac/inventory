import React, { Component } from "react";
import {
  AppRegistry,
  Platform,
  StyleSheet,
  Vibration,
  Keyboard,
  Text,
  KeyboardAvoidingView,
  View
} from "react-native";
import { Item, Input, Label, Button, Picker } from "native-base";
import { BarCodeScanner, Permissions } from "expo";
import { appendToSheet } from "../Calls";

var partCodes = [];

export default class PartsInventory extends Component {
  static navigationOptions = {
    title: "Scan QR",
    headerLeft: null
  };
  state = {
    hasCameraPermission: null,
    shouldRender: false,
    inputerror: false,
    scannedCode: "",
    userName: "",
    latitude: "",
    longitude: "",
    location: "",
    selectedRack: "",
    selectedLevel: "",
    selectedRow: ""
  };
  buttonAdd = () => {
    if (this.state.scannedCode != "") {
      partCodes = [...partCodes, this.state.scannedCode];
      this.setState({ scannedCode: "" });
    } else {
      alert("you scanned nothing");
    }
  };
  buttonClick = () => {
    console.log(this.state.userName);
    let usnm = this.state.userName;
    let lat = this.state.latitude;
    let lon = this.state.longitude;
    let loc = this.state.location;
    let rac = this.state.selectedRack;
    let lvl = this.state.selectedLevel;
    let row = this.state.selectedRow;
    let tkn = this.state.accessToken;
    if (partCodes.length > 0) {
      partCodes.forEach(function(item) {
        let data = [item, usnm, lat, lon, loc, rac, lvl, row, new Date()];
        appendToSheet(tkn, "PartsInventory", data);
      });
    }
    partCodes = [];
  };
  async componentWillMount() {
    const { params } = this.props.navigation.state;
    this.state.userName = params.userName;
    this.state.location = params.address;
    this.state.latitude = params.latitude;
    this.state.longitude = params.longitude;
    this.state.accessToken = params.accessToken;
    Keyboard.dismiss();
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
    this.setState({ shouldRender: true });
    setInterval(() => {
      this.setState(previousState => {
        return { blinking: !previousState.blinking };
      });
    }, 100);
  }
  _handleBarCodeRead = ({ type, data }) => {
    Vibration.vibrate(300);
    this.setState({ scannedCode: data });
  };

  onValueChangeRack(value: string) {
    this.setState({
      selectedRack: value
    });
  }
  onValueChangeLevel(value: string) {
    this.setState({
      selectedLevel: value
    });
  }
  onValueChangeRow(value: string) {
    this.setState({
      selectedRow: value
    });
  }
  render() {
    const { shouldRender } = this.state;
    if (shouldRender === false) {
      return <View />;
    } else {
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
                flex: 1,
                flexDirection: "column",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0
              }}
            >
              <Picker
                mode="dropdown"
                placeholder="Shelf"
                selectedValue={this.state.selectedRack}
                onValueChange={this.onValueChangeRack.bind(this)}
              >
                <Item label="A" value="A" />
                <Item label="B" value="B" />
                <Item label="C" value="C" />
                <Item label="D" value="D" />
                <Item label="E" value="E" />
                <Item label="F" value="F" />

                <Item label="V" value="V" />
                <Item label="W" value="W" />
                <Item label="X" value="X" />
                <Item label="Y" value="Y" />
                <Item label="Z" value="Z" />
              </Picker>
              <Picker
                mode="dropdown"
                placeholder="Level"
                selectedValue={this.state.selectedLevel}
                onValueChange={this.onValueChangeLevel.bind(this)}
              >
                <Item label="1" value="1" />
                <Item label="2" value="2" />
                <Item label="3" value="3" />
                <Item label="4" value="4" />
                <Item label="5" value="5" />
                <Item label="6" value="6" />
                <Item label="7" value="7" />
                <Item label="8" value="8" />
                <Item label="9" value="9" />
                <Item label="10" value="10" />
                <Item label="11" value="11" />
                <Item label="12" value="12" />
                <Item label="13" value="13" />
                <Item label="14" value="14" />
                <Item label="15" value="15" />
              </Picker>
              {partCodes.length > 0
                ? partCodes.map((item, key) => (
                    <Text style={{ color: "yellow" }} key={key}>
                      {item}
                    </Text>
                  ))
                : null}
            </View>
            {this.state.blinking ? (
              <View
                style={{
                  borderBottomColor: "blue",
                  borderBottomWidth: 1,
                  marginLeft: 35,
                  marginRight: 35
                }}
              />
            ) : null}

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
                  error={this.state.inputerror}
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
                    placeholder="Code"
                    onChangeText={scannedCode => this.setState({ scannedCode })}
                    value={this.state.scannedCode}
                  />
                </Item>
                <Button block onPress={this.buttonAdd}>
                  <Text>Scan more</Text>
                </Button>
                <Button block success onPress={this.buttonClick}>
                  <Text>Finish Level</Text>
                </Button>
              </View>
            </KeyboardAvoidingView>
          </View>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});

AppRegistry.registerComponent("PartsInventory", () => PartsInventory);