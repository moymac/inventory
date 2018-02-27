import React, { Component } from "react";
import { AppRegistry, Platform, StyleSheet, View } from "react-native";
import { Container, Content, Text, Title, Badge } from "native-base";

convertToCurrency = value => {
  return (
    "$" +
    parseFloat(value)
      .toFixed(2)
      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
  );
};

export default class Tab6 extends Component {
  render() {
    return (
      <Container>
        <View style={styles.content}>
          <View>
            <Text>univKey</Text>
            <Text style={styles.text}>{this.props.salesInfo.univKey}</Text>
          </View>
          <View>
            <Text>saleDate</Text>
            <Text style={styles.text}>{this.props.salesInfo.saleDate}</Text>
          </View>
          <View>
            <Text>purchaser</Text>
            <Text style={styles.text}>{this.props.salesInfo.purchaser}</Text>
          </View>
          <View>
            <Text>address</Text>
            <Text style={styles.text}>{this.props.salesInfo.address}</Text>
          </View>
          <View>
            <Text>city</Text>
            <Text style={styles.text}>{this.props.salesInfo.city}</Text>
          </View>
          <View>
            <Text>zippostl</Text>
            <Text style={styles.text}>{this.props.salesInfo.zippostl}</Text>
          </View>
          <View>
            <Text>sleNet</Text>
            <Text style={styles.text}>{this.props.salesInfo.sleNet}</Text>
          </View>
          <View>
            <Text>slePrc</Text>
            <Text style={styles.text}>{this.props.salesInfo.slePrc}</Text>
          </View>
          <View>
            <Text>salesNo</Text>
            <Text style={styles.text}>{this.props.salesInfo.salesNo}</Text>
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

AppRegistry.registerComponent("Tab6", () => Tab6);
