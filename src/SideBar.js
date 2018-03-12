import React, { Component } from "react";
import { AppRegistry, Platform, StyleSheet, Text, View } from "react-native";
import {
  List,
  ListItem,
  Icon,
  Left,
  Body,
  Right,
  Switch,
  Header
} from "native-base";
import { NavigationActions } from "react-navigation";

export default class SideBar extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header />

        <List>
          <ListItem icon onPress={this.props.onUserAdminPress}>
            <Left>
              <Icon name="people" />
            </Left>
            <Body>
              <Text>User administration</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon onPress={this.props.onInventoryPress}>
            <Left>
              <Icon name="list" />
            </Left>
            <Body>
              <Text>Inventory list</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon onPress={this.props.onPartsInventoryPress}>
            <Left>
              <Icon name="speedometer" />
            </Left>
            <Body>
              <Text>Parts inventory</Text>
            </Body>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5FCFF"
  }
});

AppRegistry.registerComponent("SideBar", () => SideBar);
