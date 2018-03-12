import React, { Component } from "react";
import { AppRegistry } from "react-native";
import {
  Container,
  Header,
  Item,
  Icon,
  Input,
  Button,
  Drawer,
  Left,
  Body,
  Title,
  Right
} from "native-base";
import InventorySidebar from "./InventorySidebar";
export default class InventoryList extends Component {
  componentDidMount() {
    this.drawer._root.open();
  }
  static navigationOptions = {
    header: null
  };
  closeDrawer = () => {
    this.drawer._root.close();
  };
  openDrawer = () => {
    this.drawer._root.open();
  };
  updateFilter = thefilter => {
    console.log(thefilter);
  };
  render() {
    return (
      <Drawer
        ref={ref => {
          this.drawer = ref;
        }}
        content={
          <InventorySidebar
            navigation={this.props.navigation}
            onUpdateFilterPress={this.updateFilter}
          />
        }
        onClose={() => this.closeDrawer()}
      >
        <Container>
          <Header>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.goBack()}
              >
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>Inventory</Title>
            </Body>
            <Right>
              <Button transparent onPress={() => this.drawer._root.open()}>
                <Icon name="funnel" />
              </Button>
            </Right>
          </Header>
        </Container>
      </Drawer>
    );
  }
}

//
//
// https://docs.google.com/spreadsheets/d/1AujvrsRW7vxqFCO2a0ozvF_3QQIEU32yyTI51ccXLTU/gviz/tq?tq=select%20*%20where%20G%3D'SILVER'&gid=65990346
//

AppRegistry.registerComponent("InventoryList", () => InventoryList);
