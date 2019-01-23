import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  View,
  Keyboard,
  AsyncStorage,
  BackHandler,
  StatusBar,
  KeyboardAvoidingView,
  Dimensions,
  TouchableHighlight
} from "react-native";
import {
  Text,
  Item,
  Input,
  ActionSheet,
  Button,
  Drawer,
  Fab,
  Icon
} from "native-base";
import { BarCodeScanner, Permissions } from "expo";
import SideBar from "./SideBar";

import { getLatestAccessToken } from "./Calls";

var userFunctionNames = [];
var userFunctionScreens = [];

const ALLFUNCTIONS = [
  { component: "VehicleInfo", name: "Vehicle info" },
  { component: "RunList", name: "Run list" },
  { component: "LocationUpdate", name: "Location update" },
  { component: "IssueUpdate", name: "Issue update" },
  { component: "PictureUpload", name: "Picture upload" },
  { component: "ConversionsMain", name: "Conversion update" },
  { component: "ArbitrationUpdate", name: "Arbitration update" },
  { component: "PennsylvaniaPictures", name: "Pennsylvania arrival" },
  { component: "BodyshopDelivery", name: "Repair/recall drop-off" },
  { component: "AuctionDelivery", name: "Auction drop-off" },
  { component: "RecallPickup", name: "Recall pick up" },
  { component: "PennsylvaniaPictures", name: "Clusters" }
];

