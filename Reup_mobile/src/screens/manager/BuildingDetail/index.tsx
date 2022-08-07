import React, { useEffect, useState } from 'react';
import {
  View, Image, ImageSourcePropType,
  ScrollView, TextStyle,
  TouchableOpacity,
  Alert,
  Platform,
  Linking
} from 'react-native';
import styles from './styles';
import translate from '@src/localize';
import {
  BACK,
  ICON_CONTACT_MANAGER,
  ICON_FLAG,
  ICON_LOCATION,
  ICON_PHONE,
  ICON_ITEM_INFO_EMAIL,
  ICON_PERSON,
} from '@src/constants/icons';
import { StatisticsButton, CustomButton } from '../../../components/CustomButton';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomText } from '@src/components/CustomText';
import Container from '@src/components/Container';
import { useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { deleteProperty, countListStaff, countListResident } from '@src/modules/Company/actions';
import RectangleAvatar from '@src/components/RectangleAvatar';
import { WIDTH, HEIGHT } from '@src/constants/vars';
import { ICompany } from '@reup/reup-api-sdk/libs/api/company/models';

interface BuildingDetailProps {
}

interface ItemInfoProps {
  source: ImageSourcePropType;
  title: string;
  textStyle?: TextStyle;
}

const BuildingDetail = (props: BuildingDetailProps) => {

  const dispatch = useDispatch();
  const route = useRoute();
  const { item, flatListRef }: any = route.params;
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const companyList = useSelector<RootState, ICompany[]>((state: RootState) => state.company.listCompany.results);
  const defaultCompany = companyList.find(item => item.id === me.default_company.id);
  const defaultCompanyId = defaultCompany ? defaultCompany.id : '';
  const [staffCount, setStaffCount] = useState('0');
  const [residentCount, setResidentCount] = useState('0');

  useEffect(() => {
    fetchListStaffResident();
  }, []);

  const fetchListStaffResident = () => {
    fetchCountStaff();
    fetchCountResident();
  };

  const fetchCountStaff = () => {
    dispatch(countListStaff({
      companyId: defaultCompanyId,
      isSave: false,
      params: {
        property_id: item.id
      },
      onSuccess: (data) => {
        if (data) {
          setStaffCount(data.count + "");
        }
      },
      onFail: error => {
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }));
  };


  const fetchCountResident = () => {
    dispatch(countListResident({
      companyId: defaultCompanyId,
      isSave: false,
      params: {
        property_id: item.id
      },
      onSuccess: (data) => {
        if (data) {
          setResidentCount(data.count + "");
        }
      },
      onFail: error => {
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }));
  };
  const ItemInfo = (props: ItemInfoProps) => {
    const { source, title, textStyle } = props;
    return (
      <View style={styles.itemInfoView}>
        <Image source={source} style={styles.itemInfoImage} />
        <CustomText style={[styles.itemInfoText, textStyle]} text={title} />
      </View>
    );
  };


  const _onBack = () => {
    NavigationActionsService.pop();
  };

  const _handleDelete = () => {
    if (me && me.default_company && item.id) {
      NavigationActionsService.showLoading();
      dispatch(deleteProperty({
        companyId: me.default_company.id,
        id: item.id,
        onSuccess: (data) => {
          NavigationActionsService.hideLoading();
          flatListRef && flatListRef.current && flatListRef.current.reloadData();
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

  const _onDeleteBuilding = () => {
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

  const onCallSeller = () => {
    let phoneNumber = item.phone;
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${item.phone}`;
    }
    else {
      phoneNumber = `tel:${item.phone}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
  };
  const _onContactManager = () => {
    Alert.alert(translate('building_detail.contact_manager'),
      translate('building_detail.contact_manager_des', { phone: item.phone }), [
      {
        text: translate('about_seller.call'),
        onPress: onCallSeller,
      },
      {
        style: 'cancel',
        text: translate('about_seller.cancel'),
      },
    ]);
  };

  const renderInfoView = () => {
    return (
      <View style={styles.infoView}>
        <View style={styles.description}>
          <CustomText text={item.country.emoji} />
          <CustomText
            numberOfLines={1}
            style={styles.nation}
            text={item.country.name}
            styleContainer={styles.containerNameNation} />
        </View>
        <ItemInfo source={ICON_LOCATION} title={`${item.address}, ${(item && item.state && item.state.name) ? item.state.name : ''}`} />
        <ItemInfo source={ICON_PHONE} title={item.phone} />
        <ItemInfo source={ICON_ITEM_INFO_EMAIL} title={item.email} textStyle={styles.item_info_email} />
        <ItemInfo source={ICON_PERSON} title={item.name} />
        <CustomButton
          style={styles.contactButton}
          text={translate('building_detail.contact_manager')}
          textStyle={styles.contactText}
          iconLeft={ICON_CONTACT_MANAGER}
          iconRightStyle={styles.iconContact}
          onPress={_onContactManager}
        />
      </View>
    );
  };

  return (
    <Container>
      <RectangleAvatar resizeMode="stretch" avatar={item.image_urls[0]} width={WIDTH} height={WIDTH * 9 / 16} />
      <ScrollView
        alwaysBounceVertical={false}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainerScrollView}
      >
        <CustomText style={styles.aliquamText} text={item && item.name ? item.name : ''} />
        <View style={styles.statisticsButtonsContainer}>
          <StatisticsButton
            text={translate('home.tenants')}
            onPress={() => { }}
            statisticsNumber={residentCount}
            style={styles.statisticsButton}
          />
          <StatisticsButton
            text={translate('home.staffs')}
            onPress={() => { }}
            statisticsNumber={staffCount}
            style={styles.statisticsButton}
          />
        </View>
        {renderInfoView()}
      </ScrollView>
      <View style={styles.containerDeleteBuildingBtn}>
        <CustomButton
          onPress={_onDeleteBuilding}
          textStyle={styles.buttonTextLogin}
          text={translate('building_detail.delete_button')}
          style={styles.buttonLogin}
        />
      </View>
      <TouchableOpacity style={styles.backButton} onPress={_onBack}>
        <Image resizeMode="contain" source={BACK} style={styles.backImage} />
      </TouchableOpacity>
    </Container>
  );
};

export default BuildingDetail;
