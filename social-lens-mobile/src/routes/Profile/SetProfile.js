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
import ImagePicker from "react-native-image-crop-picker";
import ActionSheet from "react-native-actionsheet";
import FastImage from "react-native-fast-image";
import Video from "react-native-video";
import Dash from "react-native-dash";
import RNPickerSelect from "react-native-picker-select";
import CustomDatePicker from "../../components/CustomDatePicker";
import Icon from "react-native-vector-icons/Ionicons";
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
import { styles, pickerSelectStyles } from "./setStyles";
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

class SetProfile extends React.Component {
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
    this.options = [
      I18n.t('takePhoto'),
      I18n.t('chooseFromLibrary'),
      I18n.t('cancel'),
    ];
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user !== this.props.user) {
      this.setState({
        user: { ...this.props.user },
      });
    }
  }

  handleInputChanged = (key, value) => {
    let { user } = this.state;
    user[key] = value;
    this.setState({ user });
  };

  handleUploadMedia = () => {
    this.ActionSheet.show();
  };

  handleEditAvatar = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
    }).then(image => {
      let { user } = this.state;
      user.avatar = { uri: image.path };
      this.setState({ user });
    });
  };

  handleAddVideo = () => {
    ImagePicker.openPicker({
      mediaType: "video",
    }).then((video) => {
      let { user } = this.state;
      user.featuredVideo = { uri: video.path };
      this.setState({ user });
    });
  };

  handleRemoveVideo = () => {
    let { user } = this.state;
    user.featuredVideo = null;
    this.setState({ user });
  };

  handleEthnicityModal = () => {
    this.listModal.show();
  };

  setVideoPlayStatus = (status, uri) => {
    if (Platform.OS === "ios") {
      this.player.seek(0);
      this.setState({ videoPaused: status });
      if (!status) {
        this.player.presentFullscreenPlayer();
      }
    } else {
      this.setState(
        {
          currentUri: uri,
        },
        () => {
          this.videoModalRef.show();
        }
      );
    }
  };

  handleCancel = () => {
    this.props.switchView();
  };

  handleSave = async () => {
    let { user } = this.state;
    if (!user.firstName) {
      alert(I18n.t('firstNameProfile'));
      return;
    }
    if (!user.lastName) {
      alert(I18n.t('lastNameProfile'));
      return;
    }

    if (user.zipcode.length !== 0 && user.zipcode.length > 6) {
      alert(I18n.t('zipCodeLength'));
      return;
    }
    this.context.showLoading();
    await AuthController.updateUser(user);
    let data = await AuthController.getUser();
    this.context.setUser(data);
    this.props.switchView();
    this.context.hideLoading();
  };

  openCamera = () => {
    ImagePicker.openCamera({
    }).then(image => {
      let { user } = this.state;
      user.avatar = { uri: image.path };
      this.setState({ user });
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

  render() {
    let { user } = this.state;
    let ethnicityText = user.ethnicity
      ? user.ethnicity.map((item) => EthnicityList[item]).join(", ")
      : "";

    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        enableResetScrollToCoords={false}
        contentContainerStyle={styles.container}>
        <View style={styles.btnContainer}>
          <Button
            containerStyle={styles.cancelBtn}
            textStyle={styles.btnText}
            text={I18n.t('cancelProfile')}
            onPress={this.handleCancel}
          />
          <Button
            containerStyle={styles.saveBtn}
            textStyle={styles.btnText}
            text={I18n.t('save')}
            onPress={this.handleSave}
          />
        </View>
        <Text style={styles.title}>
          {I18n.t('completeProfile').toUpperCase()}
        </Text>
        <View style={styles.avatarContainer}>
          <FastImage
            source={
              user.avatar
                ? user.avatar.uri
                  ? user.avatar
                  : { uri: user.avatar }
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
            value={user.firstName}
            autoCapitalize="none"
            onChangeText={(value) =>
              this.handleInputChanged("firstName", value)
            }
          />
          <TextInput
            style={styles.input}
            placeholder={I18n.t('lastName')}
            placeholderTextColor="#c9c9c9"
            value={user.lastName}
            autoCapitalize="none"
            onChangeText={(value) => this.handleInputChanged("lastName", value)}
          />
          <TextInput
            editable={false}
            style={styles.input}
            placeholder={I18n.t('email')}
            placeholderTextColor="#c9c9c9"
            value={user.email}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.fullDivider} />
        <View style={styles.detailsContainer}>
          <View style={styles.socialmediaContainer}>
            <SocialMediaCircleButton
              containerStyle={styles.socialmediaBtn}
              type="facebook"
              touchable={true}
              enabled={user.facebookUrl ? true : false}
              onPress={() => this.facebookInput.show()}
            />
            <SocialMediaCircleButton
              containerStyle={styles.socialmediaBtn}
              type="twitter"
              enabled={user.twitterUrl ? true : false}
              touchable={true}
              onPress={() => this.twitterInput.show()}
            />
            <SocialMediaCircleButton
              containerStyle={styles.socialmediaBtn}
              type="youtube"
              enabled={user.youtubeUrl ? true : false}
              touchable={true}
              onPress={() => this.youtubeInput.show()}
            />
            <SocialMediaCircleButton
              containerStyle={styles.socialmediaBtn}
              type="instagram"
              enabled={user.instagramUrl ? true : false}
              touchable={true}
              onPress={() => this.instagramInput.show()}
            />
            <SocialMediaCircleButton
              containerStyle={styles.socialmediaBtn}
              type="linkedin"
              enabled={user.linkedinUrl ? true : false}
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
            {user.firstName} {user.lastName}
          </Text>
          <TextInput
            style={styles.summary}
            multiline={true}
            placeholder={I18n.t('describeYourself')}
            placeholderTextColor="#c9c9c9"
            value={user.summary}
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
                value={user.gender}
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
                selectedDate={user.birthdate}
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
                keyboardType="number-pad"
                value={user.zipcode == 0 ? "" : user.zipcode}
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
                value={user.employment}
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
                doneText={I18n.t('done')}
                style={pickerSelectStyles}
                placeholder={{
                  label: I18n.t('selectEducation'),
                  value: null,
                  color: "#c9c9c9",
                }}
                value={user.education}
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
                value={user.relationship}
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
                value={user.children}
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
                  {user.ethnicity && user.ethnicity.length > 0 ? (
                    <Text style={styles.infoText}>{ethnicityText}</Text>
                  ) : (
                      <Text style={styles.infoTextPlaceholder}>{I18n.t('selectEthnicity')}</Text>)}
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
              {!user.featuredVideo && (
                <TouchableOpacity onPress={this.handleAddVideo}>
                  <Icon
                    name="ios-add-circle-outline"
                    size={32}
                    color="#ff3660"
                  />
                </TouchableOpacity>
              )}
            </View>
            {user.featuredVideo && (
              <View style={styles.videoContainer}>
                <Video
                  ref={(ref) => (this.player = ref)}
                  style={styles.video}
                  source={
                    user.featuredVideo.uri
                      ? user.featuredVideo
                      : { uri: user.featuredVideo }
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
                        user.featuredVideo.uri
                          ? user.featuredVideo
                          : { uri: user.featuredVideo }
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
          selected={user.ethnicity ? user.ethnicity : ""}
          update={(value) => this.handleInputChanged("ethnicity", value)}
        />
        <InputModal
          ref={(ref) => (this.facebookInput = ref)}
          title={I18n.t('facebookProfile')}
          value={user.facebookUrl}
          update={(value) => this.handleInputChanged("facebookUrl", value)}
        />
        <InputModal
          ref={(ref) => (this.twitterInput = ref)}
          title={I18n.t('twitterProfile')}
          value={user.twitterUrl}
          update={(value) => this.handleInputChanged("twitterUrl", value)}
        />
        <InputModal
          ref={(ref) => (this.youtubeInput = ref)}
          title={I18n.t('youtubeProfile')}
          value={user.youtubeUrl}
          update={(value) => this.handleInputChanged("youtubeUrl", value)}
        />
        <InputModal
          ref={(ref) => (this.instagramInput = ref)}
          title={I18n.t('instagramProfile')}
          value={user.instagramUrl}
          update={(value) => this.handleInputChanged("instagramUrl", value)}
        />
        <InputModal
          ref={(ref) => (this.linkedinInput = ref)}
          title={I18n.t('linkedinProfile')}
          value={user.linkedinUrl}
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

SetProfile.contextType = AppContext;

SetProfile.propTypes = {
  navigation: PropTypes.object,
  user: PropTypes.object,
  switchView: PropTypes.func,
};

export default SetProfile;
