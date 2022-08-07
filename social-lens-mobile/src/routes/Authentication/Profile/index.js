import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import firebase, { auth } from "react-native-firebase";
import ImagePicker from "react-native-image-crop-picker";
import FastImage from "react-native-fast-image";
import Video from "react-native-video";
import Dash from "react-native-dash";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/Ionicons";
import ActionSheet from "react-native-actionsheet";
import I18n from 'app/i18n'
import {
  AppContext,
  Button,
  SocialMediaCircleButton,
  ListModal,
  InputModal,
  VideoModal,
} from "app/components";
import { AuthController } from "app/controllers";
import { alert } from "app/utils/Alert";
import {
  GenderList,
  EducationList,
  ChildrenList,
  RelationshipList,
  EthnicityList,
} from "app/constants";

import { styles, pickerSelectStyles } from "./styles";

import AvatarPlaceholder from "app/assets/images/avatar_placeholder.png";
import EditIcon from "app/assets/images/edit_icon.png";
import GenderIcon from "app/assets/images/gender_icon.png";
import AgeIcon from "app/assets/images/age_icon.png";
import LocationIcon from "app/assets/images/location_icon.png";
import EmploymentIcon from "app/assets/images/employment_icon.png";
import EducationIcon from "app/assets/images/education_icon.png";
import RelationshipIcon from "app/assets/images/relationship_icon.png";
import ChildrenIcon from "app/assets/images/children_icon.png";
import EthnicityIcon from "app/assets/images/ethnicity_icon.png";
import Axios from "axios";
import CustomDatePicker from "../../../components/CustomDatePicker";
import {languageUSer} from "../../../i18n";
import Config from "react-native-config";

class SetProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      avatar: null,
      summary: "",
      // info
      gender: null,
      birthdate: "",
      zipcode: 0,
      employment: null,
      education: null,
      relationship: "",
      children: null,
      ethnicity: [],
      featuredVideo: null,
      // social media
      facebookUrl: "",
      twitterUrl: "",
      youtubeUrl: "",
      instagramUrl: "",
      linkedinUrl: "",
      // video play status
      videoPaused: true,
      currentUri: {},
    };

    if (props.navigation.state.params === undefined) {
      let user = firebase.auth().currentUser;
      this.state = {
        ...this.state,
        email: user.email,
      };
    } else {
      let userInfo = props.navigation.state.params.userInfo;
      let info = {
        email: userInfo.email,
      };
      if (userInfo.first_name) {
        info.firstName = userInfo.first_name;
      }
      if (userInfo.last_name) {
        info.lastName = userInfo.last_name;
      }
      if (userInfo.photo) {
        info.avatar = userInfo.photo;
      }
      this.state = {
        ...this.state,
        ...info,
      };
    }

    this.options = [
      I18n.t('takePhoto'),
      I18n.t('chooseFromLibrary'),
      I18n.t('cancel'),
    ];

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

  handleInputChanged = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  handleUploadMedia = () => {
    this.ActionSheet.show();
  };

  handleEditAvatar = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
    }).then(image => {
      this.setState({
        avatar: { uri: image.path },
      });
    });
  };

  openCamera = () => {
    ImagePicker.openCamera({
    }).then(image => {
      this.setState({
        avatar: { uri: image.path },
      });
    });
  }

  handleActionSheet = (index) => {
    switch (index) {
      case 0: // take a new photo
         this.openCamera()
        break;
      case 1: // select image from library
        this.handleEditAvatar()
        break;
      default:
        break;
    }
  };

  handleAddVideo = () => {
    ImagePicker.openPicker({
      mediaType: "video",
    }).then((video) => {
      this.setState({
        featuredVideo: { uri: video.path },
      });
    });
  };

  handleRemoveVideo = () => {
    this.setState({
      featuredVideo: null,
    });
  };

  handleEthnicityModal = () => {
    this.listModal.show();
  };

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

  handleSave = async () => {
    if (!this.state.firstName) {
      alert(I18n.t('firstNameProfile'));
      return;
    }
    if (!this.state.lastName) {
      alert(I18n.t('lastNameProfile'));
      return;
    }

    if (this.state.zipcode.length !== 0 && this.state.zipcode.length > 6) {
      alert(I18n.t('zipCodeLength'));
      return;
    }

    try {
      this.context.showLoading();
      await Axios.post(
          "https://us-central1-social-lens-3a3d5.cloudfunctions.net/verifyUser",
          {
            uid: auth().currentUser.uid,
          }
      );

      await AuthController.updateUser(this.state);

      let user = await AuthController.getUser();
      this.context.setUser(user);
      this.context.hideLoading();
     this.props.navigation.navigate("authenticated");
    } catch (error) {
      this.context.hideLoading();
      alert(error.toString());
    }
  };

  render() {
    let ethnicityText = this.state.ethnicity
      .map((item) => EthnicityList[item])
      .join(", ");

    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <Button
          containerStyle={styles.saveBtn}
          textStyle={styles.save}
          text={I18n.t('save')}
          onPress={this.handleSave}
        />
        <Text style={styles.title}>
          {I18n.t('completeProfile').toUpperCase()}
        </Text>
        <View style={styles.avatarContainer}>
          <FastImage
            source={
              this.state.avatar
                ? this.state.avatar.uri
                  ? this.state.avatar
                  : { uri: this.state.avatar }
                : AvatarPlaceholder
            }
            style={styles.avatar}
            resizeMode={FastImage.resizeMode.cover}
          />
          <TouchableOpacity
            style={styles.editBtn}
            onPress={this.handleUploadMedia}
          >
            <Image source={EditIcon} style={styles.edit} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <View style={styles.basicInfoContainer}>
          <TextInput
            style={styles.input}
            placeholder={I18n.t('firstName')}
            placeholderTextColor="#c9c9c9"
            value={this.state.firstName}
            autoCapitalize="none"
            onChangeText={(value) =>
              this.handleInputChanged("firstName", value)
            }
          />
          <TextInput
            style={styles.input}
            placeholder={I18n.t('lastName')}
            placeholderTextColor="#c9c9c9"
            value={this.state.lastName}
            autoCapitalize="none"
            onChangeText={(value) => this.handleInputChanged("lastName", value)}
          />
          <TextInput
            editable={false}
            style={styles.input}
            placeholderTextColor="#c9c9c9"
            placeholder={I18n.t('email')}
            value={this.state.email}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.fullDivider} />
        <View style={styles.detailsContainer}>
          <View style={styles.socialmediaContainer}>
            <SocialMediaCircleButton
              containerStyle={styles.socialmediaBtn}
              type="facebook"
              enabled={this.state.facebookUrl ? true : false}
              touchable={true}
              onPress={() => this.facebookInput.show()}
            />
            <SocialMediaCircleButton
              containerStyle={styles.socialmediaBtn}
              type="twitter"
              enabled={this.state.twitterUrl ? true : false}
              touchable={true}
              onPress={() => this.twitterInput.show()}
            />
            <SocialMediaCircleButton
              containerStyle={styles.socialmediaBtn}
              type="youtube"
              enabled={this.state.youtubeUrl ? true : false}
              touchable={true}
              onPress={() => this.youtubeInput.show()}
            />
            <SocialMediaCircleButton
              containerStyle={styles.socialmediaBtn}
              type="instagram"
              enabled={this.state.instagramUrl ? true : false}
              touchable={true}
              onPress={() => this.instagramInput.show()}
            />
            <SocialMediaCircleButton
              containerStyle={styles.socialmediaBtn}
              type="linkedin"
              enabled={this.state.linkedinUrl ? true : false}
              touchable={true}
              onPress={() => this.linkedinInput.show()}
            />
          </View>
          <Dash
            style={styles.divider}
            dashLength={2}
            dashGap={4}
            dashColor="#5c41444b"
          />
          <Text style={styles.fullname}>
            {this.state.firstName} {this.state.lastName}
          </Text>
          <TextInput
            style={styles.summary}
            multiline={true}
            placeholder={I18n.t('describeYourself')}
            placeholderTextColor="#c9c9c9"
            value={this.state.summary}
            autoCapitalize="none"
            onChangeText={(value) => this.handleInputChanged("summary", value)}
          />
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
              <RNPickerSelect
                items={this.genderList}
                useNativeAndroidPickerStyle={false}
                style={pickerSelectStyles}
                doneText={I18n.t('done')}
                placeholder={{
                  label: I18n.t('selectGender'),
                  value: null,
                  color: "#c9c9c9",
                }}
                value={this.state.gender}
                onValueChange={(value) =>
                  this.handleInputChanged("gender", value)
                }
              />
            </View>
            <View style={styles.itemContainer}>
              <Image
                source={AgeIcon}
                style={styles.icon}
                resizeMode="contain"
              />
              <View style={styles.iconDivider} />
              <Text style={styles.label}>{I18n.t('birthdate')}:</Text>
              <CustomDatePicker
                onDatePicked={(date) =>
                  this.handleInputChanged("birthdate", date)
                }
              />
            </View>
            <View style={styles.itemContainer}>
              <Image
                source={LocationIcon}
                style={styles.icon}
                resizeMode="contain"
              />
              <View style={styles.iconDivider} />
              <Text style={styles.label}>{I18n.t('zipcode')}:</Text>
              <TextInput
                style={styles.infoInput}
                placeholder={I18n.t('typeZipcode')}
                placeholderTextColor="#c9c9c9"
                autoCapitalize="none"
                keyboardType="number-pad"
                value={this.state.zipcode}
                onChangeText={(value) =>
                  this.handleInputChanged("zipcode", value)
                }
              />
            </View>
            <View style={styles.itemContainer}>
              <Image
                source={EmploymentIcon}
                style={styles.icon}
                resizeMode="contain"
              />
              <View style={styles.iconDivider} />
              <Text style={styles.label}>{I18n.t('employment')}:</Text>
              <TextInput
                style={styles.infoInput}
                placeholder={I18n.t('typeEmployment')}
                placeholderTextColor="#c9c9c9"
                autoCapitalize="none"
                value={this.state.employment}
                onChangeText={(value) =>
                  this.handleInputChanged("employment", value)
                }
              />
            </View>
            <View style={styles.itemContainer}>
              <Image
                source={EducationIcon}
                style={styles.icon}
                resizeMode="contain"
              />
              <View style={styles.iconDivider} />
              <Text style={styles.label}>{I18n.t('education')}:</Text>
              <RNPickerSelect
                items={this.educationList}
                useNativeAndroidPickerStyle={false}
                style={pickerSelectStyles}
                doneText={I18n.t('done')}
                placeholder={{
                  label: I18n.t('selectEducation'),
                  value: null,
                  color: "#c9c9c9",
                }}
                value={this.state.education}
                onValueChange={(value) =>
                  this.handleInputChanged("education", value)
                }
              />
            </View>
            <View style={styles.itemContainer}>
              <Image
                source={RelationshipIcon}
                style={styles.icon}
                resizeMode="contain"
              />
              <View style={styles.iconDivider} />
              <Text style={styles.label}>{I18n.t('relationshipStatus')}:</Text>
              <RNPickerSelect
                items={this.relationshipList}
                useNativeAndroidPickerStyle={false}
                style={pickerSelectStyles}
                doneText={I18n.t('done')}
                placeholder={{
                  label: I18n.t('selectRelationship'),
                  value: null,
                  color: "#c9c9c9",
                }}
                value={this.state.relationship}
                onValueChange={(value) =>
                  this.handleInputChanged("relationship", value)
                }
              />
            </View>
            <View style={styles.itemContainer}>
              <Image
                source={ChildrenIcon}
                style={styles.icon}
                resizeMode="contain"
              />
              <View style={styles.iconDivider} />
              <Text style={styles.label}>{I18n.t('children')}:</Text>
              <RNPickerSelect
                items={this.childrenList}
                useNativeAndroidPickerStyle={false}
                style={pickerSelectStyles}
                doneText={I18n.t('done')}
                placeholder={{
                  label: I18n.t('selectChildren'),
                  value: null,
                  color: "#c9c9c9",
                }}
                value={this.state.children}
                onValueChange={(value) =>
                  this.handleInputChanged("children", value)
                }
              />
            </View>
            <View style={styles.itemContainer}>
              <Image
                source={EthnicityIcon}
                style={styles.icon}
                resizeMode="contain"
              />
              <View style={styles.iconDivider} />
              <Text style={styles.label}>{I18n.t('ethnicity')}:</Text>
              <TouchableWithoutFeedback onPress={this.handleEthnicityModal}>
                <View style={styles.infoTextContainer}>
                  {this.state.ethnicity.length > 0 ? (
                    <Text style={styles.infoText}>{ethnicityText}</Text>
                  ) : (
                      <Text style={styles.infoTextPlaceholder}>{I18n.t('selectEthnicity')}</Text>
                    )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <Dash
            style={styles.divider}
            dashLength={2}
            dashGap={4}
            dashColor="#5c41444b"
          />
          <View style={styles.featuredVideoContainer}>
            <View style={styles.featuredVideoHeader}>
              <Text style={styles.featured}>{I18n.t('featuredVideoEdit')}</Text>
              {!this.state.featuredVideo && (
                <TouchableOpacity onPress={this.handleAddVideo}>
                  <Icon
                    name="ios-add-circle-outline"
                    size={32}
                    color="#ff3660"
                  />
                </TouchableOpacity>
              )}
            </View>
            {this.state.featuredVideo && (
              <View style={styles.videoContainer}>
                <Video
                  ref={(ref) => (this.player = ref)}
                  style={styles.video}
                  source={
                    this.state.featuredVideo.uri
                      ? this.state.featuredVideo
                      : { uri: this.state.featuredVideo }
                  }
                  paused={this.state.videoPaused}
                  onFullscreenPlayerDidDismiss={() =>
                    this.setVideoPlayStatus(true)
                  }
                />
                <View style={styles.videoOverlay}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setVideoPlayStatus(
                        false,
                        this.state.featuredVideo.uri
                          ? this.state.featuredVideo
                          : { uri: this.state.featuredVideo }
                      )
                    }
                  >
                    <Icon
                      name="md-arrow-dropright-circle"
                      size={40}
                      color="#fff"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={this.handleRemoveVideo}
                  >
                    <Icon
                      name="ios-close-circle-outline"
                      size={32}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
        <ListModal
          ref={(r) => (this.listModal = r)}
          data={EthnicityList}
          selected={this.state.ethnicity}
          update={(value) => this.handleInputChanged("ethnicity", value)}
        />
        <InputModal
          ref={(ref) => (this.facebookInput = ref)}
          title={I18n.t('facebookProfile')}
          value={this.state.facebookUrl}
          update={(value) => this.handleInputChanged("facebookUrl", value)}
        />
        <InputModal
          ref={(ref) => (this.twitterInput = ref)}
          title={I18n.t('twitterProfile')}
          value={this.state.twitterUrl}
          update={(value) => this.handleInputChanged("twitterUrl", value)}
        />
        <InputModal
          ref={(ref) => (this.youtubeInput = ref)}
          title={I18n.t('youtubeProfile')}
          value={this.state.youtubeUrl}
          update={(value) => this.handleInputChanged("youtubeUrl", value)}
        />
        <InputModal
          ref={(ref) => (this.instagramInput = ref)}
          title={I18n.t('instagramProfile')}
          value={this.state.instagramUrl}
          update={(value) => this.handleInputChanged("instagramUrl", value)}
        />
        <InputModal
          ref={(ref) => (this.linkedinInput = ref)}
          title={I18n.t('linkedinProfile')}
          value={this.state.linkedinUrl}
          update={(value) => this.handleInputChanged("linkedinUrl", value)}
        />
        <VideoModal
          ref={(ref) => (this.videoModalRef = ref)}
          uri={this.state.currentUri}
        />
        <ActionSheet
            ref={(ref) => (this.ActionSheet = ref)}
            title={I18n.t('selectAvatar')}
            options={this.options}
            cancelButtonIndex={2}
            onPress={this.handleActionSheet}
        />
      </KeyboardAwareScrollView>
    );
  }
}

SetProfileScreen.contextType = AppContext;

SetProfileScreen.propTypes = {
  navigation: PropTypes.object,
};

export default SetProfileScreen;
