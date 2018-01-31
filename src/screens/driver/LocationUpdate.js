import React, { Component } from "react";
import { AppRegistry, Platform, Alert, BackHandler } from "react-native";
import {
  Container,
  Header,
  Content,
  Item,
  Input,
  Label,
  Form,
  Text,
  Button
} from "native-base";
export default class LocationUpdate extends Component {
  state = {
    comment: "",
    vin: "",
    location: ""
  };
  componentWillMount() {
    const { params } = this.props.navigation.state;
    vin = params.scannedValue;
    this.state.location = params.address;
  }
  buttonClick = () => {
    let commnt = this.state.comment;
    Alert.alert(
      "Location updated",
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
  static navigationOptions = {
    title: "Location update"
  };
  render() {
    const { params } = this.props.navigation.state;

    return (
      <Container>
        <Content>
          <Form>
            <Item disabled>
              <Label>VIN</Label>
              <Input disabled value={vin} numberOfLines={2} />
            </Item>
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
