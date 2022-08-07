import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import FastImage from "react-native-fast-image";
import moment from "moment";
import Ionicons from "react-native-vector-icons/Ionicons";

import AppContext from "./../AppContext";
import getZipCode from "app/utils/zipcode";

import AvatarPlaceholder from "app/assets/images/avatar_placeholder.png";
import Location1Icon from "app/assets/images/location1_icon.png";
import Age1Icon from "app/assets/images/age1_icon.png";
import {colors, fonts} from "../../constants";

class ProfileHeader extends React.Component {
  handleEditPressed = () => {
    this.props.navigation.navigate("profile", { mode: "edit" });
  };

  handleViewPressed = () => {
    this.props.navigation.navigate("profile", { mode: "" });
  };

  render() {
    let { containerStyle } = this.props;
    let { user } = this.context;

    if (!user) {
      return null;
    }

    let fullName = ''
    if(user.hasOwnProperty('firstName')) {
      fullName = fullName + user.firstName + ' '
    }
    if(user.hasOwnProperty('lastName')) {
      fullName = fullName + user.lastName.charAt(0).toUpperCase() + '.'
    }

    let state = getZipCode(user.zipcode).name;

    return (
      <View style={[styles.container, containerStyle]}>
        <TouchableOpacity onPress={this.handleViewPressed}>
          <FastImage
            source={user.avatar ? { uri: user.avatar } : AvatarPlaceholder}
            style={styles.avatar}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <View style={styles.infoContainer}>
          <View style={styles.fullNameContainer}>
            <Text style={styles.fullName}>{fullName}</Text>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={this.handleEditPressed}
            >
              <Ionicons name="md-create" color="#41444b" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.briefContainer}>
            <Image
              style={styles.briefIcon}
              source={Location1Icon}
              resizeMode="contain"
            />
            <Text style={styles.briefText}>{state}</Text>
            <View style={styles.briefDivider} />
            <Image
              style={styles.briefIcon}
              source={Age1Icon}
              resizeMode="contain"
            />
            <Text style={styles.briefText}>
              {user.birthdate
                ? moment().year() - parseInt(user.birthdate.split("-")[2])
                : ""}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
  },
  infoContainer: {
    marginLeft: 20,
    alignItems: "center",
  },
  fullNameContainer: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  fullName: {
    fontFamily: fonts.family.HNMedium,
    fontSize: 24,
    letterSpacing: 2,
    color: colors.dark,
  },
  editBtn: {
    marginLeft: 10,
  },
  briefContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  briefIcon: {
    width: 16,
    height: 16,
    marginHorizontal: 5,
  },
  briefText: {
    fontFamily: fonts.family.HNLight,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.text_light_grey,
    marginHorizontal: 5,
  },
  briefDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.text_light_grey,
    marginHorizontal: 5,
  },
});

ProfileHeader.contextType = AppContext;

ProfileHeader.propTypes = {
  containerStyle: PropTypes.object,
  navigation: PropTypes.object,
};

export default ProfileHeader;
