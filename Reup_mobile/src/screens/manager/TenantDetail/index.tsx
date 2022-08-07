
import React, { useRef, useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, ScrollView, Alert } from 'react-native';
import Container from '@src/components/Container';
import AvatarHeader from '@src/components/AvatarHeader';
import styles from './styles';
import translate from '@src/localize';
import CustomInfoList from '@src/components/CustomInfoList';
import { PERSONAL, CONTACT } from '@constants/icons';
import { CustomButton } from '@src/components/CustomButton';
import RoleType from '../Tenant/enum';
import NavigationActionsService from '@src/navigation/navigation';
import { ProfileFields } from '../StaffDetail';
import { getFullName, getTenantAddress } from '@src/utils';
import { useDispatch, useSelector } from 'react-redux';
import { removeTenant } from '@src/modules/Company/actions';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';

export type TenantDetailData = {
  avatar: string,
  displayName: string,
  position: string,
  personalDetailsData: ProfileFields[],
  contactDetailsList: ProfileFields[],
}

const TenantDetail = () => {
  const documentRef: any = useRef(null);
  const { item, role, flatList } = useRoute<any>().params;

  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const defaultCompanyId = me.default_company.id ?? '';

  const [tenantDetail, setTenantDetailData] = useState<TenantDetailData>({
    avatar: "",
    displayName: "",
    position: "",
    personalDetailsData: [],
    contactDetailsList: [],
  })
  const dispatch = useDispatch()

  const firstNameField = {
    left: translate("tenant_detail.first_name"),
    right: item.member.first_name,
  }
  const lastNameField = {
    left: translate("tenant_detail.last_name"),
    right: item.member.last_name,
  }

  const DOBField = {
    left: translate("tenant_detail.dob"),
    right: item.member.date_of_birth,
  }

  const cardNumberField = {
    left: translate("tenant_detail.credit_card_number"),
    right: item.member.credit_card,
  }

  const idTypeField = {
    left: translate("tenant_detail.id_type"),
    right: item.member.identity_type,
  }

  const idNumberField = {
    left: translate("tenant_detail.id_number"),
    right: item.member.identity_code,
  }

  const telephoneField = {
    left: translate("tenant_detail.telephone"),
    right: item.member.phone,
  }

  const cellPhoneField = {
    left: translate("tenant_detail.cellphone"),
    right: item.member.phone1,
  }

  const emailField = {
    left: translate("tenant_detail.email"),
    right: item.member.email,
  }

  const addressField = {
    left: translate("tenant_detail.address"),
    right: item.member.address,
  }

  useEffect(() => {
    const displayProfile: ProfileFields[] = [];
    if (item.member.first_name) {
      displayProfile.push(firstNameField)
    }
    if (item.member.last_name) {
      displayProfile.push(lastNameField)
    }
    if (item.member.date_of_birth) {
      displayProfile.push(DOBField)
    }
    if (item.member.credit_card) {
      displayProfile.push(cardNumberField)
    }
    if (item.member.identity_type) {
      displayProfile.push(idTypeField)
    }
    if (item.member.identity_code) {
      displayProfile.push(idNumberField)
    }

    const displayContact: ProfileFields[] = [];
    if (item.member.phone) {
      displayContact.push(telephoneField)
    }
    if (item.member.phone1) {
      displayContact.push(cellPhoneField)
    }
    if (item.member.email) {
      displayContact.push(emailField)
    }
    if (item.member.address) {
      displayContact.push(addressField)
    }

    const data: TenantDetailData = {
      avatar: item.member.avatar ? item.member.avatar : "",
      displayName: getFullName(item.member.first_name, item.member.last_name),
      position: item.unit ? getTenantAddress(item.unit.block, item.unit.floor, item.unit.code) : "",
      personalDetailsData: displayProfile,
      contactDetailsList: displayContact,
    }

    setTenantDetailData(data)
  }, [item])

  const onDeleteItem = () => {
    Alert.alert(translate('alert.title_confirm'), translate('alert.message_delete'), [
      {
        text: translate('alert.delete'),
        style: 'default',
        onPress: () => {
          onRemoveTenant()
        },
      },
      {
        text: translate('alert.cancel'),
        style: 'cancel',
        onPress: () => undefined,
      },
    ]);
  }

  const onRemoveTenant = () => {
    const userId = item.id ? item.id : ""

    NavigationActionsService.showLoading()
    dispatch(removeTenant({
      companyId: defaultCompanyId,
      id: userId,
      onSuccess: (data) => {
        NavigationActionsService.hideLoading()
        flatList && flatList.current && flatList.current.reloadData()
        NavigationActionsService.pop()
        console.log("===== remove tenants: ", data)
      },
      onFail: error => {
        NavigationActionsService.hideLoading()
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }))
  }

  const onPressAvatar = () => {
    documentRef.current.show();
  };

  const renderPersonalDetailList = () => {
    const title = translate('tenant_detail.personal_details');

    return <CustomInfoList titleText={title} listData={tenantDetail.personalDetailsData} titleImage={PERSONAL} titleTextStyle={{ fontSize: 13 }} />;
  };

  const renderContactList = () => {
    const title = translate('tenant_detail.contact_details');

    return <CustomInfoList titleText={title} listData={tenantDetail.contactDetailsList} titleImage={CONTACT} titleTextStyle={{ fontSize: 13 }} />;
  };

  const renderBottomButton = () => (
    <View style={styles.bottomButtonView}>
      <CustomButton
        textStyle={styles.textDeleteButton}
        text={translate('tenant_detail.delete_button')}
        style={[styles.widthButton, styles.deleteButton]}
        onPress={onDeleteItem}
      />
    </View>
  );

  return (
    <Container barStyle={'light-content'} spaceBottom={true}>
      {
        <AvatarHeader
          avatar={tenantDetail.avatar}
          onPress={onPressAvatar}
          name={tenantDetail.displayName}
          description={tenantDetail.position}
        />
      }
      <ScrollView style={styles.container}>
        {renderPersonalDetailList()}
        {renderContactList()}
      </ScrollView>
      {role === RoleType.management ? renderBottomButton() : null}
    </Container>
  );
};

export default TenantDetail;
