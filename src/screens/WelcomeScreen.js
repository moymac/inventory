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
  AsyncStorage
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

export default class WelcomeScreen extends Component<{}> {
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
      }
    });
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
  componentDidMount() {
    this._loadInitialState().done();
    //  Alert.alert('null', userNameValue);
  }

  _loadInitialState = async () => {
    try {
      var userNameValue = await AsyncStorage.getItem("userName");
      var userTypeValue = await AsyncStorage.getItem("userType");
      global.userType = userTypeValue;
      if (userNameValue !== null) {
        this.setState({ username: userNameValue });
        this.setState({ loaded: true });
        this.timeoutHandle = setTimeout(() => {
          this.props.navigation.navigate("BarcodeScanner", {
            username: this.state.username
          });
        }, 2500);
        //        this.setState({selectedValue: userNameValue});
        //      this._appendMessage('Recovered selection from disk: ' + userNameValue);
      } else {
        this.props.navigation.navigate("UserSelection");
        this.state.username = "";
        //    this._appendMessage('Initialized with no selection on disk.');
      }
    } catch (error) {
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
