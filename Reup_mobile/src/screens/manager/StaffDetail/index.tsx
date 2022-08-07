import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import styles from './styles';
import AvatarHeader from '@src/components/AvatarHeader';
import { PERSONAL, CONTACT } from '@src/constants/icons';
import { CustomButton } from '@src/components/CustomButton';
import translate from '@src/localize';
import Container from '@src/components/Container';
import CustomInfoList from '@src/components/CustomInfoList';
import { useRoute } from '@react-navigation/native';
import { getFullName, getFirstName, getLastName, getUserNameFromMail } from '@src/utils';
import NavigationActionsService from '@src/navigation/navigation';
import { useDispatch } from 'react-redux';
import { removeStaff } from '@src/modules/Company/actions';

export type ProfileFields = {
  left: string,
  right: string,
}

export type StaffDetailData = {
  avatar: string,
  displayName: string,
  position: string,
  personalDetailsData: ProfileFields[],
  contactDetailsList: ProfileFields[],
}

const StaffDetail = () => {
  const route = useRoute();
  const { staffDetail, flatList } = route.params as any;
  const [staffDetailData, setStaffDetailData] = useState<StaffDetailData>({
    avatar: "",
    displayName: "",
    position: "",
    personalDetailsData: [],
    contactDetailsList: [],
  });

  const dispatch = useDispatch();

  const _getFirstName = (email: string) => {
    let firstName = '';
    if (staffDetail.user.first_name) {
      firstName = staffDetail.user.first_name;
    } else {
      firstName = getFirstName(email);
    }
    return firstName;
  };

  const _getLastName = (email: string) => {
    let lastName = '';
    if (staffDetail.user.last_name) {
      lastName = staffDetail.user.last_name;
    } else {
      lastName = getLastName(email);
    }
    return lastName;
  };

  const firstNameField = {
    left: translate("staff.first_name"),
    right: _getFirstName(staffDetail.user.email),
  };
  const lastNameField = {
    left: translate("staff.last_name"),
    right: _getLastName(staffDetail.user.email),
  };

  const DOBField = {
    left: translate("staff.dob"),
    right: staffDetail.user.date_of_birth,
  };

  const idTypeField = {
    left: translate("staff.id_type"),
    right: staffDetail.user.identity_type_display
  };

  const idNumberField = {
    left: translate("staff.id_number"),
    right: staffDetail.user.identity_code
  };

  const telephoneField = {
    left: translate("staff.telephone"),
    right: staffDetail.user.phone,
  };

  const cellPhoneField = {
    left: translate("staff.cellphone"),
    right: staffDetail.user.phone1,
  };

  const emailField = {
    left: translate("staff.email"),
    right: staffDetail.user.email,
  };

  const addressField = {
    left: translate("staff.address"),
    right: staffDetail.user.address,
  };

  useEffect(() => {

    const displayProfile: ProfileFields[] = [];
    if (_getFirstName(staffDetail.user.email)) {
      displayProfile.push(firstNameField);
    }
    if (_getLastName(staffDetail.user.email)) {
      displayProfile.push(lastNameField);
    }
    if (staffDetail.user.date_of_birth) {
      displayProfile.push(DOBField);
    };
    if (staffDetail.user.identity_type_display) {
      displayProfile.push(idTypeField);
    };
    if (staffDetail.user.identity_code) {
      displayProfile.push(idNumberField);
    };

    const displayContact: ProfileFields[] = [];
    if (staffDetail.user.phone) {
      displayContact.push(telephoneField);
    }
    if (staffDetail.user.phone1) {
      displayContact.push(cellPhoneField);
    }
    if (staffDetail.user.email) {
      displayContact.push(emailField);
    }
    if (staffDetail.user.address) {
      displayContact.push(addressField);
    }

    let displayName = getFullName(staffDetail.user.first_name, staffDetail.user.last_name);
    if (!staffDetail.user.first_name && !staffDetail.user.last_name) {
      displayName = getUserNameFromMail(staffDetail.user.email);
    }

    let position = staffDetail.position && staffDetail.position.name ? staffDetail.position.name : "";
    if (!position) {
      position = staffDetail.role.name;
    }

    const data: StaffDetailData = {
      avatar: staffDetail.user.avatar ? staffDetail.user.avatar : "",
      displayName,
      position,
      personalDetailsData: displayProfile,
      contactDetailsList: displayContact,
    };

    setStaffDetailData(data);
  }, [staffDetail]);

  const renderPersonalDetailList = () => {
    const title = translate('tenant_detail.personal_details');

    return <CustomInfoList
      titleText={title}
      listData={staffDetailData.personalDetailsData}
      titleImage={PERSONAL}
      titleTextStyle={{ fontSize: 13 }} />;
  };

  const renderContactList = () => {
    const title = translate('tenant_detail.contact_details');

    return <CustomInfoList
      titleText={title}
      listData={staffDetailData.contactDetailsList}
      titleImage={CONTACT}
      titleTextStyle={{ fontSize: 13 }} />;
  };

  const onDeleteItem = () => {
    Alert.alert(translate('alert.title_confirm'), translate('alert.message_delete'), [
      {
        text: translate('alert.delete'),
        style: 'default',
        onPress: () => {
          onDeleteStaff();
        },
      },
      {
        text: translate('alert.cancel'),
        style: 'cancel',
        onPress: () => undefined,
      },
    ]);
  };

  const onDeleteStaff = () => {
    const currentCompanyId = staffDetail.company ? staffDetail.company : "";
    const userId = staffDetail.id ? staffDetail.id : "";

    NavigationActionsService.showLoading();
    dispatch(removeStaff({
      companyId: currentCompanyId,
      id: userId,
      onSuccess: (data) => {
        NavigationActionsService.hideLoading();
        flatList && flatList.current && flatList.current.reloadData();
        NavigationActionsService.pop();
        console.log("===== remove staff: ", data);
      },
      onFail: error => {
        NavigationActionsService.hideLoading();
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }));
  };


  return (
    <Container barStyle={'light-content'} spaceBottom={true}>
      <View style={styles.container}>
        <AvatarHeader
          avatar={staffDetailData.avatar}
          isShowEditAvatar={false}
          name={staffDetailData.displayName}
          description={staffDetailData.position}
        />
        <ScrollView>
          {renderPersonalDetailList()}
          {renderContactList()}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <CustomButton text={translate('staff_detail.delete_staff')} style={styles.button} textStyle={styles.text} onPress={onDeleteItem} />
        </View>
      </View>
    </Container >
  );
};

export default StaffDetail;
