import React, { Component } from "react";
import {
  AppRegistry,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity
} from "react-native";
import { Container, Content, Text, Title, Badge, Icon } from "native-base";

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
          <TouchableOpacity
            onPress={() => {
              marker = {
                title: this.props.basicInfo.model,
                description: this.props.basicInfo.trimLevel,
                pinColor: this.props.basicInfo.color,
                coordinate: {
                  latitude: Number(
                    this.props.basicInfo.lastLocationLatLong.split(",")[0]
                  ),
                  longitude: Number(
                    this.props.basicInfo.lastLocationLatLong.split(",")[1]
                  )
                }
              };

              this.props.navigation.navigate("Map", {
                initialLat: Number(
                  this.props.basicInfo.lastLocationLatLong.split(",")[0]
                ),
                initialLon: Number(
                  this.props.basicInfo.lastLocationLatLong.split(",")[1]
                ),
                markers: [marker]
              });
            }}
          >
            <Text>Last location</Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.text}>
                {this.props.basicInfo.lastLocationAddress}
              </Text>
              <Icon name="arrow-forward" />
            </View>
          </TouchableOpacity>
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
