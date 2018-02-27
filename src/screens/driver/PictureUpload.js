import React from "react";
import { Text, View, Vibration, Alert, CameraRoll } from "react-native";
import { Camera, Permissions, FileSystem } from "expo";
import { Icon, Button, Header, Left, Right, Title, Toast } from "native-base";
import GalleryScreen from "./GalleryScreen";
import PhotoPreview from "./PhotoPreview";

import {
  createDriveFolder,
  uploadToDrive,
  appendToSheet,
  refreshToken
} from "../../Calls";
//import GDrive from "react-native-google-drive-api-wrapper";
const flashModeOrder = {
  off: "on",
  on: "auto",
  auto: "torch",
  torch: "off"
};
const pictureNames = [
  "Exterior",
  "VIN_plate",
  "Manufacturer_label",
  "Tire_pressure_label",
  "Interior",
  "Driver_airbag",
  "Passenger_airbag",
  "Speedometer",
  "Extra"
];
var extraCounter = 1;
var pictureName = "";
export default class CameraExample extends React.Component {
  state = {
    vin: "",
    location: "",
    hasCameraPermission: null,
    flash: "off",
    photoId: 0,
    showGallery: false,
    showPreview: false,
    type: Camera.Constants.Type.back,
    folderId: "",
    successUpload: false
  };

  async componentWillMount() {
    const { params } = this.props.navigation.state;
    this.state.vin = params.scannedValue;
    this.state.userName = params.userName;
    this.state.location = params.address;
    this.state.latitude = params.latitude;
    this.state.longitude = params.longitude;
    this.state.accessToken = params.accessToken;
    this.state.refreshToken = params.refreshToken;
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }
  async componentDidMount() {
    //  refreshToken(this.state.refreshToken);
    let folderId = await createDriveFolder(
      this.state.accessToken,
      this.state.vin + "_" + this.state.userName
    );
    this.setState({ folderId: folderId });
    let data = [
      this.state.vin,
      this.state.userName,
      this.state.latitude,
      this.state.longitude,
      this.state.location,
      this.state.comment,
      this.state.issueDesc,
      "",
      "https://drive.google.com/drive/folders/" + folderId,
      new Date()
    ];
    appendToSheet(this.state.accessToken, "vehiclePictures", data);

    console.log("statefolderid", folderId);
    FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "photos"
    ).catch(e => {
      console.log(e, "Directory exists");
    });
  }
  static navigationOptions = {
    header: null
    // headerMode: "float",
    // headerStyle: {
    //   backgroundColor: "rgba(0,0,0,0.1)",
    //   shadowOpacity: 0,
    //   position: "absolute",
    //   top: 0,
    //   left: 0,
    //   right: 0,
    //   padding: 0,
    //   margin: 0
    // },
    // //headerStyle: { backgroundColor: "transparent" },
    // headerTintColor: "white",
    // title: pictureNames[0],
    // headerTitleStyle: {
    //   alignSelf: "center",
    //   textAlign: "center"
    // },
    // headerLeft: null
  };
  async uploadAndAlert(token, folderid, picname, filebase) {
    let uploadResponse = await uploadToDrive(
      token,
      folderid,
      picname,
      filebase
    );
    if (uploadResponse.status == 200) {
      Toast.show({
        text: picname + " uploaded!",
        position: "top",
        type: "success"
      }); // Toast.show("This is a toast.");
    } else {
      this.setState({ successUpload: false });
      Toast.show({
        text: picname + " upload error",
        position: "top",
        type: "warning"
      });
      // Toast.show("This is a toast fail.");
    }
  }

  nextPicture() {
    this.uploadAndAlert(
      this.state.accessToken,
      this.state.folderId,
      pictureName,
      this.state.fileBase64
    );

    if (this.state.photoId < 7) {
      this.setState({
        photoId: this.state.photoId + 1,
        showGallery: false,
        showPreview: false
      });
    } else {
      if ((this.state.photoId = 7)) {
        this.setState({
          photoId: this.state.photoId + 1
        });
      }
      this.setState({
        showGallery: true,
        showPreview: false
      });
    }

    //
    // if (this.state.photoId < 7) {
    //   if (uploadResponse.status == 200) {
    //     Alert.alert("Success", "Photo uploaded successfully");
    //     this.setState({
    //       photoId: this.state.photoId + 1,
    //       showGallery: false,
    //       showPreview: false
    //     });
    //   } else {
    //     Alert.alert("Error", "error on upload");
    //   }
    // } else {
    //   this.setState({
    //     showGallery: true,
    //     showPreview: false
    //   });
    // }
  }
  morePictures() {
    this.setState({
      showGallery: false,
      showPreview: false
    });
  }
  finishPictures() {
    Alert.alert(
      "Pictures uploaded",
      "pictures uploaded",
      [
        {
          text: "Scan other vehicle",
          onPress: () => this.props.navigation.navigate("BarcodeScanner")
        },
        {
          text: "Get vehicle data",
          onPress: () =>
            this.props.navigation.navigate("VehicleInfo", {
              scannedValue: this.state.vin
            })
        }
      ],
      { cancelable: true }
    ); ///UPDATE TO GOOGLE SHEETS
  }
  repeatPicture() {
    this.setState({
      showPreview: !this.state.showPreview
    });
  }
  toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash]
    });
  }
  takePicture = async function() {
    // console.log(FileSystem.documentDirectory);
    // alert(FileSystem.documentDirectory);
    if (this.state.photoId > 7) {
      pictureName =
        this.state.vin.slice(-6) +
        "_" +
        pictureNames[this.state.photoId] +
        extraCounter;
      extraCounter++;
    } else {
      pictureName =
        this.state.vin.slice(-6) + "_" + pictureNames[this.state.photoId];
    }
    console.log("picturename", pictureName);
    if (this.camera) {
      this.camera
        .takePictureAsync({
          base64: true
        })
        .then(data => {
          console.log(data);
          this.setState({ fileBase64: data.base64 });
          FileSystem.moveAsync({
            from: data.uri,
            to: `${FileSystem.documentDirectory}photos/${pictureName}.jpg`
          })
            .then(() => {
              Vibration.vibrate();
              this.setState({
                showGallery: false,
                showPreview: true
              });
            })
            .then(() => {
              CameraRoll.saveToCameraRoll(
                `${FileSystem.documentDirectory}photos/${pictureName}.jpg`
              );
            });
        });
    }
  };
  renderPreview() {
    return (
      <PhotoPreview
        picture={pictureName}
        onPressUndo={this.repeatPicture.bind(this)}
        onPressOk={this.nextPicture.bind(this)}
      />
    );
  }
  renderGallery() {
    return (
      <GalleryScreen
        onPressMorePictures={this.morePictures.bind(this)}
        onPressFinish={this.finishPictures.bind(this)}
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
          orientation={this.state.orientation}
        >
          <Header style={{ backgroundColor: "transparent", shadowOpacity: 0 }}>
            <Left>
              <Button
                iconLeft
                transparent
                large
                onPress={this.toggleFlash.bind(this)}
              >
                <Icon name="flash" />
                <Text style={{ color: "white" }}>{this.state.flash}</Text>
              </Button>
            </Left>
            <Right>
              <Title style={{ color: "white" }}>
                {pictureNames[this.state.photoId]}
              </Title>
            </Right>
          </Header>
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {this.state.successUpload ? <Text>upload successful</Text> : null}
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
      : this.state.showPreview ? this.renderPreview() : this.renderCamera();
    return <View style={{ flex: 1 }}>{cameraScreenContent}</View>;
  }
}
