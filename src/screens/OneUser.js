import React, { Component } from "react";
import { AppRegistry } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Picker,
  Form,
  Text,
  View,
  Card,
  CardItem,
  List,
  ListItem,
  Switch,
  Toast,
  Item as FormItem
} from "native-base";
const Item = Picker.Item;

import { getUserPermissionList, updateUserPermissions } from "../Calls";
var helperArray = [];
var titleArray = [];
var username;
var row;
export default class OneUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected1: "1",
      permissionList: []
    };
  }
  componentWillMount() {
    const { params } = this.props.navigation.state;
    this.state.accessToken = params.accessToken;

    helperArray = params.helperArray;
    titleArray = params.titleArray;
    row = params.key + 2;
    //    this.setState({ userList: helperArray });
    titleArray = titleArray.slice(2);
    username = helperArray[0];
    usermail = helperArray[1];
    helperArray = helperArray.slice(2);
    this.setState({ permissionList: helperArray });
  }
  static navigationOptions = {
    header: null
  };

  buttonClick = async () => {
    let wasUpdated = await updateUserPermissions(this.state.accessToken, row, [
      this.state.permissionList
    ]);
    if (wasUpdated) {
      Toast.show({
        text: "Permissions updated",
        position: "bottom",
        type: "success"
      });
    }
  };
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Users</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Title style={{ paddingBottom: 20 }}>{username}</Title>
          <Title>{usermail}</Title>

          <List>
            {helperArray != null ? (
              helperArray.map((permission, key) => (
                <ListItem key={key}>
                  <Body>
                    <Text>{titleArray[key]}</Text>
                  </Body>
                  <Right>
                    <Switch
                      onValueChange={() => {
                        if (permission == "1") {
                          helperArray[key] = "0";
                          this.setState({ permissionList: helperArray });
                        } else {
                          helperArray[key] = "1";
                          this.setState({ permissionList: helperArray });
                        }
                      }}
                      value={permission == "1"}
                    />
                  </Right>
                </ListItem>
              ))
            ) : (
              <Text>WAIT</Text>
            )}
          </List>
        </Content>
        <Footer>
          <FooterTab>
            <Button full onPress={this.buttonClick}>
              <Text>Update</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

AppRegistry.registerComponent("OneUser", () => OneUser);
