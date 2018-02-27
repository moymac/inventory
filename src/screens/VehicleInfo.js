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
import Tab4 from "./carInfoTabs/Tab4";
import Tab5 from "./carInfoTabs/Tab5";
import Tab6 from "./carInfoTabs/Tab6";

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
    let comments = allData[7];

    let miles = allData[8];
    let kilometers = allData[9];
    let purchaseLocation = allData[10];
    let purchaseDate = allData[11];

    let purchasePrice = allData[12];
    let purchaseHST = allData[13];
    let buyerFee = allData[14];
    let otherFees = allData[15];
    let feesHST = allData[16];
    let taxablePurchase = allData[17];
    let totalHST = allData[18];
    let grandTotal = allData[19];

    let onQcVoid = allData[20];
    let vehicleStatus = allData[21];
    let initials = allData[22];
    let recall = allData[23];
    let recallNo = allData[24];
    let prearrivalNotes = allData[25];
    let dateOfEntry = allData[26];
    let transRI = allData[27];
    let importer = allData[28];
    let entryNumber = allData[29];
    let releaseDate = allData[30];
    let transMan = allData[31];
    let etaMan = allData[32];
    let regiStatus = allData[33];
    let arrivalDate = allData[34];

    let bOSCheck = allData[35];
    let ownership = allData[36];
    let registrationNo = allData[37];
    let billOfSale = allData[38];
    let applicationDate = allData[39];
    let confirmationDate = allData[40];

    let univKey = allData[41];
    let saleDate = allData[42];
    let purchaser = allData[43];
    let address = allData[44];
    let city = allData[45];
    let zippostl = allData[46];
    let sleNet = allData[47];
    let slePrc = allData[48];
    let salesNo = allData[49];

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
        color,
        comments
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
      },
      shippingInfo: {
        onQcVoid,
        vehicleStatus,
        initials,
        recall,
        recallNo,
        prearrivalNotes,
        dateOfEntry,
        transRI,
        importer,
        entryNumber,
        releaseDate,
        transMan,
        etaMan,
        regiStatus,
        arrivalDate
      },
      adminInfo: {
        bOSCheck,
        ownership,
        registrationNo,
        billOfSale,
        applicationDate,
        confirmationDate
      },
      salesInfo: {
        univKey,
        saleDate,
        purchaser,
        address,
        city,
        zippostl,
        sleNet,
        slePrc,
        salesNo
      }
    });
    console.log(allData);
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
                  <Icon name="speedometer" />
                </TabHeading>
              }
            >
              <Tab2 secondaryInfo={this.state.secondaryInfo} />
            </Tab>
            {userType == "2" || userType == "4" ? (
              <Tab
                heading={
                  <TabHeading>
                    <Icon name="basket" />
                  </TabHeading>
                }
              >
                <Tab3 moneyInfo={this.state.moneyInfo} />
              </Tab>
            ) : null}
            {userType == "2" || userType == "4" ? (
              <Tab
                heading={
                  <TabHeading>
                    <Icon name="boat" />
                  </TabHeading>
                }
              >
                <Tab4 shippingInfo={this.state.shippingInfo} />
              </Tab>
            ) : null}
            {userType == "2" || userType == "4" ? (
              <Tab
                heading={
                  <TabHeading>
                    <Icon name="folder" />
                  </TabHeading>
                }
              >
                <Tab5 adminInfo={this.state.adminInfo} />
              </Tab>
            ) : null}
            {userType == "2" || userType == "4" ? (
              <Tab
                heading={
                  <TabHeading>
                    <Icon name="cash" />
                  </TabHeading>
                }
              >
                <Tab6 salesInfo={this.state.salesInfo} />
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
