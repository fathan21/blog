import * as React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { TopNavigation } from "react-native-ui-kitten";
import { SafeAreaView as SafeAreaViewReactNavigation } from "react-navigation";
import { GeneralStatusBarColor } from "./GeneralStatusBarColor";

import { globalStyle } from "../assets/style";
import { logo, SearchImg, MenuImg } from "../assets/images";
import { TouchableOpacity } from "react-native-gesture-handler";

import { LocalNotification } from "../services/LocalPushController";
import RemotePushController from "../services/RemotePushController";

export class Header extends React.Component {
  state = {};
  componentWillMount() {}

  onSearchPress = () => {};
  openDrawer = () => {
    this.props.navigation.openDrawer();
  };
  renderLeftControl = () => {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {this.props.title == "Home" ? (
          <Image style={globalStyle.logo} source={logo.imageSource} />
        ) : (
          <Text style={{ color: "#ffffff", fontSize: 18 }}>
            {this.props.title}
          </Text>
        )}
      </View>
    );
  };
  renderRightControls = () => {
    return (
      <View style={{ display: "flex", flexDirection: "row" }}>
        <TouchableOpacity
          onPress={
            () => this.props.navigation.push("Search")
            //LocalNotification()
          }
        >
          <Image
            style={globalStyle.btnImgHeader}
            source={SearchImg.imageSource}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.openDrawer()}>
          <Image
            style={globalStyle.btnImgHeader}
            source={MenuImg.imageSource}
          />
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    const { theme } = this.props;
    return (
      <SafeAreaViewReactNavigation>
        <GeneralStatusBarColor
          backgroundColor={theme.PRIMARY_HEADER_BG}
          barStyle="light-content"
        />
        <TopNavigation
          alignment="start"
          style={{
            backgroundColor: theme.PRIMARY_HEADER_BG,
            marginBottom: 0,
            color: theme.PRIMARY_TEXT_COLOR,
          }}
          leftControl={this.renderLeftControl()}
          rightControls={this.renderRightControls()}
        />
        <RemotePushController />
      </SafeAreaViewReactNavigation>
    );
  }
}
