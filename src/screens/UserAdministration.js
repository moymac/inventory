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
  Item as FormItem
} from "native-base";
const Item = Picker.Item;

import { getUserList, updateUserList } from "../Calls";
var helperArray = [];
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
    helperArray = await getUserList();
    this.setState({ userList: helperArray });
  }
  onValueChange(position, value) {
    console.log("pos,value", position, value);
    console.log("userlist", this.state.userList);
  }
  buttonClick = () => {
    console.log("authToken", this.state.accessToken);
    console.log("thelist", this.state.userList);
    updateUserList(this.state.accessToken, this.state.userList);
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
        <Content style={{ padding: 20 }}>
          <Title style={{ paddingBottom: 20 }}>Registered users</Title>
          {helperArray != null ? (
            helperArray.map((user, key) => (
              <View key={key}>
                <Form style={{ flexDirection: "row" }}>
                  <Text style={{ flex: 1 }}>{user[0]}</Text>
                  <Picker
                    style={{ flex: 1 }}
                    mode="dropdown"
                    selectedValue={user[1]}
                    onValueChange={selection => {
                      helperArray[key][1] = selection;
                      this.setState({ userList: helperArray });
                    }}
                  >
                    <Item label="Not allowed" value="0" />
                    <Item label="Driver" value="1" />
                    <Item label="Sales" value="2" />
                    <Item label="Inventory" value="3" />
                    <Item label="Pictures" value="5" />
                    <Item label="Administrator" value="4" />
                  </Picker>
                </Form>
                <View
                  style={{
                    borderBottomColor: "#F7F7F7",
                    marginLeft: 10,
                    marginRight: 10,
                    borderBottomWidth: 1
                  }}
                />
              </View>
            ))
          ) : (
            <Text>WAIT</Text>
          )}
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
