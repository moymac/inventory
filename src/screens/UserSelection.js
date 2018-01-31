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

export default class UserSelection extends Component<{}> {
  state = {
    username: "",
    inputerror: false
  };

  static navigationOptions = {
    //  header: {
    //   visible: false,
    // }
    header: null,
    title: "Write your username"
  };

  buttonClick = () => {
    //  console.log('message');
    //  alert(this.state.username);
    let usnm = this.state.username;
    if (usnm.length < 3) {
      this.setState({ inputerror: true });
    } else {
      AsyncStorage.setItem("userName", JSON.stringify(usnm));
      this.props.navigation.navigate("WelcomeScreen");
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
