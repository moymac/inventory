import React, { Component } from "react";
import {
  Container,
  Header,
  Tab,
  Tabs,
  TabHeading,
  Icon,
  Left,
  Body,
  Right,
  Button,
  Title,
  Text,
  Spinner
} from "native-base";
import { getVehicleInfo } from "../Calls";
import Tab1 from "./carInfoTabs/Tab1";
import Tab2 from "./carInfoTabs/Tab2";
import Tab3 from "./carInfoTabs/Tab3";

export default class TabsExample extends Component {
  state = {
    comment: "",
    vin: "",
    location: "",
    loaded: false
  };
  constructor(props) {
    super(props);
    userType = global.userType;
  }
  async componentWillMount() {
    const { params } = this.props.navigation.state;
    this.state.vin = params.scannedValue;

    ///////////CREATE A CASE WHEN VEHICLEDATA GOT NO RESULTS
    let vehicleData = await getVehicleInfo(this.state.vin);
    this.splitVehicleData(await vehicleData.values[0]);
    //    this.splitVehicleData(await getVehicleInfo(this.state.vin));
  }

  splitVehicleData(allData) {
    let year = allData[0];
    let make = allData[1];
    let model = allData[2];
    let trimLevel = allData[4];
    let bodyType = allData[5];
    let color = allData[6];
    let miles = allData[7];
    let kilometers = allData[8];
    let purchaseLocation = allData[9];
    let purchaseDate = allData[10];
    let purchasePrice = allData[11];
    let purchaseHST = allData[12];
    let buyerFee = allData[13];
    let otherFees = allData[14];
    let feesHST = allData[15];
    let taxablePurchase = allData[16];
    let totalHST = allData[17];
    let grandTotal = allData[18];
    console.log("year", year);
    console.log("purchaseDate", purchaseDate);
    this.setState({
      loaded: true,
      basicInfo: {
        year,
        make,
        model,
        trimLevel,
        bodyType,
        color
      },
      secondaryInfo: {
        miles,
        kilometers,
        purchaseLocation,
        purchaseDate
      },
      moneyInfo: {
        purchasePrice,
        purchaseHST,
        buyerFee,
        otherFees,
        feesHST,
        taxablePurchase,
        totalHST,
        grandTotal
      }
    });
    console.log(this.state.basicInfo);
  }

  static navigationOptions = {
    header: null
  };
  render() {
    const { params } = this.props.navigation.state;

    return (
      <Container>
        <Header hasTabs>
          <Left />
          <Body>
            <Title>Vehicle info</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("BarcodeScanner")}
            >
              <Icon name="barcode" />
            </Button>
          </Right>
        </Header>
        {this.state.loaded ? (
          <Tabs>
            <Tab
              heading={
                <TabHeading>
                  <Icon name="car" />
                </TabHeading>
              }
            >
              <Tab1 basicInfo={this.state.basicInfo} />
            </Tab>
            <Tab
              heading={
                <TabHeading>
                  <Icon name="information-circle" />
                </TabHeading>
              }
            >
              <Tab2 secondaryInfo={this.state.secondaryInfo} />
            </Tab>
            {userType == "2" || userType == "4" ? (
              <Tab
                heading={
                  <TabHeading>
                    <Icon name="cash" />
                  </TabHeading>
                }
              >
                <Tab3 moneyInfo={this.state.moneyInfo} />
              </Tab>
            ) : null}
          </Tabs>
        ) : (
          <Spinner />
        )}
      </Container>
    );
  }
}
