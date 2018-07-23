import React, { Component } from "react";
import { AppRegistry, Platform, StyleSheet, View } from "react-native";
import {
  List,
  ListItem,
  Icon,
  Left,
  Body,
  Text,
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
          {this.props.permissions[3] == "1" ? (
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
          ) : null}
          {this.props.permissions[7] == "1" ? (
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
          ) : null}

          {this.props.permissions[6] == "1" ? (
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
          ) : null}
          {this.props.permissions[5] == "1" ? (
            <ListItem icon onPress={this.props.onPurchaseListPress}>
              <Left>
                <Icon name="document" />
              </Left>
              <Body>
                <Text>Purchase list</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          ) : null}
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#F5FCFF"
  }
});

AppRegistry.registerComponent("SideBar", () => SideBar);
