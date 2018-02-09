import React from "react";
import { Text, View, Vibration } from "react-native";
import { Camera, Permissions, FileSystem } from "expo";
import { Icon, Button } from "native-base";
import GalleryScreen from "./GalleryScreen";

const flashModeOrder = {
  off: "on",
  on: "auto",
  auto: "torch",
  torch: "off"
};
const pictureNames = [
  "Exterior",
  "VIN plate",
  "Manufacturer label",
  "Tire pressure label",
  "Interior",
  "Driver airbag",
  "Passenger airbag",
  "Speedometer"
];

export default class CameraExample extends React.Component {
  state = {
    vin: "",
    location: "",
    hasCameraPermission: null,
    flash: "off",
    photoId: 0,
    showGallery: false,
    type: Camera.Constants.Type.back
  };

  async componentWillMount() {
    const { params } = this.props.navigation.state;
    this.state.vin = params.scannedValue;
    this.state.location = params.address;
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }
  componentDidMount() {
    FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "photos"
    ).catch(e => {
      console.log(e, "Directory exists");
    });
  }
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
    title: pictureNames[0],
    headerTitleStyle: {
      alignSelf: "center",
      textAlign: "center"
    },
    headerLeft: null
  };
  toggleView() {
    this.setState({
      photoId: photoId + 1,
      showGallery: !this.state.showGallery
    });
  }
  toggleView() {
    this.setState({
      showGallery: !this.state.showGallery
    });
  }
  toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash]
    });
  }
  takePicture = async function() {
    if (this.camera) {
      this.camera.takePictureAsync().then(data => {
        FileSystem.moveAsync({
          from: data.uri,
          to: `${FileSystem.documentDirectory}photos/Photo_${
            this.state.photoId
          }.jpg`
        }).then(() => {
          this.setState({
            photoId: this.state.photoId + 1
          });
          Vibration.vibrate();
          this.setState({
            showGallery: !this.state.showGallery
          });
        });
      });
    }
  };
  renderGallery() {
    return (
      <GalleryScreen
        onPressUndo={this.toggleView.bind(this)}
        onPressOk={this.nextPicture.bind(this)}
      />
    );
  }

  renderCamera() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <Camera
          ref={ref => {
            this.camera = ref;
          }}
          style={{ flex: 1 }}
          type={this.state.type}
          flashMode={this.state.flash}
        >
          <View
            style={{
              flex: 1,
              paddingTop: 70,
              backgroundColor: "transparent",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Button
              iconLeft
              transparent
              large
              onPress={this.toggleFlash.bind(this)}
            >
              <Icon name="flash" />
              <Text>{this.state.flash}</Text>
            </Button>

            <Button
              style={{
                position: "absolute",
                bottom: 10
              }}
              rounded
              onPress={this.takePicture.bind(this)}
            >
              <Icon name="camera" />
            </Button>
          </View>
        </Camera>
      );
    }
  }
  render() {
    const cameraScreenContent = this.state.showGallery
      ? this.renderGallery()
      : this.renderCamera();
    return <View style={{ flex: 1 }}>{cameraScreenContent}</View>;
  }
}
