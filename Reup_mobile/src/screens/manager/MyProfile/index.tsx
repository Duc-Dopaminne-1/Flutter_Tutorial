import React, { useRef } from 'react';
import { ScrollView, Alert, Platform, View } from "react-native";
import CustomInfoList from "@src/components/CustomInfoList";
import PERSONAL_DETAIL from '@res/icons/personal.png';
import CONTACT_DETAIL from '@res/icons/contact.png';
import styles from './styles';
import Container from '@src/components/Container';
import translate from '@src/localize';
import AvatarHeader from '@src/components/AvatarHeader';
import DocumentPickerImage from '@src/components/DocumentPickerImage';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { getFullName } from '@src/utils';
import { uploadImage, updateProfile } from '@src/modules/auth/actions';
import { ObjDropdown } from '@src/components/Dropdown/DropdownNative';
import NavigationActionsService from '@src/navigation/navigation';
import { EDIT_PROFILE } from '@src/constants/screenKeys';
import { IUserProfile, IDType } from '@reup/reup-api-sdk/libs/api/user/models';
import { formatDateWith } from '@src/utils/date';
import moment from 'moment';
import { Config } from '@src/configs/appConfig';
interface Props {

}
export enum EditType {
  PERSONAL,
  CONTACT,
  CREDIT_CARD
}

const MyProfile = (props: Props) => {
  const dispatch = useDispatch();
  const documentRef: any = useRef(null);
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const idType = useSelector<RootState, IDType[]>((state: RootState) => state.config.idType!);


  // PERSONAL DETAILS DATA
  const firstnameField = {
    left: 'First Name',
    right: me && me.first_name
  }

  const lastnameField = {
    left: 'Last Name',
    right: me && me.last_name
  }

  const DOBField = {
    left: 'Date of birth',
    right: me && me.date_of_birth ? formatDateWith(me.date_of_birth, Config.Manager.formatDateDisplay, Config.Manager.formatDate) : null
  }

  const idTypeField = {
    left: 'ID Type',
    right: idType.find(item => item.id === me.identity_type)?.title
  }

  const idCodeField = {
    left: 'ID No',
    right: me && me.identity_code
  }

  // CONTACT DETAILS DATA
  const telephoneField = {
    left: 'Telephone',
    right: me && me.phone ? (me.phone_code ? me.phone_code : "") + me.phone : ''
  }

  const cellphoneField = {
    left: 'Cellphone',
    right: me && me.phone1 ? (me.phone1_code ? me.phone1_code : "") + me.phone1 : ''
  }

  const emailField = {
    left: 'Email',
    right: me && me.email
  }

  const addressField = {
    left: 'Address',
    right: me && me.address
  }

  const personalDetailsData: any[] = [];
  if (me) {
    if (me.first_name) {
      personalDetailsData.push(firstnameField)
    }
    if (me.last_name) {
      personalDetailsData.push(lastnameField)
    }
    if (me.date_of_birth) {
      personalDetailsData.push(DOBField)
    }
    if (me.identity_type) {
      personalDetailsData.push(idTypeField)
    }
    if (me.identity_code) {
      personalDetailsData.push(idCodeField)
    }
  }

  const contactDetailsList: any[] = []
  if (me) {
    if (me.phone) {
      contactDetailsList.push(telephoneField)
    }
    if (me.phone1) {
      contactDetailsList.push(cellphoneField)
    }
    if (me.email) {
      contactDetailsList.push(emailField)
    }
    if (me.address) {
      contactDetailsList.push(addressField)
    }
  }

  const renderPersonalDetailList = () => {
    const title = translate('my_profile.personal_details');

    return (
      <CustomInfoList
        isShowEdit={true}
        onPressEdit={onPressDirectEditProfile.bind(undefined, EditType.PERSONAL)}
        titleText={title}
        listData={personalDetailsData}
        titleImage={PERSONAL_DETAIL}
      />
    );
  };

  const onPressDirectEditProfile = (type: EditType) => {
    NavigationActionsService.push(EDIT_PROFILE, { typeEdit: type })
  }

  const data: ObjDropdown[] =
    [
      { _key: "VINHOME 1", _value: "VINHOME 1" },
      { _key: "VINHOME 2", _value: "VINHOME 2" },
      { _key: "VINHOME CENTRAL PARK  3", _value: "VINHOME CENTRAL PARK  3" }
    ]

  const renderContactList = () => {
    const title = translate('my_profile.contact_details');

    return (
      <CustomInfoList
        titleText={title}
        isShowEdit={true}
        onPressEdit={onPressDirectEditProfile.bind(undefined, EditType.CONTACT)}
        listData={contactDetailsList}
        titleImage={CONTACT_DETAIL}
      />
    );
  };


  // const renderCreditCardList = () => {
  //   const title = translate('my_profile.creditcard');

  //   return (
  //     <CustomInfoList
  //       titleText={title}
  //       isShowEdit={true}
  //       onPressEdit={onPressDirectEditProfile.bind(undefined, EditType.CREDIT_CARD)}
  //       listData={creditCardList}
  //       titleImage={CREDIT_CARD}
  //     />
  //   );
  // };

  const onPressAvatar = () => {
    documentRef.current.show();
  };

  const renderPicker = () => (
    <DocumentPickerImage
      ref={documentRef}
      onCompleted={onCompletedPicker} />
  );

  const onCompletedPicker = (imageResponse: any) => {
    let file = {};
    if (imageResponse) {
      file = {
        uri: imageResponse.path,
        type: imageResponse.mime,
        name: moment().valueOf().toString() + ".jpg"
      };
    }
    const formData = new FormData();
    formData.append("folder_name", 'media/photos');
    formData.append('file', file);
    NavigationActionsService.showLoading();
    dispatch(
      uploadImage({
        data: formData,
        progress: () => { },
        onSuccess: (data) => {
          onChangeAvatar(data.url)
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        },
      }),
    );
  };

  const onChangeAvatar = (url: string) => {
    dispatch(
      updateProfile({
        data: {
          avatar: url
        },
        onSuccess: () => {
          NavigationActionsService.hideLoading();
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        },
      }))
  }

  const getName = () => {
    if (!me) {
      return ''
    }
    if (me.first_name && !me.last_name) {

      return '';
    }
    return getFullName(me.first_name, me.last_name);
  }

  const renderMainView = () => {
    const company = me && me.default_company && me.default_company.name
    return (
      <Container barStyle={'light-content'}>
        {<AvatarHeader
          onPress={onPressAvatar}
          isShowEditAvatar={true}
          name={getName()}
          description={company ?? ''}
          hasDropDown={false}
          dataDropDown={data}
          avatar={me && me.avatar} />}
        <ScrollView
          bounces={false}
          style={styles.container}
          contentContainerStyle={styles.containerScrollView} >
          {renderPersonalDetailList()}
          {renderContactList()}
          {/* {renderCreditCardList()} */}
          {renderPicker()}
        </ScrollView>
      </Container>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {renderMainView()}
    </View>
  );
};

export default React.memo(MyProfile);
