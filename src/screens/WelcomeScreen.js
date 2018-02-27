/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  Alert,
  AppRegistry,
  Platform,
  PermissionsAndroid,
  AsyncStorage,
  CameraRoll
} from "react-native";
import {
  Text,
  Title,
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button
} from "native-base";
import { Camera, Permissions, FileSystem } from "expo";
import { getUserType } from "../Calls";

export default class WelcomeScreen extends Component {
  async componentWillMount() {
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
    Platform.select({
      android: () => {
        this.requestLocationPermission();
        this.requestCameraPermission();
        this.requestCameraRollPermission();
      }
    });
    //this.signInWithGoogleAsync();
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
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }
  async requestReadStoragePermission() {
    console.log("You ask to use the camera");

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "InventoryApp Storage Permission",
          message: "InventoryApp needs read storage"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can read now");
      } else {
        console.log("storage read permission denied");
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
        "Hey! You might want to enable notifications for my app, they are good."
      );
    } else {
      alert("I have permissions");
    }
  }

  componentDidMount() {
    this._loadInitialState().done();
    //  Alert.alert('null', userNameValue);
  }

  _loadInitialState = async () => {
    try {
      var userNameValue = await AsyncStorage.getItem("userName");
      console.log(userNameValue);

      //  var userTypeValue = await AsyncStorage.getItem("userType");
      if (userNameValue !== null) {
        let userTypeValue = await getUserType(JSON.parse(userNameValue));
        AsyncStorage.setItem("userType", JSON.stringify(userTypeValue));

        global.userType = userTypeValue;

        this.setState({ username: userNameValue });
        this.setState({ loaded: true });

        if (userTypeValue < 50 && userTypeValue > 0) {
          this.timeoutHandle = setTimeout(() => {
            if (userTypeValue == "2" || userTypeValue == "4") {
              this.props.navigation.navigate("BarcodeScanner", {
                username: this.state.username
              });
            } else {
              this.props.navigation.navigate("BarcodeScanner", {
                username: this.state.username
              });
            }
          }, 1500);
          //        this.setState({selectedValue: userNameValue});
          //      this._appendMessage('Recovered selection from disk: ' + userNameValue);
        } else {
          Alert.alert("Not authorized", "User not authorized anymore");
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
      <Container>
        <Text>Loading...</Text>
      </Container>
    );
  }
  loaded() {
    const { navigate } = this.props.navigation;

    return (
      <Container>
        <Content>
          <Title style={{ paddingTop: 70, fontSize: 50 }}>Welcome</Title>
          <Title style={{ fontSize: 40 }}>{this.state.username}</Title>
          {/*}
          <Button onPress={this.requestPermissionsButton}>
            <Text>CLICK ME FIRST PLEASE</Text>
          </Button>
          <Button onPress={this.movephotostoroll}>
            <Text>MOVE PICTURES TO ROLL</Text>
          </Button>
*/}
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
    }
    return this.loading();
  }
}

AppRegistry.registerComponent("WelcomeScreen", () => WelcomeScreen);
