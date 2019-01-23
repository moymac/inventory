import React, { Component } from "react";
import { AppRegistry, Platform, StyleSheet, View } from "react-native";
import { Text, Button } from "native-base";

export default class GoogleLogin extends Component {
  static navigationOptions = {
    title: "GoogleLogin"
  };
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     username: "",
  //     loaded: false
  //   };
  //   Platform.select({
  //     android: () => {
  //       this.requestLocationPermission();
  //       this.requestCameraPermission();
  //     }
  //   });
  //   //this.signInWithGoogleAsync();
  // }

  async signInWithGoogleAsync() {
    try {
      const result = await Expo.Google.logInAsync({
        androidClientId:
          "544692012409-panp8ak109jkqp46h8ju0vb0b9omnbnd.apps.googleusercontent.com",
        iosClientId:
          "544692012409-8cafh0jufk41bf4a10ht39fe4qrg6app.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });
      // console.log(result.user.name);

      if (result.type === "success") {
        AsyncStorage.setItem("userName", JSON.stringify(result.user.name));
        if (result.accessToken) {
          AsyncStorage.setItem(
            "accessToken",
            JSON.stringify(result.accessToken)
          );
        }
        this.props.navigation.navigate("WelcomeScreen");
        //global.accessToken = result.accessToken;
        //  return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log(e);
      return { error: true };
    }
  }

  render() {
    return (
      <View>
        <Button
          onPress={this.signInWithGoogleAsync.bind(this)}
          title="Sign in"
        />
      </View>
    );
  }
}
