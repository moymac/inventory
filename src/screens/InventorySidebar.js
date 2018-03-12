import React, { Component } from "react";
import { AppRegistry, Platform, StyleSheet, View } from "react-native";
import {
  List,
  ListItem,
  Icon,
  Left,
  Body,
  Right,
  Switch,
  Header,
  Title,
  Button,
  Text,
  CheckBox,
  H1
} from "native-base";
import { NavigationActions } from "react-navigation";
import Accordion from "react-native-collapsible/Accordion";

const SECTIONS = [
  {
    title: "Year",
    content: <Text>pelota</Text>
  },
  {
    title: "Make",
    content: (
      <Button full success={true}>
        <Title>Pelota</Title>
      </Button>
    )
  },
  {
    title: "Model",
    content: (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <CheckBox checked={true} />
        <Body>
          <Text>Daily Stand Up</Text>
        </Body>
      </View>
    )
  },
  {
    title: "Location",
    content: <Text>pelota</Text>
  },
  {
    title: "Purchase date",
    content: <Text>pelota</Text>
  },
  {
    title: "Buyer name",
    content: <Text>pelota</Text>
  },
  {
    title: "Seller name",
    content: <Text>pelota</Text>
  },
  {
    title: "Vehicle status",
    content: <Text>pelota</Text>
  }
];

export default class InventorySidebar extends Component {
  _renderHeader(section) {
    return (
      <View>
        <H1>{section.title}</H1>
      </View>
    );
  }
  _renderContent(section) {
    return <View>{section.content}</View>;
  }

  render() {
    return (
      <View style={styles.container}>
        <Header>
          <Body>
            <Title>Filters</Title>
          </Body>
        </Header>

        <Accordion
          sections={SECTIONS}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
        />
        <Button full onPress={() => this.props.onUpdateFilterPress("x")}>
          <Text>Filter</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#F5FCFF"
  }
});

AppRegistry.registerComponent("InventorySidebar", () => InventorySidebar);
