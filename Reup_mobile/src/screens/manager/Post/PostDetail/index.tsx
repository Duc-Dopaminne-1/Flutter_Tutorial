import React, { useEffect, useState } from 'react';
import styles from './styles';
import { View, ScrollView, Alert, Platform } from 'react-native';
import Container from '@src/components/Container';
import { CustomButton } from '@src/components/CustomButton';
import { PostItemModal, PostTypeFor } from '@src/components/ForLeaseForSale/ItemForLeaseForSale';
import CustomSectionHeader from '@src/components/CustomSection';
import ICON_HOME_SALE from '@res/icons/ForLeaseForSale/icon-home-sale.png';
import { CustomText } from '@src/components/CustomText';
import { useRoute } from "@react-navigation/native";
import { CustomFlatList } from '@src/components/FlatList';
import FastImage from 'react-native-fast-image';
import AboutSeller, { SellerModel } from '@src/components/AboutSeller';
import translate from '@src/localize';
import { Linking } from 'react-native';
import moment from 'moment';
import IMAGE_DEFAULT from '@res/icons/ForLeaseForSale/image-default.jpg';
import { Config } from '@src/configs/appConfig';
import IC_APARTMENT from '@src/res/icons/icon_apartment.png';
import { useDispatch } from 'react-redux';
import { upperCaseFirstChar, formatCurrency, getApartmentName } from '@src/utils';
import { activeForLease, activeForSale, declineForLease, declineForSale } from '@src/modules/bulletin/actions';
import NavigationActionsService from '@src/navigation/navigation';
import { BulletinPostStatus } from '@reup/reup-api-sdk/libs/api/enum';
import RectangleAvatar from '@src/components/RectangleAvatar';
import { WIDTH, HEIGHT } from '@src/constants/vars';

interface PostDetailProps {

}

