import React, { Component } from "react";
import { AppRegistry, Platform, StyleSheet, Text, View } from "react-native";

export default class ArbitrationUpdate extends Component {
  static navigationOptions = {
    title: "Arbitration",
    headerLeft: null
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Arbitration UPDATE Sreen!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});

AppRegistry.registerComponent("ArbitrationUpdate", () => ArbitrationUpdate);
