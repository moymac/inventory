import React from "react";
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Footer, FooterTab, Button, Text, Icon } from "native-base";
import { FileSystem, FaceDetector } from "expo";

const pictureSize = 150;

export default class GalleryScreen extends React.Component {
  state = {
    photos: []
  };

  componentDidMount() {
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "photos").then(
      photos => {
        this.setState({
          photos
        });
      }
    );
  }

  getImageDimensions = ({ width, height }) => {
    if (width > height) {
      const scaledHeight = pictureSize * height / width;
      return {
        width: pictureSize,
        height: scaledHeight,

        scaleX: pictureSize / width,
        scaleY: scaledHeight / height,

        offsetX: 0,
        offsetY: (pictureSize - scaledHeight) / 2
      };
    } else {
      const scaledWidth = pictureSize * width / height;
      return {
        width: scaledWidth,
        height: pictureSize,

        scaleX: scaledWidth / width,
        scaleY: pictureSize / height,

        offsetX: (pictureSize - scaledWidth) / 2,
        offsetY: 0
      };
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentComponentStyle={{ flex: 1 }}>
          <View style={styles.pictures}>
            {this.state.photos.map(photoUri => (
              <View style={styles.pictureWrapper} key={photoUri}>
                <Image
                  key={photoUri}
                  style={styles.picture}
                  source={{
                    uri: `${FileSystem.documentDirectory}photos/${photoUri}`
                  }}
                />
              </View>
            ))}
          </View>
        </ScrollView>
        <Footer>
          <FooterTab>
            <Button onPress={this.props.onPressUndo}>
              <Icon name="undo" />
            </Button>
            <Button>
              <Icon name="arrow-forward" />
            </Button>
          </FooterTab>
        </Footer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pictures: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  picture: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    resizeMode: "contain"
  },
  pictureWrapper: {
    width: pictureSize,
    height: pictureSize,
    margin: 5
  },
  facesContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0
  },
  face: {
    borderWidth: 2,
    borderRadius: 2,
    position: "absolute",
    borderColor: "#FFD700",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  faceText: {
    color: "#FFD700",
    fontWeight: "bold",
    textAlign: "center",
    margin: 2,
    fontSize: 10,
    backgroundColor: "transparent"
  },
  backButton: {
    padding: 20,
    marginBottom: 4,
    backgroundColor: "indianred"
  }
});
