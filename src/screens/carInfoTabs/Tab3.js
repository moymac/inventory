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

export default class Tab3 extends Component {
  render() {
    return (
      <Container>
        <View style={styles.content}>
          <View>
            <View>
              <Text>Purchase price</Text>
              <Text style={styles.text}>
                {convertToCurrency(this.props.moneyInfo.purchasePrice)}
              </Text>
            </View>
            <View>
              <Text>Purchase HST</Text>
              <Text style={styles.text}>
                {convertToCurrency(this.props.moneyInfo.purchaseHST)}
              </Text>
            </View>
          </View>
          <View>
            <View>
              <Text>Buyer Fee</Text>
              <Text style={styles.text}>
                {convertToCurrency(this.props.moneyInfo.buyerFee)}
              </Text>
            </View>
            <View>
              <Text>Other Fees</Text>
              <Text style={styles.text}>
                {convertToCurrency(this.props.moneyInfo.otherFees)}
              </Text>
            </View>
            <View>
              <Text>Fees HST</Text>
              <Text style={styles.text}>
                {convertToCurrency(this.props.moneyInfo.feesHST)}
              </Text>
            </View>
          </View>
          <View>
            <View>
              <Text>Taxable purchase price</Text>
              <Text style={styles.text}>
                {convertToCurrency(this.props.moneyInfo.taxablePurchase)}
              </Text>
            </View>
            <View>
              <Text>Total HST</Text>
              <Text style={styles.text}>
                {convertToCurrency(this.props.moneyInfo.totalHST)}
              </Text>
            </View>
          </View>

          <View>
            <Text style={{ fontSize: 23, fontWeight: "bold" }}>TOTAL</Text>
            <Text style={styles.text}>
              {convertToCurrency(this.props.moneyInfo.grandTotal)}
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

AppRegistry.registerComponent("Tab3", () => Tab3);