export default class BarcodeScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      shouldRender: true,
      inputerror: false,
      barcode: "",
      userType: "",
      userName: "",
      accessToken: "",
      refreshToken: "",
      autoFocus: "on",
      depth: 0,
      userPermissions: []
    };
  }

  async componentWillMount() {
    // getAllFromCarsShipped();

    Keyboard.dismiss();
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted",
      shouldRender: true
    });
    this.openDrawer();
  }

  handleBackButton() {
    return true;
  }

  componentDidMount() {
    BackHandler.addEventListener("backPress", this.handleBackButton);

    this._loadInitialState().done();

    //this.setState({ shouldRender: true });
    navigator.geolocation.getCurrentPosition(
      position => {
        // this.setState({
        //   latitude: position.coords.latitude,
        //   longitude: position.coords.longitude,
        //   error: null
        // });
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
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
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
      let storageItem = await AsyncStorage.getItem("userPermissions");
      const userPermissions = await JSON.parse(storageItem);
      global.userPermissions = userPermissions;

      storageItem = await AsyncStorage.getItem("userName");
      const userName = await JSON.parse(storageItem);
      storageItem = await AsyncStorage.getItem("accessToken");
      const accessToken = await JSON.parse(storageItem);
      storageItem = await AsyncStorage.getItem("refreshToken");
      const refreshToken = await JSON.parse(storageItem);

      this.setState({ userPermissions, userName, accessToken, refreshToken });
      // var userNameValue = await JSON.parse(AsyncStorage.getItem("userName"));
      // var userTypeValue = await JSON.parse(AsyncStorage.getItem("userType"));
      // global.userType = userTypeValue;
      // this.setState({ userType: userTypeValue });
    } catch (error) {
      console.error(error);
    }
  };
  static navigationOptions = ({ navigation }) => ({
    headerMode: "float",
    headerStyle: {
      backgroundColor: "rgba(0,0,0,0.1)",
      shadowOpacity: 0,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      padding: 0,
      margin: 0,
      height: 20
    },
    //headerStyle: { backgroundColor: "transparent" },
    headerTintColor: "white",
    title: "SCAN VIN",
    headerTitleStyle: {
      alignSelf: "center",
      textAlign: "center"
    },
    params: navigation.state.params,
    headerLeft: (
      <Button
        transparent
        small
        onPress={() => navigation.navigate("WelcomeScreen")}
      >
        <Icon name="log-out" />
      </Button>
    )
  });
  fabButton = () => {
    this.openDrawer();
    // this.drawer._root.open();
  };
  buildArrays = () => {
    userFunctionNames = [];
    userFunctionScreens = [];
    let permittedElements = this.state.userPermissions;
    for (let i = 0; i < permittedElements.length; i++) {
      if (permittedElements[i + 8] === "1") {
        userFunctionNames = [...userFunctionNames, ALLFUNCTIONS[i].name];
        userFunctionScreens = [
          ...userFunctionScreens,
          ALLFUNCTIONS[i].component
        ];
      }
    }
    userFunctionNames = [...userFunctionNames, "Cancel"];
  };
  buttonAdmin = async () => {
    //    this.setState({ shouldRender: false });
    //

    this.props.navigation.navigate("UserAdministration", {
      accessToken: await getLatestAccessToken()
    });
  };
  buttonInventory = async () => {
    //    this.setState({ shouldRender: false });
    //

    this.props.navigation.navigate("InventoryList", {
      accessToken: await getLatestAccessToken()
    });
  };
  buttonParts = async () => {
    this.setState({ shouldRender: false });
    let newAccessToken = await getLatestAccessToken();
    const {
      userType,
      userName,
      barcode,
      latitude,
      longitude,
      address,
      error,
      refreshToken
    } = this.state;
    var globalParams = {
      userType,
      userName,
      latitude,
      longitude,
      address,
      error,
      accessToken: newAccessToken,
      refreshToken
    };
    //    this.setState({ shouldRender: false });
    //
    this.props.navigation.navigate("PartsInventory", {
      ...globalParams
    });
  };
  buttonPurchaseList = async () => {
    this.setState({ shouldRender: false });
    this.buildArrays();

    let newAccessToken = await getLatestAccessToken();
    //console.log("newAccessToken", newAccessToken);
    var globalParams = await {
      userName: this.state.userName,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      address: this.state.address,
      error: this.state.error,
      accessToken: newAccessToken,
      refreshToken: this.state.refreshToken,
      userFunctionNames,
      userFunctionScreens
    };
    //    this.setState({ shouldRender: false });
    //
    this.props.navigation.navigate("GatePass", {
      ...globalParams
    });
  };

  closeDrawer = () => {
    this.setState({ shouldRender: true });

    this.drawer._root.close();
  };
  openDrawer = () => {
    this.setState({ shouldRender: false });

    this.drawer._root.open();
  };
  buttonClick = async () => {
    this.buildArrays();
    //console.log("funcnames", userFunctionNames, "screens", userFunctionScreens);
    //  console.log('message');
    //  alert(this.state.username);
    //    AsyncStorage.setItem("userName", JSON.stringify(this.state.username));
    const {
      userType,
      userName,
      latitude,
      longitude,
      address,
      error,
      refreshToken,
      barcode
    } = this.state;
    const scannedValue = barcode;

    if (scannedValue.length < 3) {
      this.setState({ inputerror: true });
    } else {
      this.setState({ shouldRender: false });
      let newAccessToken = await getLatestAccessToken();
      //alert(this.state.barcode);
      //  console.log(userType);
      var globalParams = {
        userType,
        userName,
        scannedValue,
        latitude,
        longitude,
        address,
        error,
        accessToken: newAccessToken,
        refreshToken,
        prevScreen: "BarcodeScanner"
      };
      //action: NavigationActions.navigate({ routeName: "SubProfileRoute" })

      ActionSheet.show(
        {
          options: userFunctionNames,
          cancelButtonIndex: userFunctionNames.length,
          title: scannedValue
        },
        buttonIndex => {
          if (buttonIndex == userFunctionNames.length - 1) {
            //  console.log("cancel");
            this.setState({ shouldRender: true });
          } else {
            this.props.navigation.navigate(userFunctionScreens[buttonIndex], {
              ...globalParams,
              selection: userFunctionNames[buttonIndex]
            });
          }
        }
      );
    }
  };
  _handleBarCodeRead = ({ type, data }) => {
    this.setState({ barcode: data });
  };
  handleKeyDown = e => {
    if (e.nativeEvent.key == "Enter") {
      Keyboard.dismiss();
      this.buttonClick;
    }
  };
  onScanAreaPress = () => {
    Keyboard.dismiss();
    this.setState({ shouldRender: true });
  };
  render() {
    const { shouldRender, hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      const { height, width } = Dimensions.get("window");
      const maskRowHeight = Math.round((height - 300) / 80);
      const maskColWidth = (width - 300) / 2;
      return (
        <Drawer
          ref={ref => {
            this.drawer = ref;
          }}
          content={
            <SideBar
              permissions={this.state.userPermissions}
              navigation={this.props.navigation}
              onUserAdminPress={this.buttonAdmin}
              onInventoryPress={this.buttonInventory}
              onPartsInventoryPress={this.buttonParts}
              onPurchaseListPress={this.buttonPurchaseList}
            />
          }
          onClose={() => this.closeDrawer()}
        >
          <StatusBar hidden={true} />

          <View style={{ flex: 1, justifyContent: "center" }}>
            {shouldRender === false ? (
              <View />
            ) : (
              <BarCodeScanner
                onBarCodeRead={this._handleBarCodeRead}
                style={StyleSheet.absoluteFill}
                autoFocus={this.state.autoFocus}
                focusDepth={this.state.depth}
              />
            )}
            <View style={styles.maskOutter}>
              <View
                style={[
                  { flex: maskRowHeight },
                  styles.maskRow,
                  styles.maskFrame
                ]}
              />
              <View style={[{ flex: 30 }, styles.maskCenter]}>
                <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                <TouchableHighlight
                  style={styles.maskInner}
                  onPress={() => this.onScanAreaPress()}
                >
                  <View />
                </TouchableHighlight>
                <View style={[{ width: maskColWidth }, styles.maskFrame]} />
              </View>
              <View
                style={[
                  { flex: maskRowHeight },
                  styles.maskRow,
                  styles.maskFrame
                ]}
              />
            </View>

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
                    onKeyPress={this.handleKeyDown}
                    value={this.state.barcode}
                  />
                </Item>

                <Button full onPress={this.buttonClick}>
                  <Text>Start</Text>
                </Button>
                {this.state.userPermissions[3] == "1" ||
                this.state.userPermissions[13] == "1" ||
                this.state.userPermissions[5] == "1" ? (
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

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cameraView: {
    flex: 1,
    justifyContent: "flex-start"
  },
  maskOutter: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around"
  },
  maskInner: {
    width: 300,
    backgroundColor: "transparent",
    borderColor: "white",
    borderWidth: 1
  },
  maskFrame: {
    backgroundColor: "rgba(1,1,1,0.6)"
  },
  maskRow: {
    width: "100%"
  },
  maskCenter: { flexDirection: "row" }
});

AppRegistry.registerComponent("BarcodeScanner", () => BarcodeScanner);
