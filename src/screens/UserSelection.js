/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  AppRegistry,
  Platform,
  StyleSheet,
  AsyncStorage,
  View,
  Alert,
  Dimensions,
  BackHandler
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
  Button
} from "native-base";
import Expo from "expo";
import { getUserType, appendToSheet } from "../Calls";

const CLIENTID =
  "544692012409-t63qrqicc250vbu0048b5hubso2f662l.apps.googleusercontent.com";
var token = "";
// async function getUserType(inputusername) {
//   let sheetValues = await fetch(
//     "https://sheets.googleapis.com/v4/spreadsheets/1AujvrsRW7vxqFCO2a0ozvF_3QQIEU32yyTI51ccXLTU/values/Users!A%3AB?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=UNFORMATTED_VALUE&fields=range%2Cvalues&key=" +
//       apiKEY
//   );
// }

export default class UserSelection extends Component<{}> {
  state = {
    username: "",
    inputerror: false,
    accessToken: "",
    refreshToken: ""
  };

  async signInWithGoogleAsync() {
    try {
      const result = await Expo.Google.logInAsync({
        androidClientId:
          "544692012409-panp8ak109jkqp46h8ju0vb0b9omnbnd.apps.googleusercontent.com",
        iosClientId:
          "544692012409-8cafh0jufk41bf4a10ht39fe4qrg6app.apps.googleusercontent.com",
        scopes: [
          "profile",
          "email",
          "https://www.googleapis.com/auth/drive.appdata",
          "https://www.googleapis.com/auth/drive.metadata",
          "https://www.googleapis.com/auth/drive.scripts",
          "https://www.googleapis.com/auth/drive.file",
          "https://www.googleapis.com/auth/drive",
          "https://www.googleapis.com/auth/spreadsheets"
        ]
      });
      if (result.type === "success") {
        //AsyncStorage.setItem("accessToken", JSON.stringify(token));
        token = result.accessToken;
        refreshToken = result.refreshToken;
        googleUser = result.user.name;
        googleUserMail = result.user.email;
        this.setState({
          accessToken: token,
          refreshToken: refreshToken,
          username: googleUser,
          usermail: googleUserMail
        });

        ///////SAVING WRONG TOKEN VALUE!!!

        AsyncStorage.setItem(
          "accessToken",
          JSON.stringify(this.state.accessToken)
        );
        AsyncStorage.setItem(
          "refreshToken",
          JSON.stringify(this.state.refreshToken)
        );
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log(e);
      return { error: true };
    }
  }
  static navigationOptions = {
    //  header: {
    //   visible: false,
    // }
    header: null,
    title: "Write your username"
  };
  async componentDidMount() {
    this.signInWithGoogleAsync();
    //  this.setState({ accessToken: token });
  }
  buttonClick = async () => {
    //  console.log('message');
    //  alert(this.state.username);
    //
    //  getUserType(this.state.username);
    //var token = signInWithGoogleAsync();
    //this.setState({ accessToken: token });
    let usnm = this.state.username;
    let usrmail = this.state.usermail;
    if (usnm.length < 3) {
      this.setState({ inputerror: true });
    } else {
      let userType = await getUserType(usnm);
      if (userType < 50 && userType > 0) {
        AsyncStorage.setItem("userName", JSON.stringify(usnm));
        AsyncStorage.setItem("userType", JSON.stringify(userType));
        this.props.navigation.navigate("WelcomeScreen");
      } else {
        Alert.alert("Not found", "User not registered, wait for approval");
        if (userType != 0) {
          var appendresult = await appendToSheet(
            this.state.accessToken,
            "Users",
            [usnm, "0", usrmail]
          );
        }
      }
      //this.props.navigation.navigate("WelcomeScreen");
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    //TO PASS DATA BETWEEN SCREENS    const { params } = this.props.navigation.state;
    //  const {height: screenHeight} = Dimensions.get('window');
    const { height: screenHeight } = Dimensions.get("window");

    return (
      <Container>
        <Content>
          <View
            style={{ flex: 1, height: screenHeight, justifyContent: "center" }}
          >
            <Form>
              <Item floatingLabel error={this.state.inputerror}>
                <Label>Username</Label>
                <Input
                  //  value = {this.state.name}
                  //  editable = {true}
                  //  placeholder = '{this.state.name}',
                  onChangeText={username => this.setState({ username })}
                  value={this.state.username}
                />
              </Item>
            </Form>
            <Text />
            <Button block onPress={this.buttonClick}>
              <Text>Start</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
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

AppRegistry.registerComponent("UserSelection", () => UserSelection);
