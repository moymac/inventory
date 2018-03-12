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
  Item as FormItem
} from "native-base";
const Item = Picker.Item;

import { getUserPermissionList, updateUserPermissionList } from "../Calls";
var fullSheet = [];
var helperArray = [];
var titleArray = [];
export default class UserAdministration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected1: "1",
      userList: []
    };
  }
  componentWillMount() {
    const { params } = this.props.navigation.state;
    this.state.accessToken = params.accessToken;
  }
  static navigationOptions = {
    header: null
  };
  async componentDidMount() {
    fullSheet = await getUserPermissionList();
    titleArray = fullSheet.slice(0, 1);

    helperArray = fullSheet.slice(1);
    ///////CREATE THE TITLE ARRAY!!!!!

    this.setState({ userList: helperArray });
    console.log(titleArray);
    // console.log(helperArray);
  }

  buttonClick = () => {
    console.log("authToken", this.state.accessToken);
    console.log("thelist", this.state.userList);
    updateUserPermissionList(this.state.accessToken, this.state.userList);
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
          <List>
            {helperArray != null ? (
              helperArray.map((user, key) => (
                <ListItem
                  key={key}
                  onPress={() => {
                    this.props.navigation.navigate("OneUser", {
                      accessToken: this.state.accessToken,
                      helperArray: helperArray[key],
                      titleArray: titleArray[0],
                      key
                    });
                  }}
                >
                  <Body>
                    <Text>{user[0]}</Text>
                    <Text style={{ fontSize: 11 }}>{user[1]}</Text>
                  </Body>
                  <Right>
                    <Icon name="arrow-forward" />
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

AppRegistry.registerComponent("UserAdministration", () => UserAdministration);
