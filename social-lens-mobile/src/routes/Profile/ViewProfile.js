import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Video from "react-native-video";
import FastImage from "react-native-fast-image";
import Dash from "react-native-dash";
import moment from "moment";
import Ionicons from "react-native-vector-icons/Ionicons";
import I18n from 'app/i18n'
import {
  AppContext,
  SocialMediaCircleButton,
  VideoModal,
} from "app/components";
import {
  GenderList,
  EducationList,
  ChildrenList,
  RelationshipList,
  EthnicityList,
} from "app/constants";
import getZipCode from "app/utils/zipcode";

import styles from "./viewStyles";

import AvatarPlaceholder from "app/assets/images/avatar_placeholder.png";
import GenderIcon from "app/assets/images/gender_icon.png";
import AgeIcon from "app/assets/images/age_icon.png";
import LocationIcon from "app/assets/images/location_icon.png";
import EmploymentIcon from "app/assets/images/employment_icon.png";
import EducationIcon from "app/assets/images/education_icon.png";
import RelationshipIcon from "app/assets/images/relationship_icon.png";
import ChildrenIcon from "app/assets/images/children_icon.png";
import EthnicityIcon from "app/assets/images/ethnicity_icon.png";
import Location1Icon from "app/assets/images/location1_icon.png";
import Age1Icon from "app/assets/images/age1_icon.png";

class ViewProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: { ...props.user },
      videoPaused: true,
      currentUri: {},
    };

    this.genderList = GenderList.map((item, index) => ({
      value: index,
      label: item,
    }));
    this.childrenList = ChildrenList.map((item, index) => ({
      value: index,
      label: item,
    }));
    this.educationList = EducationList.map((item, index) => ({
      value: index,
      label: item,
    }));
    this.relationshipList = RelationshipList.map((item, index) => ({
      value: index,
      label: item,
    }));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.user !== prevProps.user) {
      this.setState({
        user: { ...this.props.user },
      });
    }
  }

  setVideoPlayStatus = (status, source) => {
    if (Platform.OS === "ios") {
      this.player.seek(0);
      this.setState({ videoPaused: status });
      if (!status) {
        this.player.presentFullscreenPlayer();
      }
    } else {
      this.setState(
        {
          currentUri: source,
        },
        () => {
          this.videoModalRef.show();
        }
      );
    }
  };

  openProfile = (type) => () => {
    let url = "";
    switch (type) {
      case "facebook":
        url = this.state.user.facebookUrl;
        break;
      case "twitter":
        url = this.state.user.twitterUrl;
        break;
      case "youtube":
        url = this.state.user.youtubeUrl;
        break;
      case "instagram":
        url = this.state.user.instagramUrl;
        break;
      case "linkedin":
        url = this.state.user.linkedinUrl;
        break;
      default:
        break;
    }
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) =>{
        alert(err.message)
      });
  };

  render() {
    let { switchView, logOut } = this.props;
    let { user } = this.state;
    let ethnicityText = user.ethnicity
      ? user.ethnicity.map((item) => EthnicityList[item]).join(", ")
      : "";

    let fullName = ''
    if(user.hasOwnProperty('firstName')) {
      fullName = fullName + user.firstName + ' '
    }
    if(user.hasOwnProperty('lastName')) {
      fullName = fullName + user.lastName.charAt(0).toUpperCase() + '.'
    }

    let state = getZipCode(user.zipcode).name;

    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <FastImage
          source={user.avatar ? { uri: user.avatar } : AvatarPlaceholder}
          style={styles.avatar}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.basicInfoContainer}>
          <View style={styles.fullNameContainer}>
            <Text style={styles.fullNameBig}>{fullName}</Text>
            <TouchableOpacity style={styles.editBtn} onPress={switchView}>
              <Ionicons name="md-create" color="#41444b" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.powerBtn} onPress={logOut}>
              <Ionicons name="md-power" color="#ff3660" size={24} />
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
        <View style={styles.fullDivider} />
        <View style={styles.detailsContainer}>
          <View style={styles.socialmediaContainer}>
            <SocialMediaCircleButton
              touchable={user.facebookUrl ? true : false}
              containerStyle={styles.socialmediaBtn}
              type="facebook"
              enabled={user.facebookUrl ? true : false}
              onPress={this.openProfile("facebook")}
            />
            <SocialMediaCircleButton
              touchable={user.twitterUrl ? true : false}
              containerStyle={styles.socialmediaBtn}
              type="twitter"
              enabled={user.twitterUrl ? true : false}
              onPress={this.openProfile("twitter")}
            />
            <SocialMediaCircleButton
              touchable={user.youtubeUrl ? true : false}
              containerStyle={styles.socialmediaBtn}
              type="youtube"
              enabled={user.youtubeUrl ? true : false}
              onPress={this.openProfile("youtube")}
            />
            <SocialMediaCircleButton
              touchable={user.instagramUrl ? true : false}
              containerStyle={styles.socialmediaBtn}
              type="instagram"
              enabled={user.instagramUrl ? true : false}
              onPress={this.openProfile("instagram")}
            />
            <SocialMediaCircleButton
              touchable={user.linkedinUrl ? true : false}
              containerStyle={styles.socialmediaBtn}
              type="linkedin"
              enabled={user.linkedinUrl ? true : false}
              onPress={this.openProfile("linkedin")}
            />
          </View>
          <Dash
            style={styles.divider}
            dashLength={2}
            dashGap={4}
            dashColor="#5c41444b"
          />
          <Text style={styles.fullNameSm}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.summary}>{user.summary}</Text>
          <Dash
            style={styles.divider}
            dashLength={2}
            dashGap={4}
            dashColor="#5c41444b"
          />
          <View style={styles.userInfoContainer}>
            <View style={styles.itemContainer}>
              <Image
                source={GenderIcon}
                style={styles.icon}
                resizeMode="contain"
              />
              <View style={styles.iconDivider} />
              <Text style={styles.label}>{I18n.t('gender')}:</Text>
              <Text style={styles.info}>{GenderList[user.gender]}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Image
                source={AgeIcon}
                style={styles.icon}
                resizeMode="contain"
              />
              <View style={styles.iconDivider} />
              <Text style={styles.label}>{I18n.t('birthdate')}:</Text>
              <Text style={styles.info}>
                {user.birthdate ? user.birthdate : ""}
              </Text>
            </View>
            <View style={styles.itemContainer}>
              <Image
                source={LocationIcon}
                style={styles.icon}
                resizeMode="contain"
              />
              <View style={styles.iconDivider} />
              <Text style={styles.label}>{I18n.t('zipcode')}:</Text>
              <Text style={styles.info}>
                {user.zipcode == 0 ? "" : user.zipcode}
              </Text>
            </View>
            <View style={styles.itemContainer}>
              <Image
                source={EmploymentIcon}
                style={styles.icon}
                resizeMode="contain"
              />
              <View style={styles.iconDivider} />
              <Text style={styles.label}>{I18n.t('employment')}:</Text>
              <Text style={styles.info}>{user.employment}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Image
                source={EducationIcon}
                style={styles.icon}
                resizeMode="contain"
              />
              <View style={styles.iconDivider} />
              <Text style={styles.label}>{I18n.t('education')}:</Text>
              <Text style={styles.info}>{EducationList[user.education]}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Image
                source={RelationshipIcon}
                style={styles.icon}
                resizeMode="contain"
              />
              <View style={styles.iconDivider} />
              <Text style={styles.label}>{I18n.t('relationshipStatus')}:</Text>
              <Text style={styles.info}>
                {RelationshipList[user.relationship]}
              </Text>
            </View>
            <View style={styles.itemContainer}>
              <Image
                source={ChildrenIcon}
                style={styles.icon}
                resizeMode="contain"
              />
              <View style={styles.iconDivider} />
              <Text style={styles.label}>{I18n.t('children')}:</Text>
              <Text style={styles.info}>{ChildrenList[user.children]}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Image
                source={EthnicityIcon}
                style={styles.icon}
                resizeMode="contain"
              />
              <View style={styles.iconDivider} />
              <Text style={styles.label}>{I18n.t('ethnicity')}:</Text>
              <Text style={styles.info}>{ethnicityText}</Text>
            </View>
          </View>
          <Dash
            style={styles.divider}
            dashLength={2}
            dashGap={4}
            dashColor="#5c41444b"
          />
          <View style={styles.featuredVideoContainer}>
            <Text style={styles.featured}>{I18n.t('featuredVideo')}</Text>
            {user.featuredVideo ? (
              <View style={styles.videoContainer}>
                <Video
                  ref={(ref) => (this.player = ref)}
                  style={styles.video}
                  source={{ uri: user.featuredVideo }}
                  paused={this.state.videoPaused}
                  onFullscreenPlayerDidDismiss={() =>
                    this.setVideoPlayStatus(true)
                  }
                />
                <View style={styles.videoOverlay}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setVideoPlayStatus(false, {
                        uri: user.featuredVideo,
                      })
                    }
                  >
                    <Ionicons
                      name="md-arrow-dropright-circle"
                      size={32}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text style={styles.videoText}>{I18n.t('noVideo')}</Text>
            )}
          </View>
        </View>
        <VideoModal
          ref={(ref) => (this.videoModalRef = ref)}
          uri={this.state.currentUri}
        />
      </KeyboardAwareScrollView>
    );
  }
}

ViewProfile.contextType = AppContext;

ViewProfile.propTypes = {
  navigation: PropTypes.object,
  switchView: PropTypes.func,
  logOut: PropTypes.func,
  user: PropTypes.object,
};

export default ViewProfile;
