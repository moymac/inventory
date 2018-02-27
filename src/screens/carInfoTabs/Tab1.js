import React, { Component } from "react";
import { AppRegistry, Platform, StyleSheet, View } from "react-native";
import { Container, Content, Text, Title, Badge } from "native-base";

export default class Tab1 extends Component {
  render() {
    return (
      <Container>
        <View style={styles.content}>
          <Title numberOfLines={3} style={styles.title}>
            {this.props.basicInfo.year} {this.props.basicInfo.make}{" "}
            {this.props.basicInfo.model}
          </Title>
          <View>
            <Text>Trim level</Text>
            <Text style={styles.text}>{this.props.basicInfo.trimLevel}</Text>
          </View>
          <View>
            <Text>Body Type</Text>
            <Text style={styles.text}>{this.props.basicInfo.bodyType}</Text>
          </View>

          <View>
            <Text>Color</Text>
            <Text style={styles.text}>{this.props.basicInfo.color}</Text>
          </View>
          <View>
            <Text>Comments</Text>
            <Text style={styles.text}>{this.props.basicInfo.comments}</Text>
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 35
  },
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

AppRegistry.registerComponent("Tab1", () => Tab1);