const PostDetail = (props: PostDetailProps) => {
  const route = useRoute();
  const dispatch = useDispatch();
  const { forLeaseSaleFlatList, forLeaseFlatList, forSaleFlatList, data } = route.params as any;
  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {

  };

  const renderBottomButton = () => {
    return (
      <View style={styles.bottomButtonView}>
        {data.status && data.status === BulletinPostStatus.Pending
          ? <CustomButton
            onPress={onApprove}
            text={translate("post.detail_approve_button")}
            style={[styles.widthButton, styles.approveButton]}
          />
          : null}
        {data.status && data.status === BulletinPostStatus.Approved
          ? <CustomButton
            onPress={onApprove}
            text={translate("post.detail_unapprove_button")}
            textStyle={styles.unApproveText}
            style={[styles.widthButton1, styles.unApproveButton]}
          />
          : null}
        {data.status && data.status === BulletinPostStatus.Pending
          ? <CustomButton
            onPress={onDeny}
            text={translate("post.detail_deny_button")}
            textStyle={styles.denyText}
            style={[styles.widthButton, styles.denyButton]}
          />
          : null}
      </View>
    )
  };

  const onApprove = () => {
    if (data && data.type === PostTypeFor.FOR_LEASE) {
      NavigationActionsService.showLoading()
      dispatch(
        activeForLease({
          companyId: data.companyId ? data.companyId : "",
          id: data.id ? data.id : "",
          onSuccess: (data) => {
            forLeaseFlatList && forLeaseFlatList.current && forLeaseFlatList.current.reloadData()
            forLeaseSaleFlatList && forLeaseSaleFlatList.current && forLeaseSaleFlatList.current.reloadData()
            NavigationActionsService.hideLoading()
            NavigationActionsService.pop()
          },
          onFail: error => {
            NavigationActionsService.hideLoading()
            setTimeout(() => {
              error && Alert.alert(translate('alert.title_error'), error.message);
            }, 700);
          }
        })
      )
    } else if (data && data.type === PostTypeFor.FOR_SALE) {
      NavigationActionsService.showLoading()
      dispatch(
        activeForSale({
          companyId: data.companyId ? data.companyId : "",
          id: data.id ? data.id : "",
          onSuccess: (data) => {
            forSaleFlatList && forSaleFlatList.current && forSaleFlatList.current.reloadData()
            forLeaseSaleFlatList && forLeaseSaleFlatList.current && forLeaseSaleFlatList.current.reloadData()
            NavigationActionsService.hideLoading()
            NavigationActionsService.pop()
          },
          onFail: error => {
            NavigationActionsService.hideLoading()
            setTimeout(() => {
              error && Alert.alert(translate('alert.title_error'), error.message);
            }, 700);
          }
        })
      )
    }
  }

  const onDeny = () => {
    if (data && data.type === PostTypeFor.FOR_LEASE) {
      NavigationActionsService.showLoading()
      dispatch(
        declineForLease({
          companyId: data.companyId ? data.companyId : "",
          id: data.id ? data.id : "",
          onSuccess: (data) => {
            forLeaseFlatList && forLeaseFlatList.current && forLeaseFlatList.current.reloadData()
            forLeaseSaleFlatList && forLeaseSaleFlatList.current && forLeaseSaleFlatList.current.reloadData()

            NavigationActionsService.hideLoading()
            NavigationActionsService.pop()
          },
          onFail: error => {
            NavigationActionsService.hideLoading()
            setTimeout(() => {
              error && Alert.alert(translate('alert.title_error'), error.message);
            }, 700);
          }
        })
      )
    } else if (data && data.type === PostTypeFor.FOR_SALE) {
      NavigationActionsService.showLoading()
      dispatch(
        declineForSale({
          companyId: data.companyId ? data.companyId : "",
          id: data.id ? data.id : "",
          onSuccess: (data) => {
            forSaleFlatList && forSaleFlatList.current && forSaleFlatList.current.reloadData()
            forLeaseSaleFlatList && forLeaseSaleFlatList.current && forLeaseSaleFlatList.current.reloadData()
            NavigationActionsService.hideLoading()
            NavigationActionsService.pop()
          },
          onFail: error => {
            NavigationActionsService.hideLoading()
            setTimeout(() => {
              error && Alert.alert(translate('alert.title_error'), error.message);
            }, 700);
          }
        })
      )
    }
  }

  const _itemSeparator = () => {
    return (
      <View style={styles.separate} />
    );
  };

  const _renderImage = (item: string) => {
    return (
      <RectangleAvatar
        width={data.imageURLs && data.imageURLs.length === 1 ? (WIDTH - 30) : (WIDTH - 50)}
        height={HEIGHT * 0.25}
        imageDefault={IMAGE_DEFAULT}
        avatar={item}
      />
    );

  };

  const renderImages = () => {
    return (
      <View style={styles.imageContainer}>
        <CustomFlatList
          onLoad={onLoad}
          contentContainerStyle={styles.imagesListContainer}
          data={data.imageURLs ? data.imageURLs : []}
          horizontal={true}
          renderItem={_renderImage}
          ItemSeparatorComponent={_itemSeparator}
          style={styles.flatlist}
        />
      </View>
    );
  };

  const renderPrice = () => {
    return (
      <View style={styles.priceContainer}>
        <CustomText numberOfLines={1} text={formatCurrency(data.price, data.currency)} style={styles.priceText} />
        {data.type && data.type === PostTypeFor.FOR_LEASE ? <CustomText text={data.per ? "/" + upperCaseFirstChar(data.per) : ""} style={styles.monthText} /> : null}
      </View>
    );
  };

  const renderDescription = () => {
    return (
      <CustomText
        text={data.description ? data.description : ""}
        style={styles.description}
        styleContainer={styles.descriptionContainer}
      />
    );
  };

  const renderPostDetail = () => {
    return (
      <View style={styles.marginSection}>
        <View style={styles.postDetailContainer}>
          <View style={styles.headerPostDetailContainer}>
            <CustomText numberOfLines={2} text={data.title ? data.title : ""} style={styles.titleText} styleContainer={styles.titleContainer} />
            <CustomText numberOfLines={1} text={data.modified ? moment(data.modified).format(Config.Manager.formatDate) ?? '' : ""} style={styles.dateText} styleContainer={styles.dateContainer} />
            {renderImages()}
            {renderPrice()}
            {renderDescription()}
          </View>
        </View>
      </View>
    );
  };

  const onCallSeller = () => {
    let phoneNumber = data.creator && data.creator.phone
      ? (data.creator.phone_code ? data.creator.phone_code : "") + data.creator.phone
      : (data.creator.phone1_code ? data.creator.phone1_code : "") + data.creator.phone1;
    let phone = '';

    if (Platform.OS !== 'android') {
      phone = `telprompt:${phoneNumber}`;
    }
    else {
      phone = `tel:${phoneNumber}`;
    }
    Linking.canOpenURL(phone)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phone);
        }
      })
      .catch(err => console.log(err));
  };

  const onPressCall = () => {
    let phoneNumber = data.creator && data.creator.phone
      ? (data.creator.phone_code ? data.creator.phone_code : "") + data.creator.phone
      : (data.creator.phone1_code ? data.creator.phone1_code : "") + data.creator.phone1;

    Alert.alert(translate('about_seller.title_call_seller'),
      translate('about_seller.des_call_seller', { phone: phoneNumber }), [
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

  const renderSeller = () => {
    return (
      <AboutSeller containerStyle={styles.sellerContainer} data={data.creator} onPress={onPressCall} />
    );
  };

  const renderApartmentCode = () => {
    return (
      <View style={styles.textContainers}>
        <View style={styles.rowItem}>
          <CustomText
            numberOfLines={1}
            style={styles.subTitle}
            text={`${translate('apartments.code')}:`}
            styleContainer={styles.key} />
          <CustomText
            numberOfLines={1}
            style={styles.apartmentCode}
            text={getApartmentName(data.unit.block, data.unit.floor, data.unit.code)}
            styleContainer={styles.value} />
        </View>
        <View style={styles.line} />
      </View>
    )
  }

  const renderSquare = () => {
    return (
      <View style={styles.textContainers}>
        <View style={styles.rowItem}>
          <CustomText
            numberOfLines={1}
            style={styles.subTitle}
            text={`${translate('apartments.square_m2')}:`}
            styleContainer={styles.key} />
          <CustomText
            numberOfLines={1}
            style={styles.textRight}
            text={data.unit.square ? `${data.unit.square}m2` : ''}
            styleContainer={styles.value} />
        </View>
        <View style={styles.line} />
      </View>
    )
  }

  const renderBath = () => {
    return (
      <View style={styles.textContainers}>
        <View style={styles.rowItem}>
          <CustomText
            numberOfLines={1}
            style={styles.subTitle}
            text={`${translate('apartments.bathroom')}:`}
            styleContainer={styles.key} />
          <CustomText
            numberOfLines={1}
            style={styles.textRight}
            text={`${data.unit.restroom ?? ''}`}
            styleContainer={styles.value} />
        </View>
        <View style={styles.line} />
      </View>
    )
  }

  const renderBed = () => {
    return (
      <View style={styles.textContainers}>
        <View style={styles.rowItem}>
          <CustomText numberOfLines={1}
            style={styles.subTitle}
            text={`${translate('apartments.bedroom')}:`}
            styleContainer={styles.key} />
          <CustomText
            numberOfLines={1}
            style={styles.textRight}
            text={`${data.unit.bedroom ?? ''}`}
            styleContainer={styles.value} />
        </View>
        <View style={styles.line} />
      </View>
    )
  }

  const renderDescriptionApartment = () => {
    return (
      <View style={styles.textContainers}>
        <CustomText
          numberOfLines={1}
          style={[styles.subTitle, styles.subTitleDes]}
          text={`${translate('apartments.description')}:`}
          styleContainer={styles.key} />
        <CustomText
          styleContainer={{ alignItems: 'flex-start' }}
          style={[styles.subTitle, styles.descriptionApartment]}
          text={data.unit.descriptions ?? ''} />
      </View>
    )
  }

  const renderDetailApartment = () => {
    return (
      <View style={styles.infoApartmentContainer}>
        <CustomSectionHeader
          style={styles.sectionHeader}
          title={translate("apartments.info_title")}
          icon={IC_APARTMENT}
        />
        {renderApartmentCode()}
        {renderSquare()}
        {renderBed()}
        {renderBath()}
        {renderDescriptionApartment()}
      </View>
    )
  }

  return (
    <Container isShowHeader={true} title={translate("post.detail_title2")} spaceBottom={true} isDisplayMenuButton={false} isDisplayNotification={false}>
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={translate("post.detail_title1")}
        icon={ICON_HOME_SALE}
      />
      <ScrollView style={styles.container}>
        {renderPostDetail()}
        {data.unit ? renderDetailApartment() : null}
        {data.creator ? renderSeller() : null}
      </ScrollView>
      {data.status && data.status !== BulletinPostStatus.Denied ? renderBottomButton() : null}
    </Container>
  );

};

export default PostDetail;
