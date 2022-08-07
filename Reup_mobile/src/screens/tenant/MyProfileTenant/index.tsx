import React, { useRef, useState } from 'react'
import { ScrollView, Alert, View, Image } from "react-native"
import CustomInfoList from "@src/components/CustomInfoList"
import PERSONAL_DETAIL from '@res/icons/personal.png'
import CONTACT_DETAIL from '@res/icons/contact.png'
import styles from './styles'
import Container from '@src/components/Container'
import translate from '@src/localize'
import AvatarHeader from '@src/components/AvatarHeader'
import DocumentPickerImage from '@src/components/DocumentPickerImage'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@src/types/types'
import { getUserName } from '@src/utils'
import { uploadImage, updateProfile } from '@src/modules/auth/actions'
import NavigationActionsService from '@src/navigation/navigation'
import { EDIT_PROFILE_TENANT, APARTMENT_DETAILS_TENANT } from '@src/constants/screenKeys'
import { IUserProfile, IDType } from '@reup/reup-api-sdk/libs/api/user/models'
import { formatApiToUI } from '@src/utils/date'
import moment from 'moment'
import { getUnitListMe } from '@src/modules/Units/actions'
import { LimitGetAll } from '@src/constants/vars'
import { CustomFlatList } from '@src/components/FlatList'
import { upperCase } from 'lodash'
import IC_APARTMENT from '@src/res/icons/icon_apartment.png';
import CustomSectionHeader from '@src/components/CustomSection';
import LINE from '@res/icons/ForLeaseForSale/image-line-dot.png';
import ApartmentItem from '@src/components/FlatListItem/ApartmentItem'
import { IUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model'

export enum EditType {
  PERSONAL,
  CONTACT,
  CREDIT_CARD
}

const MyProfileTenant = () => {
  const dispatch = useDispatch()
  const documentRef: any = useRef(null)
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!)
  const idType = useSelector<RootState, IDType[]>((state: RootState) => state.config.idType!)
  const flatList = useRef<any>(null)
  const [apartmentList, setApartmentList] = useState<IUnit[]>([])

  // PERSONAL DETAILS DATA
  const firstNameField = {
    left: translate('my_profile.first_name'),
    right: me && me.first_name
  }

  const lastNameField = {
    left: translate('my_profile.last_name'),
    right: me && me.last_name
  }

  const DOBField = {
    left: translate('my_profile.dob'),
    right: me && me.date_of_birth ? formatApiToUI(me.date_of_birth) : ''
  }

  const idTypeField = {
    left: translate('my_profile.id_type'),
    right: idType.find(item => item.id === me.identity_type) ?.title
  }

  const idCodeField = {
    left: translate('my_profile.id_no'),
    right: me && me.identity_code
  }

  // CONTACT DETAILS DATA
  const telephoneField = {
    left: translate('my_profile.telephone'),
    right: me && me.phone ? (me.phone_code ? me.phone_code : "") + me.phone : ''
  }

  const cellphoneField = {
    left: translate('my_profile.cellphone'),
    right: me && me.phone1 ? (me.phone1_code ? me.phone1_code : "") + me.phone1 : ''
  }

  const emailField = {
    left: translate('my_profile.email'),
    right: me && me.email
  }

  const addressField = {
    left: translate('my_profile.address'),
    right: me && me.address
  }

  const personalDetailsData: any[] = []
  if (me) {
    if (me.first_name) {
      personalDetailsData.push(firstNameField)
    }
    if (me.last_name) {
      personalDetailsData.push(lastNameField)
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
    const title = translate('my_profile.personal_details')
    return (
      <CustomInfoList
        isShowEdit={true}
        onPressEdit={onPressDirectEditProfile.bind(undefined, EditType.PERSONAL)}
        titleText={title}
        listData={personalDetailsData}
        titleImage={PERSONAL_DETAIL}
      />
    )
  }

  const onPressDirectEditProfile = (type: EditType) => {
    NavigationActionsService.push(EDIT_PROFILE_TENANT, { typeEdit: type })
  }

  const renderContactList = () => {
    const title = translate('my_profile.contact_details')
    return (
      <CustomInfoList
        titleText={title}
        isShowEdit={true}
        onPressEdit={onPressDirectEditProfile.bind(undefined, EditType.CONTACT)}
        listData={contactDetailsList}
        titleImage={CONTACT_DETAIL}
        containerStyle={styles.containerContact}
      />
    )
  }

  const onPressAvatar = () => {
    documentRef.current.show()
  }

  const renderPicker = () => (
    <DocumentPickerImage
      ref={documentRef}
      onCompleted={onCompletedPicker} />
  )

  const onGetListApartment = () => {
    dispatch(
      getUnitListMe({
        page: 1,
        limit: LimitGetAll,
        isSave: false,
        onSuccess: (data) => {
          setApartmentList(data.results)
        },
        onFail: error => {
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );

  }

  const onLoad = (onLoadSuccess: () => void, onLoadFailure: () => void) => {
    onGetListApartment();
  };

  const renderHeader = () => {
    return <CustomSectionHeader
      style={styles.sectionHeader}
      title={upperCase(translate("apartments.apartments"))}
      icon={IC_APARTMENT}
      isShowFilter={false}
    />;
  };

  const renderApartmentList = () => {
    return (
      <View style={{ marginTop: 7 }}>
        {renderHeader()}
        <View style={styles.flatListContainer}>
          <CustomFlatList
            ref={flatList}
            pullToRefresh={false}
            loadMore={false}
            onLoad={onLoad}
            ItemSeparatorComponent={_itemSeparator}
            data={apartmentList}
            renderItem={_renderItem}
            contentContainerStyle={{ flexGrow: 1, }}
          />
        </View>
      </View>
    );
  }

  const _renderItem = (item: IUnit) => {
    return <ApartmentItem
      item={item}
      onPress={onPressItem} />;
  }

  const onPressItem = (item: IUnit) => {
    NavigationActionsService.push(APARTMENT_DETAILS_TENANT, { item, flatList });
  };

  const _itemSeparator = () => {
    return (
      <View style={styles.lineContainer}>
        <Image source={LINE} style={styles.line} />
      </View>
    );
  };

  const onCompletedPicker = (imageResponse: any) => {
    let file = {}
    if (imageResponse) {
      file = {
        uri: imageResponse.path,
        type: imageResponse.mime,
        name: moment().valueOf().toString() + ".jpg"
      }
    }
    const formData = new FormData()
    formData.append("folder_name", 'media/photos')
    formData.append('file', file)
    NavigationActionsService.showLoading()
    dispatch(
      uploadImage({
        data: formData,
        progress: () => { },
        onSuccess: (data) => {
          onChangeAvatar(data.url)
        },
        onFail: error => {
          NavigationActionsService.hideLoading()
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message)
          }, 700)
        },
      }),
    )
  }

  const onChangeAvatar = (url: string) => {
    dispatch(
      updateProfile({
        data: {
          avatar: url
        },
        onSuccess: () => {
          NavigationActionsService.hideLoading()
        },
        onFail: error => {
          NavigationActionsService.hideLoading()
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message)
          }, 700)
        },
      }))
  }

  const renderMainView = () => {
    return (
      <Container barStyle={'light-content'}>
        {<AvatarHeader
          onPress={onPressAvatar}
          isShowEditAvatar={true}
          name={me ? getUserName(me.first_name, me.last_name, me.email) : ''}
          hasDropDown={false}
          avatar={me && me.avatar} />}
        <ScrollView bounces={false}>
          {renderPersonalDetailList()}
          {renderContactList()}
          {renderPicker()}
          {renderApartmentList()}
        </ScrollView>
      </Container >
    )
  }

  return (
    <View style={styles.container}>
      {renderMainView()}
    </View>
  )
}

export default React.memo(MyProfileTenant)
