import React, { useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Image, ScrollView, Alert } from 'react-native';
import Container from '@src/components/Container';
import AvatarHeader from '@src/components/AvatarHeader';
import styles from './styles';
import translate from '@src/localize';
import CustomInfoList from '@src/components/CustomInfoList';
import { PERSONAL } from '@constants/icons';
import { CustomButton } from '@src/components/CustomButton';
import { upperCase } from 'lodash';
import { getFullName } from '@src/utils';
import { useDispatch } from 'react-redux';
import { deleteMember } from '@src/modules/Units/actions';
import NavigationActionsService from '@src/navigation/navigation';
import { IUnitMember } from '@reup/reup-api-sdk/libs/api/unit/member/models';
import { NEW_MEMBER, EDIT_MEMBER } from '@src/constants/screenKeys';

const MemberDetails = () => {
  const dispatch = useDispatch();
  const documentRef: any = useRef(null);
  const { unitId, memberItem } = useRoute<any>().params;
  const [member, setMember] = useState(memberItem);
  const displayName = getFullName(memberItem.member.first_name, memberItem.member.last_name);
  const onPressAvatar = () => {
    documentRef.current.show();
  };

  const firstNameField = {
    left: translate('member_detail.first_name'),
    right: member.member.first_name
  };
  const lastNameField = {
    left: translate('member_detail.last_name'),
    right: member.member.last_name
  };
  const roleField = {
    left: translate('member_detail.role'),
    right: member.role
  };
  const emailField = {
    left: translate('member_detail.email'),
    right: member.member.email
  };
  const phoneField = {
    left: translate('member_detail.phone'),
    right: (member.member.phone_code ? member.member.phone_code : "") + member.member.phone
  };

  const personalDetailsData: any[] = [];
  if (member.member.first_name) {
    personalDetailsData.push(firstNameField);
  };
  if (member.member.last_name) {
    personalDetailsData.push(lastNameField);
  };
  personalDetailsData.push(roleField);
  if (member.member.email) {
    personalDetailsData.push(emailField);
  };
  if (member.member.phone) {
    personalDetailsData.push(phoneField);
  };

  const updateSuccess = (member: any) => {
    setMember(member);
  };

  const onPressEdit = (item: IUnitMember) => {
    NavigationActionsService.push(EDIT_MEMBER, { item, unitId, updateSuccess });
  };

  const _handleDelete = () => {
    if (unitId && member.id) {
      NavigationActionsService.showLoading();
      dispatch(deleteMember({
        unitId: unitId,
        id: member.id,
        onSuccess: () => {
          NavigationActionsService.hideLoading();
          NavigationActionsService.pop();
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      }));
    }
  };

  const onDeleteMember = () => {
    Alert.alert(translate('alert.delete'), translate('alert.message_delete'), [
      {
        text: translate('alert.delete'),
        style: 'default',
        onPress: () => {
          _handleDelete();
        },
      },
      {
        text: translate('alert.cancel'),
        style: 'cancel',
        onPress: () => undefined,
      },
    ]);
  };

  const renderPersonalDetailList = () => {
    const title = translate('member_detail.title_section_header');
    return <CustomInfoList
      isShowEdit={true}
      onPressEdit={onPressEdit.bind(undefined, member)}
      titleText={title}
      listData={personalDetailsData}
      titleImage={PERSONAL}
      titleTextStyle={{ fontSize: 13 }}
    />;
  };

  const renderBottomButton = () => (
    <View style={styles.bottomButtonView}>
      <CustomButton
        textStyle={styles.textDeleteButton}
        text={upperCase(translate('member_detail.delete_member'))}
        style={[styles.widthButton, styles.deleteButton]}
        onPress={onDeleteMember}
      />
    </View>
  );

  return (
    <Container barStyle={'light-content'} spaceBottom={true}>
      {
        <AvatarHeader
          avatar={member.member.avatar}
          onPress={onPressAvatar}
          name={displayName}
          description={member.role}
        />
      }
      <ScrollView style={styles.container}>
        {renderPersonalDetailList()}
      </ScrollView>
      {renderBottomButton()}
    </Container>
  );
};

export default MemberDetails;
