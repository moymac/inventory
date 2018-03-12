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
import { Item, Input, Label, Button } from "native-base";
import { BarCodeScanner, Permissions } from "expo";

export default class ConversionsMain extends Component {
  static navigationOptions = {
    title: "Scan faceplate",
    headerLeft: null
  };
  state = {
    hasCameraPermission: null,
    shouldRender: false,
    inputerror: false,
    faceplate: ""
  };

  buttonClick = () => {
    console.log("buttonClick");
    var globalParams = {
      userName: this.state.userName,
      scannedVIN: this.state.vin,
      scannedFaceplate: this.state.faceplate,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      address: this.state.location,
      error: this.state.error,
      accessToken: this.state.accessToken
    };
    this.props.navigation.navigate("ConversionsForm", { ...globalParams });
  };
  async componentWillMount() {
    const { params } = this.props.navigation.state;
    vin = params.scannedValue;
    this.state.vin = params.scannedValue;
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
    this.setState({ faceplate: data });
  };
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
                    placeholder="Faceplate model"
                    onChangeText={faceplate => this.setState({ faceplate })}
                    value={this.state.faceplate}
                  />
                </Item>

                <Button block success onPress={this.buttonClick}>
                  <Text>Start</Text>
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

AppRegistry.registerComponent("ConversionsMain", () => ConversionsMain);
