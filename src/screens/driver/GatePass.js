import React, { Component } from "react";
import {
  AppRegistry,
  Platform,
  StyleSheet,
  View,
  Alert,
  ScrollView,
  RefreshControl,
  CameraRoll,
  Image,
  Linking,
  Share
} from "react-native";
import { CalendarList } from "react-native-calendars";
import Spinner from "react-native-loading-spinner-overlay";
import PopupDialog, {
  SlideAnimation,
  DialogButton,
  DialogTitle
} from "react-native-popup-dialog";
import {
  Button,
  Header,
  Left,
  Right,
  Text,
  Icon,
  Title,
  Body,
  ActionSheet,
  CheckBox
} from "native-base";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import { updatePurchaseListPU } from "../../Calls";
import { takeSnapshotAsync, MailComposer, FileSystem } from "expo";

let date = new Date();
var tableData = [];
var databaseJSON = null;
export default class GatePass extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      accessToken: "",
      tableHead: [
        "PU",
        "Run",
        "VIN",
        "Year",
        "Make",
        "Model",
        "Color",
        "Gate pass"
      ],
      widthArr: [35, 52, 110, 55, 70, 100, 60, 125, 0]
    };
  }
  async componentWillMount() {
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
    const { params } = this.props.navigation.state;

    this.state.accessToken = params.accessToken;

    this.refreshList();
  }
  async componentDidMount() {
    try {
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}gatepasses`,
        {
          intermediates: true
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  async pickedUpCheck(col, row) {
    let wasUpdated;
    if (tableData[row][col] == "Y") {
      wasUpdated = await updatePurchaseListPU(
        this.state.accessToken,
        tableData[row][8],
        "N"
      );
    } else {
      wasUpdated = await updatePurchaseListPU(
        this.state.accessToken,
        tableData[row][8],
        "Y"
      );
    }
    if (wasUpdated) {
      this.refreshList();
    }
    //Alert.alert(`This is row ${col}${row}`);
  }

  vinClick(clickedVin) {
    const { params } = this.props.navigation.state;
    console.log(params);
    ActionSheet.show(
      {
        options: params.userFunctionNames,
        cancelButtonIndex: params.userFunctionNames.length,
        title: clickedVin
      },
      buttonIndex => {
        if (buttonIndex == params.userFunctionNames.length - 1) {
          //  console.log("cancel");
          this.setState({ shouldRender: true });
        } else {
          this.props.navigation.navigate(
            params.userFunctionScreens[buttonIndex],
            {
              ...params
            }
          );
        }
      }
    );
  }

  showGatePass(data, col, row) {
    this.setState({
      carVin: tableData[row][1],
      carYear: tableData[row][2],
      carMake: tableData[row][3],
      carModel: tableData[row][4],
      gatepassBarcode: data
    });
    this.popupGatePass.show();
  }
  refreshList = async () => {
    this.setState({ refreshing: true });

    tableData = [];
    try {
      let response = await fetch(
        "https://docs.google.com/spreadsheets/d/1AujvrsRW7vxqFCO2a0ozvF_3QQIEU32yyTI51ccXLTU/gviz/tq?gid=433797648&tq=select%20AL%2C%20AK%2C%20A%2C%20C%2C%20D%2C%20E%2C%20G%2C%20AJ%2C%20AM%20where%20I%20%3D%20date%20'" +
          this.state.year +
          "-" +
          this.state.month +
          "-" +
          this.state.day +
          "'"
      );
      cleanResponse = response._bodyInit.substr(8).slice(0, -2);
      cleanResponse = cleanResponse.replace(
        "google.visualization.Query.setResponse(",
        ""
      );
      databaseJSON = await JSON.parse(cleanResponse);
      //  console.log(databaseJSON);
    } catch (e) {
      console.log(e);
    }
    this.setState({ refreshing: false });
  };

  selectDay = async selectedDate => {
    await this.setState({
      day: selectedDate.day,
      month: selectedDate.month,
      year: selectedDate.year
    });
    this.popupCalendar.dismiss();

    this.refreshList();
  };
  _onRefresh() {
    this.refreshList();
  }

  render() {
    tableData = [];
    const state = this.state;
    if (databaseJSON) {
      let rows = databaseJSON.table.rows;
      for (let i = 0; i < rows.length; i += 1) {
        const rowData = [];
        if (rows[i] != null) {
          for (let j = 0; j < 9; j += 1) {
            rowData.push(rows[i].c[j] == null ? "" : rows[i].c[j].v);
            // rowData.push(`${rows[i].c[j].v}`);
          }
        }
        tableData.push(rowData);
      }
    }

    const gatepassCell = (data, col, row) => (
      <Button
        disabled={data == "not ready"}
        active={data != "not ready"}
        onPress={() => this.showGatePass(data, col, row)}
      >
        <Text>{data}</Text>
      </Button>
    );
    const pickedUpCell = (data, col, row) => (
      <CheckBox
        checked={data == "Y"}
        onPress={() => this.pickedUpCheck(col, row)}
      />
    );
    const vinCell = (data, col, row) => (
      <Button transparent onPress={() => this.vinClick(data)}>
        <Text>{data}</Text>
      </Button>
    );

    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.refreshing}
          textContent={"Loading..."}
          textStyle={{ color: "#FFF" }}
        />

        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("BarcodeScanner")}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Purchase list</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => {
                this.popupCalendar.show();
              }}
            >
              <Icon name="calendar" />
            </Button>
          </Right>
        </Header>

        <Text style={{ position: "absolute", bottom: 30, left: 20 }}>
          No data for {this.state.month}-{this.state.day}-{this.state.year}
        </Text>

        <PopupDialog
          height={0.8}
          width={0.9}
          dialogTitle={<DialogTitle title="Select date" />}
          ref={popupCalendar => {
            this.popupCalendar = popupCalendar;
          }}
        >
          <View>
            <CalendarList
              onDayPress={selectedDate => {
                this.selectDay(selectedDate);
              }}
            />
          </View>
        </PopupDialog>

        <PopupDialog
          style={{ paddingTop: 20 }}
          height={0.8}
          width={0.9}
          dialogTitle={<DialogTitle title="Vehicle gate pass" />}
          ref={popupGatePass => {
            this.popupGatePass = popupGatePass;
          }}
        >
          <View
            style={{
              flex: 2,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white"
            }}
            collapsable={false}
            ref={view => {
              this.printView = view;
            }}
          >
            <View style={styles.head}>
              <Text style={styles.headText}>
                {this.state.carYear} {this.state.carMake}
              </Text>
              <Text style={styles.headText}>{this.state.carModel}</Text>
              <Text style={styles.headText}>{this.state.carVin}</Text>
            </View>
            <Image
              resizeMode="contain"
              style={{
                position: "absolute",
                top: 0,
                left: 10,
                bottom: 0,
                right: 10,
                borderRadius: 3
              }}
              source={{
                uri:
                  "https://bwipjs-api.metafloor.com/?bcid=code128&text=" +
                  this.state.gatepassBarcode +
                  "&includetext"
              }}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Button
              block
              light
              style={{ flex: 1 }}
              onPress={() => this.popupGatePass.dismiss()}
            >
              <Text>Close</Text>
            </Button>
            <Button
              block
              light
              style={{ flex: 1 }}
              onPress={this.shareGatePass}
            >
              <Text>{Platform.OS == "iOS" ? "Share" : "Send by email"}</Text>
            </Button>
            <Button
              block
              light
              style={{ flex: 1 }}
              onPress={this.printGatePass}
            >
              <Text>Print</Text>
            </Button>
          </View>
        </PopupDialog>

        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{ borderColor: "#C1C0B9" }}>
              <Row
                data={state.tableHead}
                style={styles.header}
                textStyle={styles.text}
                widthArr={state.widthArr}
              />
            </Table>
            <ScrollView
              style={styles.dataWrapper}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />
              }
            >
              <Table borderStyle={{ borderColor: "#C1C0B9" }}>
                {tableData.map((rowData, rowIndex) => (
                  <TableWrapper key={rowIndex} style={styles.row}>
                    {rowData.map((cellData, cellIndex) => (
                      <Cell
                        key={cellIndex}
                        style={{ width: this.state.widthArr[cellIndex] }}
                        data={
                          cellIndex === 7
                            ? gatepassCell(cellData, cellIndex, rowIndex)
                            : cellIndex === 0
                              ? pickedUpCell(cellData, cellIndex, rowIndex)
                              : cellIndex === 2
                                ? vinCell(cellData, cellIndex, rowIndex)
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
      </View>
    );
  }
  printGatePass = async () => {
    let result = await takeSnapshotAsync(this.printView, {
      format: "png",
      result: "file"
    });

    let saveresult = await CameraRoll.saveToCameraRoll(result, "photo");

    //      this.setState({ imageUrI: result });
    // this.upload(result)

    console.log("result", saveresult);
  };
  shareGatePass = async () => {
    if (Platform.OS == "ios") {
      let result = await takeSnapshotAsync(this.printView, {
        format: "png",
        result: "base64"
      });
      Share.share({
        message: "THE GATEPASS",
        url: "data:image/png;base64," + result,
        title: "Share gatepass"
      });
    } else {
      let result = await takeSnapshotAsync(this.printView, {
        format: "png",
        result: "file"
      });
      // FileSystem.moveAsync({
      //   from: result,
      //   to: `${FileSystem.documentDirectory}gatepasses/Gatepass.jpg`
      // });
      MailComposer.composeAsync({
        recipient: "",
        subject: "THE GATEPASS",
        body: "Hi, please find attached the GATEPASS.",
        attachments: [result]
      });
    }
  };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  head: { flex: 1 },
  headText: { fontSize: 20, textAlign: "center" },

  text: { margin: 6 },
  row: { flexDirection: "row", backgroundColor: "#FFF1C1" },
  btn: { width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2 },
  btnText: { textAlign: "center", color: "#fff" }
});

AppRegistry.registerComponent("GatePass", () => GatePass);
