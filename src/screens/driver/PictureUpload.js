import React from "react";
import { View, Vibration, Alert, CameraRoll } from "react-native";
import { Camera, Permissions, FileSystem } from "expo";
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
    const {
      scannedValue,
      userName,
      address,
      latitude,
      longitude,
      accessToken,
      refreshToken
    } = this.props.navigation.state.params;

    this.state = {
      hasCameraPermission: null,
      flash: "off",
      photoId: 0,
      ratio: "16:9",
      showGallery: false,
      showPreview: false,
      type: Camera.Constants.Type.back,
      folderId: "",
      vin: scannedValue,
      userName,
      location: address,
      latitude,
      longitude,
      accessToken,
      refreshToken
    };
  }
  async componentWillMount() {
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);

    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted"
    });
  }
  async componentDidMount() {
    //  refreshToken(this.state.refreshToken);
    let folderId = await createDriveFolder(
      this.state.accessToken,
      this.state.vin + "_" + this.state.userName
    );
    if (folderId) {
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

      try {
        await FileSystem.makeDirectoryAsync(
          `${FileSystem.documentDirectory}photos` + this.state.vin,
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

    //
    // FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "photos", {
    //   intermediates: true
    // }).catch(e => {
    //   console.log(e, "Directory exists");
    // });
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
      let data = [
        new Date(),
        "Picture upload fail",
        this.state.userName,
        JSON.stringify(uploadResponse)
      ];
      appendToSheet(this.state.accessToken, "ERRORS", data);

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
    CameraRoll.saveToCameraRoll(
      `${FileSystem.documentDirectory}photos` +
        this.state.vin +
        `/${pictureName}.jpg`
    );
    if (this.state.photoId < 7) {
      this.setState({
        photoId: this.state.photoId + 1,
        showGallery: false,
        showPreview: false
      });
    } else {
      if (this.state.photoId == 7) {
        this.setState({
          photoId: this.state.photoId + 1
        });
      }
      this.setState({
        showGallery: true,
        showPreview: false
      });
    }
  }
  morePictures() {
    this.setState({
      showGallery: false,
      showPreview: false
    });
  }
  finishPictures() {
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);

    Alert.alert(
      "Pictures uploaded",
      "pictures uploaded",
      [
        {
          text: "Scan other vehicle",
          onPress: () => this.props.navigation.navigate("BarcodeScanner")
        }
        // {
        //   text: "Get vehicle data",
        //   onPress: () =>
        //     this.props.navigation.navigate("VehicleInfo", {
        //       scannedValue: this.state.vin
        //     })
        // }
      ],
      { cancelable: true }
    ); ///UPDATE TO GOOGLE SHEETS
  }
  async repeatPicture() {
    await FileSystem.deleteAsync(
      `${FileSystem.documentDirectory}photos` +
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
    if (this.state.photoId > 7) {
      pictureName =
        this.state.vin.slice(-6) +
        "_" +
        pictureNames[this.state.photoId] +
        new Date().getMilliseconds() +
        extraCounter;
      extraCounter++;
    } else {
      pictureName =
        this.state.vin.slice(-6) +
        "_" +
        pictureNames[this.state.photoId] +
        new Date().getMilliseconds();
    }
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
          `${FileSystem.documentDirectory}photos` +
          this.state.vin +
          `/${pictureName}.jpg`
      });
      this.setState({
        fileBase64: photofile.base64,
        showGallery: false,
        showPreview: true
      });

      // this.camera
      //   .takePictureAsync({
      //     quality: 0.4,
      //     base64: true
      //   })
      //   .then(data => {
      //     this.setState({ fileBase64: data.base64 });
      //     FileSystem.moveAsync({
      //       from: data.uri,
      //       to: `${FileSystem.documentDirectory}photos/${pictureName}.jpg`
      //     }).then(() => {
      //       Vibration.vibrate();
      //       this.setState({
      //         showGallery: false,
      //         showPreview: true
      //       });
      //     });
      //   });
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
