// Deploying to a standalone app on Android
// If you have already integrated Google Sign In into your standalone app, this is very easy. Otherwise, there are some additional steps.
//
// If you already have Google Sign In configured
//
// Open your browser to the Google API Manager.
//
// Select your project and enable the Google Maps Android API
//
// In app.json, copy the API key from android.config.googleSignIn to android.config.googleMaps.apiKey.
//
// Rebuild your standalone app.
//
// If you already have not configured Google Sign In
//
// Build your app, take note of your Android package name (eg: ca.brentvatne.growlerprowler)
//
// Open your browser to the Google API Manager and create a project.
//
// Once it’s created, go to the project and enable the Google Maps Android API
//
// Go back to https://console.developers.google.com/apis/credentials and click Create Credentials, then API Key.
//
// In the modal that popped up, click RESTRICT KEY.
//
// Choose the Android apps radio button under Key restriction.
//
// Click the + Add package name and fingerprint button.
//
// Add your android.package from app.json (eg: ca.brentvatne.growlerprowler) to the Package name field.
//
// Run keytool -list -printcert -jarfile growler.apk | grep SHA1 | awk '{ print $2 }' where growler.apk is the path to the apk you built in step 1.
//
// Take the output from step 9 and insert it in the “SHA-1 certificate fingerprint” field.
//
// Copy the API key (the first text input on the page) into app.json under the android.config.googleMaps.apiKey field. See an example diff.
//
// Press Save and then rebuild the app like in step 1.
//

import React, { Component } from "react";
import MapView, { Marker } from "react-native-maps";

export default class Map extends Component {
  state = {
    initialLat: 0,
    initialLon: 0
  };
  static navigationOptions = {
    headerMode: "float",

    headerStyle: {
      backgroundColor: "rgba(0,0,0,0.1)",
      shadowOpacity: 0,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      padding: 0,
      margin: 0
    },
    //headerStyle: { backgroundColor: "transparent" },
    headerTintColor: "white",
    title: "",
    headerTitleStyle: {
      alignSelf: "center",
      textAlign: "center"
    }
  };

  async componentWillMount() {
    const { params } = this.props.navigation.state;
    this.setState({
      initialLat: Number(params.initialLat),
      initialLon: Number(params.initialLon),
      markers: params.markers
    });
    console.log(params.markers);
  }
  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        mapType={"satellite"}
        initialRegion={{
          latitude: Number(this.state.initialLat),
          longitude: Number(this.state.initialLon),
          latitudeDelta: 0.0113,
          longitudeDelta: 0.008
        }}
      >
        {this.state.markers != null
          ? this.state.markers.map((marker, key) => (
              <Marker
                key={key}
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
                pinColor={marker.pinColor.toLowerCase()}
              />
            ))
          : null}
      </MapView>
    );
  }
}
