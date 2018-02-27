import React, { Component } from "react";
import {
  AppRegistry,
  Platform,
  StyleSheet,
  View,
  Vibration,
  Keyboard,
  AsyncStorage,
  BackHandler,
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
  Button,
  Drawer,
  Fab,
  Icon
} from "native-base";
import { BarCodeScanner, Permissions } from "expo";
import SideBar from "./SideBar";

import { NavigationActions } from "react-navigation";
import { refreshToken } from "./Calls";
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
    hasCameraPermission: null,
    shouldRender: true,
    inputerror: false
  };

  async componentWillMount() {
    Keyboard.dismiss();
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
    this.setState({ shouldRender: true });
  }

  constructor(props) {
    super(props);

    this.state = {
      barcode: "",
      userType: "",
      userName: "",
      accessToken: "",
      refreshToken: ""
    };
    setInterval(() => {
      this.setState(previousState => {
        return { blinking: !previousState.blinking };
      });
    }, 100);
  }
  handleBackButton() {
    return true;
  }
  componentDidMount() {
    this.setState({ shouldRender: true });

    BackHandler.addEventListener("backPress", this.handleBackButton);

    this._loadInitialState().done();

    //this.setState({ shouldRender: true });
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
  _loadInitialState = async () => {
    try {
      AsyncStorage.getItem("userType").then(value => {
        const data = JSON.parse(value);
        this.setState({ userType: data });
      });
      AsyncStorage.getItem("userName").then(value => {
        const data = JSON.parse(value);
        this.setState({ userName: data });
      });
      AsyncStorage.getItem("accessToken").then(value => {
        const data = JSON.parse(value);
        this.setState({ accessToken: data });
      });
      AsyncStorage.getItem("refreshToken").then(value => {
        const data = JSON.parse(value);
        this.setState({ refreshToken: data });
      });

      // var userNameValue = await JSON.parse(AsyncStorage.getItem("userName"));
      // var userTypeValue = await JSON.parse(AsyncStorage.getItem("userType"));
      // global.userType = userTypeValue;
      // this.setState({ userType: userTypeValue });
    } catch (error) {
      console.error(error);
    }
  };
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
  fabButton = () => {
    this.drawer._root.open();
  };
  buttonAdmin = async () => {
    //    this.setState({ shouldRender: false });
    //
    this.props.navigation.navigate("UserAdministration", {
      accessToken: await refreshToken(this.state.refreshToken)
    });
  };
  closeDrawer = () => {
    this.drawer._root.close();
  };
  openDrawer = () => {
    this.drawer._root.open();
  };
  buttonClick = async () => {
    //  console.log('message');
    //  alert(this.state.username);
    //    AsyncStorage.setItem("userName", JSON.stringify(this.state.username));
    userType = this.state.userType;
    scannedValue = this.state.barcode;
    if (scannedValue.length < 3) {
      this.setState({ inputerror: true });
    } else {
      this.setState({ shouldRender: false });
      let newAccessToken = await refreshToken(this.state.refreshToken);

      //alert(this.state.barcode);
      //  console.log(userType);
      var globalParams = await {
        userType: this.state.userType,
        userName: this.state.userName,
        scannedValue: this.state.barcode,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        address: this.state.address,
        error: this.state.error,
        accessToken: newAccessToken,
        refreshToken: this.state.refreshToken
      };
      //action: NavigationActions.navigate({ routeName: "SubProfileRoute" })

      switch (this.state.userType) {
        case "5":
          ActionSheet.show(
            {
              options: ["Upload pictures", "Cancel"],
              cancelButtonIndex: 1,
              title: scannedValue
            },
            buttonIndex => {
              //  alert(buttonIndex);
              //    this.setState({ clicked: BUTTONSDRIVER[buttonIndex] });
              switch (buttonIndex) {
                case 0:
                  this.props.navigation.navigate("PictureUpload", {
                    ...globalParams
                  });
                  break;

                default:
                  this.setState({ shouldRender: true });
                  break;
              }
            }
          );
          break;
        case "1":
          ActionSheet.show(
            {
              options: BUTTONSDRIVER,
              cancelButtonIndex: 4,
              title: scannedValue
            },
            buttonIndex => {
              //  alert(buttonIndex);
              //      this.setState({ clicked: BUTTONSDRIVER[buttonIndex] });
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
                  this.setState({ shouldRender: true });
                  break;
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
              //      this.setState({ clicked: BUTTONSSALES[buttonIndex] });
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
                case 4:
                  this.props.navigation.navigate("ArbitrationUpdate", {
                    ...globalParams
                  });
                  break;
                default:
                  this.setState({ shouldRender: true });
                  break;
              }
            }
          );
          break;
        case "3":
          this.props.navigation.navigate("ConversionsMain", {
            scannedValue: scannedValue
          });
          break;
        case "4":
          ActionSheet.show(
            {
              options: BUTTONSSALES,
              cancelButtonIndex: 5,
              title: scannedValue
            },
            buttonIndex => {
              //  alert(buttonIndex);
              //      this.setState({ clicked: BUTTONSSALES[buttonIndex] });
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
                case 4:
                  this.props.navigation.navigate("ArbitrationUpdate", {
                    ...globalParams
                  });
                  break;
                default:
                  this.setState({ shouldRender: true });
                  break;
              }
            }
          );
          break;
        default:
          this.setState({ shouldRender: true });
          break;
      }
    }
  };
  _handleBarCodeRead = ({ type, data }) => {
    Vibration.vibrate(300);
    this.setState({ barcode: data });
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
          <Drawer
            ref={ref => {
              this.drawer = ref;
            }}
            content={
              <SideBar
                navigation={this.props.navigation}
                onUserAdminPress={this.buttonAdmin}
                onInventoryPress={this.buttonInventory}
              />
            }
            onClose={() => this.closeDrawer()}
          >
            <View style={{ flex: 1, justifyContent: "center" }}>
              <BarCodeScanner
                onBarCodeRead={this._handleBarCodeRead}
                style={StyleSheet.absoluteFill}
              />
              {this.state.blinking ? (
                <View
                  style={{
                    borderBottomColor: "red",
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
                      placeholder="VIN"
                      onChangeText={barcode => this.setState({ barcode })}
                      value={this.state.barcode}
                    />
                  </Item>

                  <Button full onPress={this.buttonClick}>
                    <Text>Start</Text>
                  </Button>
                  {this.state.userType == "4" ? (
                    <Fab
                      active={true}
                      direction="up"
                      containerStyle={{}}
                      style={{ backgroundColor: "#5067FF" }}
                      position="bottomRight"
                      onPress={this.fabButton}
                    >
                      <Icon name="add" />
                    </Fab>
                  ) : null}
                </View>
              </KeyboardAvoidingView>
            </View>
          </Drawer>
        );
      }
    }
  }
}

AppRegistry.registerComponent("BarcodeScanner", () => BarcodeScanner);
