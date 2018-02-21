import React, { Component } from "react";
import { AppRegistry, Platform, StyleSheet, View } from "react-native";
import { Container, Content, Text, Title, Badge } from "native-base";

export default class Tab2 extends Component {
  render() {
    return (
      <Container>
        <View style={styles.content}>
          <View>
            <Text>Miles</Text>
            <Text style={styles.text}>{this.props.secondaryInfo.miles}</Text>
          </View>
          <View>
            <Text>Kilometers</Text>
            <Text style={styles.text}>
              {this.props.secondaryInfo.kilometers}
            </Text>
          </View>
          <View>
            <Text>Purchase location</Text>
            <Text style={styles.text}>
              {this.props.secondaryInfo.purchaseLocation}
            </Text>
          </View>
          <View>
            <Text>Purchase date</Text>
            <Text style={styles.text}>
              {this.props.secondaryInfo.purchaseDate}
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

AppRegistry.registerComponent("Tab2", () => Tab2);
