import React, { Component } from "react";
import { Container, Header, Content, Tab, Tabs } from "native-base";
import Tab1 from "./carInfoTabs/Tab1";
import Tab2 from "./carInfoTabs/Tab2";
import Tab3 from "./carInfoTabs/Tab3";

export default class TabsExample extends Component {
  state = {
    comment: "",
    vin: "",
    location: ""
  };
  constructor(props) {
    super(props);
    userType = global.userType;
  }
  componentWillMount() {
    //const { globparams } = this.props;
    const { params } = this.props.navigation.state;
    //  userType = globparams.userType;
    vin = params.scannedValue;
    this.state.location = params.address;
  }
  static navigationOptions = {
    title: "Vehicle info"
  };
  render() {
    switch (userType) {
      case "1":
        return (
          <Container>
            <Tabs initialPage={0}>
              <Tab heading="Tab1">
                <Tab1 />
              </Tab>
              <Tab heading="Tab2">
                <Tab2 />
              </Tab>
              <Tab heading="Tab3">
                <Tab3 />
              </Tab>
            </Tabs>
          </Container>
        );
        break;
      default:
        return (
          <Container>
            <Tabs initialPage={0}>
              <Tab heading="Tab1">
                <Tab1 />
              </Tab>
              <Tab heading="Tab2">
                <Tab2 />
              </Tab>
            </Tabs>
          </Container>
        );
    }
  }
}
