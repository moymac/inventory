import React, { Component } from "react";
import { AppRegistry, Platform, Alert, View, BackHandler } from "react-native";
import {
  Container,
  Header,
  Content,
  Item,
  Input,
  Label,
  Form,
  Icon,
  Text,
  ListItem,
  Body,
  CheckBox,
  Button,
  Picker
} from "native-base";
import { appendToSheet, updateSheet } from "../../Calls";
import { CalendarList } from "react-native-calendars";
import PopupDialog, {
  SlideAnimation,
  DialogButton,
  DialogTitle
} from "react-native-popup-dialog";

const dropoffPlaceOptions = [
  { value: "bodyshop", label: "Bodyshop" },
  { value: "recall", label: "Recall" }
];

export default class PennsylvaniaArrival extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: "",
      vin: "",
      location: "",
      accessToken: "",
      reason: "",
      placeSelection: ""
    };
  }
  static navigationOptions = {
    title: "Vehicle drop-off",
    headerLeft: null
  };
  componentWillMount() {
    const { params } = this.props.navigation.state;
    this.setState({
      vin: params.scannedValue,
      userName: params.userName,
      location: params.address,
      latitude: params.latitude,
      longitude: params.longitude,
      accessToken: params.accessToken
    });
  }
  selectDay = async selectedDate => {
    await this.setState({
      day: selectedDate.day,
      month: selectedDate.month,
      year: selectedDate.year,
      eta: selectedDate.day + "/" + selectedDate.month + "/" + selectedDate.year
    });
    this.popupCalendar.dismiss();
  };
  buttonClick = () => {
    //VIN	User	latitude	longitude	Address	Arbitration	Reason	Faceplate	LastUpdate
    const {
      vin,
      userName,
      latitude,
      longitude,
      location,
      comment,
      reason,
      bodyshopname,
      eta,
      accessToken,
      placeSelection
    } = this.state;
    if (placeSelection == "") {
      Alert.alert("Please select a drop-off location");

      return false;
    }
    let data = [
      vin,
      userName,
      latitude,
      longitude,
      location,
      comment,
      reason,
      bodyshopname,
      eta,
      new Date().toLocaleString("en-CA")
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
    switch (placeSelection) {
      case "bodyshop":
        appendToSheet(accessToken, "AtBodyshop", data);
        break;
      case "recall":
        appendToSheet(accessToken, "AtRecall", data);
        break;
    }

    Alert.alert(
      "Repairshop drop-off",
      vin,
      [
        {
          text: "Scan other vehicle",
          onPress: () => this.props.navigation.navigate("BarcodeScanner")
        },
        {
          text: "Get vehicle data",
          onPress: () =>
            this.props.navigation.navigate("VehicleInfo", {
              scannedValue: vin
            })
        }
      ],
      { cancelable: true }
    ); ///UPDATE TO GOOGLE SHEETS
  };

  onValueChange(value: string) {
    this.setState({
      placeSelection: value
    });
  }

  render() {
    const { params } = this.props.navigation.state;
    const { vin, eta } = this.state;
    return (
      <Container>
        <Content>
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
          <Form>
            <Item disabled>
              <Label>VIN</Label>
              <Input disabled value={vin} numberOfLines={2} />
            </Item>
            <Item>
              {this.state.placeSelection == "" ? (
                <Icon name="alert" style={{ color: "red" }} />
              ) : null}
              <Picker
                mode="dropdown"
                placeholder="Select drop-off location"
                selectedValue={this.state.placeSelection}
                onValueChange={this.onValueChange.bind(this)}
              >
                {dropoffPlaceOptions.map((option, idx) => (
                  <Picker.Item
                    key={idx}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </Item>
            <Item stackedLabel>
              <Label>Location</Label>
              <Input
                multiline={true}
                onChangeText={location => this.setState({ location })}
                value={this.state.location}
              />
            </Item>
            <Item stackedLabel>
              <Label>{this.state.placeSelection} name</Label>
              <Input
                onChangeText={bodyshopname => this.setState({ bodyshopname })}
              />
            </Item>
            <Item>
              <Button
                transparent
                onPress={() => {
                  this.popupCalendar.show();
                }}
              >
                <Text>ETA</Text>
                <Icon name="calendar" />
                <Label>{eta}</Label>
              </Button>
            </Item>
            <Item stackedLabel>
              <Label>Reason</Label>

              <Input
                onChangeText={reason => this.setState({ reason })}
                multiline={true}
                numberOfLines={5}
                style={{ height: 80 }}
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
          <Text />
          <Button block success onPress={this.buttonClick}>
            <Text>Update</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

AppRegistry.registerComponent("LocationUpdate", () => LocationUpdate);
