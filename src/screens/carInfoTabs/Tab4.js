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

export default class Tab4 extends Component {
  render() {
    return (
      <Container>
        <View style={styles.content}>
          <View>
            <View>
              <Text>ON/QC/VOID</Text>
              <Text style={styles.text}>
                {this.props.shippingInfo.onQcVoid}
              </Text>
            </View>
            <View>
              <Text>vehicleStatus</Text>
              <Text style={styles.text}>
                {this.props.shippingInfo.vehicleStatus}
              </Text>
            </View>
            <View>
              <Text>initials</Text>
              <Text style={styles.text}>
                {this.props.shippingInfo.initials}
              </Text>
            </View>
            <View>
              <Text>recall</Text>
              <Text style={styles.text}>{this.props.shippingInfo.recall}</Text>
            </View>
            <View>
              <Text>recallNo</Text>
              <Text style={styles.text}>
                {this.props.shippingInfo.recallNo}
              </Text>
            </View>
            <View>
              <Text>prearrivalNotes</Text>
              <Text style={styles.text}>
                {this.props.shippingInfo.prearrivalNotes}
              </Text>
            </View>
            <View>
              <Text>dateOfEntry</Text>
              <Text style={styles.text}>
                {this.props.shippingInfo.dateOfEntry}
              </Text>
            </View>
            <View>
              <Text>transRI</Text>
              <Text style={styles.text}>{this.props.shippingInfo.transRI}</Text>
            </View>
            <View>
              <Text>importer</Text>
              <Text style={styles.text}>
                {this.props.shippingInfo.importer}
              </Text>
            </View>
            <View>
              <Text>entryNumber</Text>
              <Text style={styles.text}>
                {this.props.shippingInfo.entryNumber}
              </Text>
            </View>
            <View>
              <Text>releaseDate</Text>
              <Text style={styles.text}>
                {this.props.shippingInfo.releaseDate}
              </Text>
            </View>
            <View>
              <Text>transMan</Text>
              <Text style={styles.text}>
                {this.props.shippingInfo.transMan}
              </Text>
            </View>
            <View>
              <Text>etaMan</Text>
              <Text style={styles.text}>{this.props.shippingInfo.etaMan}</Text>
            </View>
            <View>
              <Text>regiStatus</Text>
              <Text style={styles.text}>
                {this.props.shippingInfo.regiStatus}
              </Text>
            </View>
            <View>
              <Text>arrivalDate</Text>
              <Text style={styles.text}>
                {this.props.shippingInfo.arrivalDate}
              </Text>
            </View>
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

AppRegistry.registerComponent("Tab4", () => Tab4);
