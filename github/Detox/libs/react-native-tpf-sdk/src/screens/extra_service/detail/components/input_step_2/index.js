import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { scale } from '../../../../../utils/responsive';
import { BodyText, Heading, PrimaryButton, SmallText, SubHead } from '../../../../../components';
import themeContext from '../../../../../constants/theme/themeContext';
import {
  apiGetAddedServiceForm,
  apiGetPartnerInfoOfProduct,
  apiGetProductCategoryFromSdk
} from '../../../../../services/api/extraServiceApi';
import FastImage from 'react-native-fast-image';
import SearchFormInput from './search_form_input';
import PartnerInfoDynamicView from './partner_info_dynamic_view';
import { ATTRIBUTE_TYPE } from '../../../../../global/entity_type';
import { TpfSdkClient } from '../../../../../../index';
import SCREENS_NAME from '../../../../../constants/screens';
const InputStep2 = props => {
  const theme = useContext(themeContext);
  const {
    currentCategory,
    currentPartner,
    setCurrentPartner,
    setCurrentStep,
    setCurrentCategory,
    setLoading
  } = props;
  const [isLoadingPartnerInfo, setLoadingPartnerInfo] = useState(false);
  const [listComponent, setListComponent] = useState([]);
  const [listPartner, setListPartner] = useState([]); // partner list when search
  const [partnerInfo, setPartnerInfo] = useState(null); // partner info when select partner
  const handleGoBack = () => {
    setCurrentStep(1);
    setCurrentCategory(null); // reset category of step 1
  };
  const onFetchPartnerList = async (attributeFilters = [], partnerName = '') => {
    setLoading(true);
    const data = await apiGetProductCategoryFromSdk({
      attributeFilters,
      categoryId: currentCategory?.id,
      partnerName
    });
    setLoading(false);
    if (data?.status === 200) {
      setListPartner(data?.data?.result?.partners || []);
    }
  };
  const onFetchAddedServiceForm = async categoryId => {
    const data = await apiGetAddedServiceForm({ CategoryId: categoryId });
    data?.data?.result?.listComponent?.forEach(item => {
      if (item.type === 'address') {
        item.addressDetail = [
          { code: 'District', name: 'Tỉnh/Thành phố', value: null },
          { code: 'Province', name: 'Quận/Huyện', value: null }
        ];
      }
    });
    setListComponent(data?.data?.result?.listComponent || []);
  };
  useEffect(() => {
    onFetchAddedServiceForm(currentCategory?.id || 0);
    onFetchPartnerList();
  }, []);
  const onChangeForm = value => {
    setListComponent(value);
  };
  const handleSearchPartner = textSearch => {
    const attributeFilters = [];
    listComponent.forEach(item => {
      const { attributeId, type, value, addressDetail } = item;
      console.log('addressDetail90', addressDetail);
      if (type !== ATTRIBUTE_TYPE.address && value) {
        attributeFilters.push({
          attributeId,
          type,
          numberValue:
            type === ATTRIBUTE_TYPE.price || type === ATTRIBUTE_TYPE.select ? Number(value) : 0,
          textValue: type === ATTRIBUTE_TYPE.text ? value : '',
          addressValue: []
        });
        return;
      }
      if (type === ATTRIBUTE_TYPE.address) {
        attributeFilters.push({
          attributeId,
          type,
          numberValue: 0,
          textValue: '',
          addressValue: addressDetail
            ?.filter(item => item.value)
            .map(i => ({ code: i.code.toLowerCase(), value: i.value }))
        });
      }
    });
    setCurrentPartner(null);
    setPartnerInfo(null);
    onFetchPartnerList(attributeFilters || [], textSearch);
  };
  const handleSelectPartner = item => async () => {
    setCurrentPartner(item);
    setLoadingPartnerInfo(true);
    const data = await apiGetPartnerInfoOfProduct({ Id: item?.productId });
    setLoadingPartnerInfo(false);
    if (data?.status === 200) {
      setPartnerInfo(data?.data?.result || null);
    }
  };
  const renderItem = ({ item }) => {
    const isActive = item?.productId === currentPartner?.productId;
    return (
      <TouchableOpacity
        style={[styles.partnerItem, isActive && { borderColor: theme.app.primaryColor1 }]}
        onPress={handleSelectPartner(item)}>
        <View style={{ alignItems: 'center', marginBottom: scale(20) }}>
          <FastImage
            source={{ uri: item?.imgLink || '' }}
            resizeMode="contain"
            style={styles.partnerImage}
          />
        </View>
        <SubHead style={isActive && { color: theme.app.primaryColor1 }} numberOfLines={2}>
          {item?.partnerName}
        </SubHead>
        <SmallText color={theme.text.secondary} numberOfLines={2}>
          {item?.address}
        </SmallText>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <View style={styles.header}>
        <Heading bold style={{ marginBottom: scale(15) }} translate>
          extra_service_detail.product_and_service
        </Heading>
        <SubHead bold={false} style={{ marginBottom: scale(5) }} translate>
          insurance_screen.products_name
        </SubHead>
        <BodyText bold>{currentCategory?.name || ''}</BodyText>
        <TouchableOpacity
          style={[styles.buttonChoose, { borderColor: theme.app.primaryColor1 }]}
          onPress={handleGoBack}>
          <SmallText bold style={{ color: theme.app.primaryColor1 }} translate>
            extra_service_detail.choose_product_again
          </SmallText>
        </TouchableOpacity>
      </View>
      <SearchFormInput
        listComponent={listComponent}
        onChange={onChangeForm}
        onSearch={handleSearchPartner}
      />
      <FlatList
        contentContainerStyle={{ paddingHorizontal: scale(15) }}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={listPartner || []}
        renderItem={renderItem}
      />
      {isLoadingPartnerInfo && (
        <ActivityIndicator
          style={{ marginVertical: scale(50) }}
          size="large"
          color={theme.app.primaryColor1}
        />
      )}
      {!isLoadingPartnerInfo && partnerInfo ? (
        <PartnerInfoDynamicView partnerInfo={partnerInfo} />
      ) : null}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          translate
          disabled={!currentPartner?.productId}
          title={'extra_service_detail.choose_partner'}
          onPress={() => {
            setLoading(true);
            TpfSdkClient.requestLogin(
              null,
              null,
              () => {
                setCurrentStep(3);
              },
              () => {
                setLoading(false);
              }
            );
          }}
        />
      </View>
    </View>
  );
};
export default React.memo(InputStep2);
const styles = StyleSheet.create({
  optionButton: {
    marginTop: scale(16),
    backgroundColor: '#F5F5F5',
    height: scale(48),
    borderRadius: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(15),
    paddingVertical: scale(13)
  },
  header: {
    padding: scale(16),
    marginHorizontal: scale(15),
    marginBottom: scale(20),
    borderRadius: scale(6),
    marginTop: 2,
    backgroundColor: '#FFF',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  buttonChoose: {
    height: scale(32),
    width: scale(134),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(12),
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: scale(4)
  },
  partnerItem: {
    justifyContent: 'space-between',
    width: scale(148),
    marginRight: scale(12),
    borderWidth: 1,
    borderColor: '#FFF',
    marginVertical: scale(10),
    padding: scale(12),
    paddingTop: scale(30),
    borderRadius: scale(6),
    backgroundColor: '#FFF',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  partnerImage: { width: scale(60), height: scale(60) },
  buttonContainer: { marginTop: scale(8), paddingHorizontal: scale(15) }
});
