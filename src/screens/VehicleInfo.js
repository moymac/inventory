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
    userPermissions = global.userPermissions;
    console.log("permissions", userPermissions);
  }
  async componentWillMount() {
    const { params } = this.props.navigation.state;
    this.state.vin = params.scannedValue;

    ///////////CREATE A CASE WHEN VEHICLEDATA GOT NO RESULTS
    try {
      let vehicleData = await getVehicleInfo(this.state.vin);
      console.log(vehicleData);
      this.splitVehicleData(await vehicleData.values[0]);
    } catch (error) {
      console.log(error);
      alert("not found");
    }
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
    let lastLocationAddress = allData[8];
    let lastLocationLatLong = allData[9];
    // let lastLocationLongitude = [10];

    let miles = allData[10];
    let kilometers = allData[11];
    let purchaseLocation = allData[12];
    let purchaseDate = allData[13];

    let purchasePrice = allData[14];
    let purchaseHST = allData[15];
    let buyerFee = allData[16];
    let otherFees = allData[17];
    let feesHST = allData[18];
    let taxablePurchase = allData[19];
    let totalHST = allData[20];
    let grandTotal = allData[21];

    let onQcVoid = allData[22];
    let vehicleStatus = allData[23];
    let initials = allData[24];
    let recall = allData[25];
    let recallNo = allData[26];
    let prearrivalNotes = allData[27];
    let dateOfEntry = allData[28];
    let transRI = allData[29];
    let importer = allData[30];
    let entryNumber = allData[31];
    let releaseDate = allData[32];
    let transMan = allData[33];
    let etaMan = allData[34];
    let regiStatus = allData[35];
    let arrivalDate = allData[36];

    let bOSCheck = allData[37];
    let ownership = allData[38];
    let registrationNo = allData[39];
    let billOfSale = allData[40];
    let applicationDate = allData[41];
    let confirmationDate = allData[42];

    let univKey = allData[43];
    let saleDate = allData[44];
    let purchaser = allData[45];
    let address = allData[46];
    let city = allData[47];
    let zippostl = allData[48];
    let sleNet = allData[49];
    let slePrc = allData[50];
    let salesNo = allData[51];

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
        comments,
        lastLocationAddress,
        lastLocationLatLong
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
              <Tab1
                navigation={this.props.navigation}
                basicInfo={this.state.basicInfo}
              />
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
            {userPermissions[4] == "1" ? (
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
            {userPermissions[4] == "1" ? (
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
            {userPermissions[4] == "1" ? (
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
            {userPermissions[4] == "1" ? (
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
