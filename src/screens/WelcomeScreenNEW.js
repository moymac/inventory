/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  Alert,
  AppRegistry,
  PermissionsAndroid,
  AsyncStorage,
  CameraRoll,
  View,
  StatusBar
} from "react-native";
import {
  Text,
  Title,
  Container,
  Content,
  Footer,
  FooterTab,
  Button,
  Spinner
} from "native-base";
import { FileSystem } from "expo";
import { getUserPermissions, getAllShipping } from "../Calls";

export default class WelcomeScreen extends Component {
  async componentWillMount() {
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
    // getAllShipping();
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ isReady: true });
  }

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      loaded: false
    };
    //  alert("hello android");
    this.requestExpoLocationPermission();
    //this.requestLocationPermission();
    this.requestExpoCameraPermission();
    this.requestCameraRollPermission();
    // this.requestReadStoragePermission();
    // this.requestWriteStoragePermission();
    //this.signInWithGoogleAsync();
  }
  async requestExpoLocationPermission() {
    const { Permissions } = Expo;
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      alert(
        "Hey! You might want to enable location for my app, they are good."
      );
    }
  }
  async requestLocationPermission() {
    console.log("You ask to use the gps");

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "InventoryApp Location Permission",
          message: "InventoryApp needs access to your location."
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }
  async requestExpoCameraPermission() {
    const { Permissions } = Expo;
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== "granted") {
      alert("Hey! You might want to enable CAMERA for my app, they are good.");
    }
  }

  async requestCameraPermission() {
    console.log("You ask to use the camera");

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "InventoryApp Camera Permission",
          message: "InventoryApp needs access to your camera"
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async requestCameraRollPermission() {
    const { Permissions } = Expo;
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert(
        "Hey! You might want to enable camera access for my app, they are good."
      );
    }
  }

  async componentDidMount() {
    await this._loadInitialState().done();
  }

  _loadInitialState = async () => {
    try {
      var userNameValue = await AsyncStorage.getItem("userName");

      //  var userTypeValue = await AsyncStorage.getItem("userType");
      if (userNameValue) {
        let usrnameval = await JSON.parse(userNameValue);

        let userPermissions = await getUserPermissions(usrnameval);
        if (userPermissions) {
          AsyncStorage.setItem(
            "userPermissions",
            JSON.stringify(userPermissions)
          );
        }

        this.setState({ username: userNameValue, loaded: true });
        // console.log("userPermissions", userPermissions);

        if (userPermissions && userPermissions[2] == "1") {
          this.timeoutHandle = setTimeout(() => {
            this.props.navigation.navigate("BarcodeScanner", {
              username: this.state.username,
              userPermissions
            });
          }, 1500);
        } else {
          Alert.alert("Not authorized", "User not authorized");
        }
      } else {
        this.props.navigation.navigate("UserSelection");
        this.state.username = "";
        //    this._appendMessage('Initialized with no selection on disk.');
      }
    } catch (error) {
      console.error(error);
      //  alert('error', error);
      //this._appendMessage('AsyncStorage error: ' + error.message);
    }
  };

  static navigationOptions = {
    header: null
  };
  buttonClick = () => {
    clearTimeout(this.timeoutHandle);

    this.props.navigation.navigate("UserSelection");
  };
  requestPermissionsButton = async () => {
    clearTimeout(this.timeoutHandle);

    await this.requestWriteStoragePermission();
  };
  movephotostoroll = async () => {
    clearTimeout(this.timeoutHandle);
    let photoList = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory + "/photos"
    );
    alert(photoList.length);
    for (let photo of photoList) {
      //alert(photo);
      if (photo.slice(-3) == "jpg") {
        CameraRoll.saveToCameraRoll(
          FileSystem.documentDirectory + "/photos/" + photo
        );
      }
    }
    alert("photos are in camera roll now");
    // for (photo in photoList) {
    //   CameraRoll.saveToCameraRoll(
    //     FileSystem.documentDirectory + "/photos/" + photo
    //   );
    // }
  };
  loading() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Spinner />
      </View>
    );
  }
  loaded() {
    const { navigate } = this.props.navigation;

    return (
      <Container>
        <StatusBar hidden={true} />

        <Content>
          <Title style={{ paddingTop: 70, fontSize: 50 }}>Welcome</Title>
          <Title style={{ fontSize: 40 }}>{this.state.username}</Title>
        </Content>
        <Footer>
          <FooterTab>
            <Button full transparent onPress={this.buttonClick}>
              <Text>Not me</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }

  render() {
    //  const { user } = this.state;
    if (this.state.loaded && this.state.isReady) {
      return this.loaded();
    } else {
      return this.loading();
    }
  }
}

AppRegistry.registerComponent("WelcomeScreen", () => WelcomeScreen);
