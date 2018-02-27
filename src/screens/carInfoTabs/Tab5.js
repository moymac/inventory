import React, { Component } from "react";
import {
  AppRegistry,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity
} from "react-native";
import { Container, Content, Text, Title, Badge, Button } from "native-base";
import { WebBrowser } from "expo";
convertToCurrency = value => {
  return (
    "$" +
    parseFloat(value)
      .toFixed(2)
      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
  );
};

export default class Tab5 extends Component {
  showBOS = async () => {
    let result = await WebBrowser.openBrowserAsync(
      this.props.adminInfo.billOfSale
    );
    this.setState({ result });
  };
  render() {
    return (
      <Container>
        <View style={styles.content}>
          <View>
            <Text>bOSCheck</Text>
            <Text style={styles.text}>{this.props.adminInfo.bOSCheck}</Text>
          </View>
          <View>
            <Text>ownership</Text>
            <Text style={styles.text}>{this.props.adminInfo.ownership}</Text>
          </View>
          <View>
            <Text>registrationNo</Text>
            <Text style={styles.text}>
              {this.props.adminInfo.registrationNo}
            </Text>
          </View>
          <TouchableOpacity onPress={this.showBOS}>
            <View>
              <Text style={styles.text}>Bill of Sale</Text>
            </View>
          </TouchableOpacity>
          <View>
            <Text>applicationDate</Text>
            <Text style={styles.text}>
              {this.props.adminInfo.applicationDate}
            </Text>
          </View>
          <View>
            <Text>confirmationDate</Text>
            <Text style={styles.text}>
              {this.props.adminInfo.confirmationDate}
            </Text>
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    margin: 20,
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around"
  },
  text: {
    textAlign: "right",
    fontSize: 25,
    marginBottom: 5
  }
});

AppRegistry.registerComponent("Tab5", () => Tab5);
