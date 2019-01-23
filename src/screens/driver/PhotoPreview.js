import React from "react";
import PropTypes from "prop-types";
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView
} from "react-native";
import {
  Container,
  Content,
  Footer,
  FooterTab,
  Button,
  Text,
  Icon,
  Spinner
} from "native-base";
import { FileSystem } from "expo";

const pictureSize = 150;

export default class PhotoPreview extends React.Component {
  state = {
    photos: [],
    uploadingPhoto: false
  };
  static propTypes = {
    picture: PropTypes.string.isRequired
  };
  okButtonPress = () => {
    this.setState({ uploadingPhoto: true });
    this.props.onPressOk();
  };
  getImageDimensions = ({ width, height }) => {
    if (width > height) {
      const scaledHeight = (pictureSize * height) / width;
      return {
        width: pictureSize,
        height: scaledHeight,

        scaleX: pictureSize / width,
        scaleY: scaledHeight / height,

        offsetX: 0,
        offsetY: (pictureSize - scaledHeight) / 2
      };
    } else {
      const scaledWidth = (pictureSize * width) / height;
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
    const { picture } = this.props;
    const { vin } = this.props;

    return (
      <Container>
        <View style={styles.container}>
          <Image
            style={styles.picture}
            source={{
              uri: `${FileSystem.documentDirectory}photos${vin}/${picture}.jpg`
            }}
          />
        </View>
        <Footer>
          <FooterTab>
            <Button onPress={this.props.onPressUndo}>
              <Icon name="undo" />
            </Button>
            <Button onPress={() => this.okButtonPress()}>
              {this.state.uploadingPhoto ? (
                <Spinner color="blue" />
              ) : (
                <Icon name="arrow-forward" />
              )}
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch"
  },
  picture: {
    flex: 1
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
