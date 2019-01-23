import React, { Component } from "react";
import { FileSystem } from "expo";
import {
  AppRegistry,
  Alert,
  ScrollView,
  View,
  AsyncStorage,
  StyleSheet
} from "react-native";
import {
  Container,
  Content,
  Item,
  Input,
  Label,
  Form,
  Text,
  CheckBox,
  Button,
  Title,
  ActionSheet
} from "native-base";
import { appendToSheet, updateShipping, getVehicleSaleDate } from "../../Calls";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import Spinner from "react-native-loading-spinner-overlay";

import { decodeVIN } from "../../utils";

export default class PennsylvaniaArrival extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: true,
      entryNumber: "",
      comment: "",
      vin: "",
      year: "",
      make: "",
      model: "",
      trim: "",
      subseries: "",
      location: "",
      accessToken: "",
      saleDate: "no data",
      needsWork: false,
      loadList: [],
      rowNum: "",
      repairNote: "",
      tableHead: ["OK", "Year", "Make", "Model", "Color", "VIN", "ToDo"],
      widthArr: [35, 50, 70, 75, 65, 100, 100]
    };
  }
  componentWillMount = async () => {
    const { params } = this.props.navigation.state;
    let {
      year,
      make,
      model,
      trim,
      subseries,
      saleDate,
      entryNumber,
      loadList,
      rowNum,
      repairNote
    } = this.state;
    // console.log(this.props);
    // const { shippingList } = this.props.screenProps;
    const shippingListFile = await FileSystem.readAsStringAsync(
      FileSystem.documentDirectory + "fullShippingList"
    );
    const shippingList = await JSON.parse(shippingListFile);

    if (shippingList) {
      const allVehicleData = await getVehicleSaleDate(
        params.scannedValue,
        shippingList
      );
      const {
        saleDate,
        entryNumber,
        loadList,
        rowNum,
        repairNote
      } = allVehicleData;
      this.setState({ saleDate, entryNumber, loadList, rowNum, repairNote });
    }
    const thismoment = new Date();
    const timeformatoptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false
    };
    const formattedNow = thismoment.toLocaleString("en-US", timeformatoptions);

    this.setState({
      vin: params.scannedValue,

      userName: params.userName,
      location: params.address,
      latitude: params.latitude,
      longitude: params.longitude,
      accessToken: params.accessToken,
      folderId: params.folderId,

      formattedNow,
      refreshing: false
    });

    // let decodedVehicle = await decodeVIN(params.scannedValue);

    // if (decodedVehicle) {
    //   // console.log("manheimval", manheimValuation);
    //   console.log(decodedVehicle);
    //   this.setState({
    //     year: decodedVehicle.year,
    //     make: decodedVehicle.make,
    //     model: decodedVehicle.model,
    //     subseries: decodedVehicle.style,
    //     trim: decodedVehicle.trimlevel
    //   });
    //   // this.setState({ year, make, model, trim, subseries });
    // }
  };
  showVehicleOptions = vehicleOptions => {
    console.log("vehicleoptionselection");

    let options = vehicleOptions.map(
      element =>
        `${element.description.year} ${element.description.make} ${
          element.description.model
        } ${element.description.trim} ${element.description.subSeries}`
    );
    ActionSheet.show({ options, title: "Options" }, buttonIndex => {
      let selection = vehicleOptions[buttonIndex];
      this.setState({
        year: selection.year,
        make: selection.make,
        model: selection.model,
        trim: selection.trim,
        subseries: selection.subSeries
      });
    });
  };
  buttonClick = () => {
    //VIN	User	latitude	longitude	Address	Arbitration	Reason	Faceplate	LastUpdate
    let {
      accessToken,
      vin,
      userName,
      latitude,
      longitude,
      location,
      comment,
      folderId,
      formattedNow,
      rowNum
    } = this.state;
    let data = [
      vin,
      userName,
      latitude,
      longitude,
      location,
      comment,
      "No",
      folderId,
      "",
      formattedNow
    ];
    appendToSheet(accessToken, "AllScans", data);
    //console.log(apptosht);
    // updateSheet(
    //   this.state.accessToken,
    //   "barcode",
    //   "AtPennsylvania",
    //   this.state.vin,
    //   data
    // );
    appendToSheet(accessToken, "AtPennsylvania", data);
    updateShipping(accessToken, formattedNow, rowNum);

    Alert.alert(
      "Arrived at Pennsylvania",
      vin,
      [
        {
          text: "Scan other vehicle",
          onPress: () => this.props.navigation.navigate("BarcodeScanner")
        }
        // {
        //   text: "Get vehicle data",
        //   onPress: () =>
        //     this.props.navigation.navigate("VehicleInfo", {
        //       scannedValue: this.state.vin
        //     })
        // }
      ],
      { cancelable: true }
    ); ///UPDATE TO GOOGLE SHEETS
  };
  static navigationOptions = {
    title: "Arrived at Pennsylvania",
    headerLeft: null
  };
  checkNeedsWork = () => {
    let data = [
      this.state.vin,
      this.state.userName,
      this.state.latitude,
      this.state.longitude,
      this.state.location,
      this.state.comment,
      "Yes",
      this.state.folderId,
      "",
      this.state.formattedNow
    ];

    appendToSheet(this.state.accessToken, "AllScans", data);
    //console.log(apptosht);
    // updateSheet(
    //   this.state.accessToken,
    //   "barcode",
    //   "AtPennsylvania",
    //   this.state.vin,
    //   data
    // );
    appendToSheet(this.state.accessToken, "AtPennsylvania", data);
    updateShipping(
      this.state.accessToken,
      this.state.formattedNow,
      this.state.rowNum
    );

    this.props.navigation.navigate("PennsylvaniaPictures", {
      ...this.props.navigation.state.params,
      selection: "Needs bodywork",
      folderId: this.state.folderId
    });
  };

  render() {
    const {
      vin,
      year,
      make,
      model,
      trim,
      subseries,
      saleDate,
      loadList,
      entryNumber,
      tableHead,
      widthArr,
      repairNote
    } = this.state;

    const pickedUpCell = (data, col, row) => <CheckBox checked={data != ""} />;
    return (
      <Container>
        <Content>
          <Title style={{ fontSize: 20, color: "red" }}>SALE DATE</Title>
          <Title style={{ fontSize: 30, color: "red" }}>{saleDate}</Title>
          {repairNote ? (
            <Title style={{ fontSize: 15, color: "red" }}>
              ToDo:
              {repairNote}
            </Title>
          ) : null}
          <Spinner
            visible={this.state.refreshing}
            textContent={"Loading..."}
            textStyle={{ color: "#FFF" }}
          />
          <Form>
            <Item disabled>
              <Label>VIN</Label>
              <Input disabled value={vin} numberOfLines={2} />
            </Item>
            {/* <Item stackedLabel>
              <Label>Year / Make / Model</Label>
              <Input value={`${year} / ${make} / ${model}`} numberOfLines={1} />
            </Item>

            <Item stackedLabel>
              <Label>Trim / Subseries</Label>
              <Input
                value={`${trim} / ${subseries ? subseries : ""}`}
                numberOfLines={1}
              />
            </Item> */}

            <Item stackedLabel>
              <Label>Location</Label>
              <Input
                multiline={true}
                onChangeText={location => this.setState({ location })}
                value={this.state.location}
              />
            </Item>

            <Item stackedLabel last>
              <Label>Comment</Label>

              <Input
                onChangeText={comment => this.setState({ comment })}
                multiline={true}
                numberOfLines={10}
                style={{ height: 100 }}
              />
            </Item>
          </Form>
          <View
            style={{
              alignSelf: "stretch"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Button block onPress={this.checkNeedsWork}>
                <Text>Needs bodywork</Text>
              </Button>
              <Button block success onPress={this.buttonClick}>
                <Text>No bodywork</Text>
              </Button>
            </View>
          </View>
          <Title style={{ fontSize: 18, color: "red" }}>Entry number</Title>

          <Title style={{ fontSize: 20, color: "red" }}>{entryNumber}</Title>

          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{ borderColor: "#C1C0B9" }}>
                <Row
                  data={tableHead}
                  style={styles.header}
                  textStyle={styles.text}
                  widthArr={widthArr}
                />
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{ borderColor: "#c8e1ff" }}>
                  {loadList &&
                    loadList.map((rowData, rowIndex) => (
                      <TableWrapper key={rowIndex} style={styles.row}>
                        {rowData.map((cellData, cellIndex) => (
                          <Cell
                            key={cellIndex}
                            style={{ width: widthArr[cellIndex] }}
                            data={
                              cellIndex == 0
                                ? pickedUpCell(cellData, cellIndex, rowIndex)
                                : cellData
                            }
                            textStyle={styles.text}
                          />
                        ))}
                      </TableWrapper>
                    ))}
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  head: { flex: 1 },
  headText: { fontSize: 20, textAlign: "center" },

  text: { margin: 2 },
  row: { flexDirection: "row" },
  btn: { width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2 },
  btnText: { textAlign: "center", color: "#fff" }
});
AppRegistry.registerComponent("PennsylvaniaArrival", () => PennsylvaniaArrival);
