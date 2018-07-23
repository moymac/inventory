import React from "react";
import { View, Vibration, Alert, CameraRoll } from "react-native";
import { Camera, Permissions, FileSystem, MailComposer, Asset } from "expo";
import {
  Icon,
  Button,
  Header,
  Left,
  Right,
  Text,
  Title,
  Toast
} from "native-base";
import GalleryScreen from "./GalleryScreen";
import PhotoPreview from "./PhotoPreview";

import {
  createDrivePAFolder,
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
  "Exterior_front",
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
  constructor(props) {
    super(props);
    console.log(props);
    const {
      scannedValue,
      userName,
      address,
      latitude,
      longitude,
      accessToken,
      refreshToken,
      prevScreen,
      selection,
      folderId
    } = this.props.navigation.state.params;
    this.state = {
      hasCameraPermission: null,
      flash: "off",
      photoId: 0,
      ratio: "16:9",
      showGallery: false,
      showPreview: false,
      type: Camera.Constants.Type.back,
      folderId,
      vin: scannedValue,
      userName,
      location: address,
      latitude,
      longitude,
      accessToken,
      refreshToken,
      photoUris: [],
      prevScreen,
      selectedScreen: selection,
      screenTitle: ""
    };
  }
  async componentWillMount() {
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);

    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    const { selectedScreen } = this.state;
    switch (selectedScreen) {
      case "Pennsylvania arrival":
        this.setState({ screenTitle: "VIN label/plate" });
        break;
      case "Needs bodywork":
        this.setState({ screenTitle: `Damage ${this.state.photoId + 1}` });
        break;
      case "Recall pick up":
        this.setState({ screenTitle: "Recall document" });
        break;
      case "Clusters":
        this.setState({ screenTitle: "Invoice" });
        break;
    }
    this.setState({
      hasCameraPermission: status === "granted"
    });
  }
  async componentDidMount() {
    //  refreshToken(this.state.refreshToken);
    console.log("folderid", this.state.folderId);
    let folderId = this.state.folderId;
    if (folderId == undefined) {
      folderId = await createDrivePAFolder(
        this.state.accessToken,
        this.state.vin + "_" + this.state.userName
      );
    }
    if (folderId) {
      this.setState({ folderId });
      let data = [
        this.state.vin,
        this.state.userName,
        this.state.latitude,
        this.state.longitude,
        this.state.location,
        this.state.comment,
        this.state.issueDesc,
        this.state.selectedScreen,
        "https://drive.google.com/drive/folders/" + folderId,
        new Date()
      ];
      appendToSheet(this.state.accessToken, "vehiclePictures", data);

      try {
        await FileSystem.makeDirectoryAsync(
          `${FileSystem.cacheDirectory}photos` + this.state.vin,
          {
            intermediates: true
          }
        );
      } catch (e) {
        console.log(e);
      }
    } else {
      Toast.show({
        text: "Internet error,check your connection",
        position: "top",
        type: "warning"
      });
    }
  }
  static navigationOptions = {
    header: null
  };
  async uploadAndAlert(token, folderid, picname, filebase) {
    // console.log(picname);
    picname = picname.replace(new RegExp("_", "g"), " ");
    //    console.log(picname);
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
      Toast.show({
        text: picname + " upload error",
        position: "top",
        type: "warning"
      });
      // Toast.show("This is a toast fail.");
    }
  }

  nextPicture = async () => {
    const {
      accessToken,
      folderId,
      fileBase64,
      vin,
      photoUris,
      selectedScreen
    } = this.state;

    this.uploadAndAlert(accessToken, folderId, pictureName, fileBase64);
    CameraRoll.saveToCameraRoll(
      `${FileSystem.cacheDirectory}photos` + vin + `/${pictureName}.jpg`
    );

    if (selectedScreen == "Pennsylvania arrival") {
      this.props.navigation.navigate("PennsylvaniaArrival", {
        ...this.props.navigation.state.params,
        folderId: this.state.folderId
      });
    }

    photoUris.push(
      `${FileSystem.cacheDirectory}photos` + vin + `/${pictureName}.jpg`
    );

    this.setState({
      photoId: this.state.photoId + 1,
      showGallery: true,
      showPreview: false,
      photoUris
    });
  };
  morePictures() {
    this.setState({
      showGallery: false,
      showPreview: false
    });
  }
  finishPictures = async () => {
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
    const attachments = [];
    // this.state.photoUris.map(item => {
    //   attachments.push(Asset.fromModule(require(item)).localUri);
    // });
    try {
      await MailComposer.composeAsync({
        recipients: ["admin@germanstarmotors.ca"],
        subject: `${this.state.selectedScreen} ${this.state.vin}`,
        body: `Vehicle pictures at ${this.state.location}`,
        attachments: this.state.photoUris
      });
    } catch (e) {
      console.log(e);
    }

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
  };

  async repeatPicture() {
    await FileSystem.deleteAsync(
      `${FileSystem.cacheDirectory}photos` +
        this.state.vin +
        `/${pictureName}.jpg`
    );

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
    const { selectedScreen } = this.state;
    let pictureType = "";
    switch (selectedScreen) {
      case "Recall pick up":
        pictureType = "Recall_";
        break;
      case "Pennsylvania arrival":
        pictureType = "Arrived_";
        break;
      case "Needs bodywork":
        pictureType = "Damage_";
        break;
    }

    pictureName =
      pictureType +
      this.state.vin.slice(-6) +
      "_" +
      this.state.photoId +
      new Date().getMilliseconds();
    // console.log("picturename", pictureName);
    if (this.camera) {
      let photofile = await this.camera.takePictureAsync({
        quality: 0.4,
        base64: true
      });
      // Vibration.vibrate();
      await FileSystem.moveAsync({
        from: photofile.uri,
        to:
          `${FileSystem.cacheDirectory}photos` +
          this.state.vin +
          `/${pictureName}.jpg`
      });
      this.setState({
        fileBase64: photofile.base64,
        showGallery: false,
        showPreview: true
      });
    }
  };

  renderPreview() {
    return (
      <PhotoPreview
        vin={this.state.vin}
        picture={pictureName}
        onPressUndo={this.repeatPicture.bind(this)}
        onPressOk={this.nextPicture.bind(this)}
      />
    );
  }

  renderGallery() {
    return (
      <GalleryScreen
        vin={this.state.vin}
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
          ratio={this.state.ratio}
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
              <Title style={{ color: "white" }}>{this.state.screenTitle}</Title>
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
      : this.state.showPreview
        ? this.renderPreview()
        : this.renderCamera();
    return <View style={{ flex: 1 }}>{cameraScreenContent}</View>;
  }
}
