import {CommissionCurrencyUnit, getDirectionList} from '../../../assets/constants';
import ArrayUtils from '../../../utils/ArrayUtils';
import {rootNavigationRef} from '../../navigate';
import ScreenIds from '../../ScreenIds';
import Selector from '../DetailPropertyPost/Selector';
import PropertyType from '../PropertyType';

const mapPlusServicesOptions = (selectedSupportIds: Array, plusServicesOptions) => {
  if (ArrayUtils.hasArrayData(plusServicesOptions)) {
    const copyPlusServices = plusServicesOptions.map(e => {
      let checked = false;
      if (ArrayUtils.hasArrayData(selectedSupportIds)) {
        const elementId = e?.id ?? e?.requestTypeId;
        checked = selectedSupportIds.some(item => item === elementId);
      }
      const item = {
        id: e?.id ?? e?.requestTypeId,
        typeId: e?.typeId ?? e?.requestTypeId,
        checked: checked,
        description: e?.description ?? e?.requestTypeDescription,
      };

      return item;
    });
    return copyPlusServices;
  }
  return [];
};

const calculateCommission = (total, commission, commissionType) => {
  if (!commission || (!total && commissionType === CommissionCurrencyUnit.PERCENTAGE)) {
    return 0;
  }
  const totalCommission =
    commissionType === CommissionCurrencyUnit.PERCENTAGE ? (total * commission) / 100 : commission;

  return Math.round(totalCommission);
};

const redirectUserOnCancelPropertyPost = () => {
  const navigation = rootNavigationRef.current;

  let navigateFromCrawlerPost = false;
  let navigateFromYourPost = false;
  let navigateFromSavedPost = false;

  navigation.getState().routes?.forEach(e => {
    if (!navigateFromCrawlerPost) {
      navigateFromCrawlerPost = e.name === ScreenIds.PropertyPostCrawler;
    }
    if (!navigateFromYourPost) {
      navigateFromYourPost = e.name === ScreenIds.YourPropertyPost;
    }
    if (!navigateFromSavedPost) {
      navigateFromSavedPost = e.name === ScreenIds.PropertyPostSaved;
    }
  });

  const navigateFromManagePostSection =
    navigateFromCrawlerPost || navigateFromSavedPost || navigateFromYourPost;

  // clear screen stack (back to home)
  navigation.navigate(ScreenIds.Home);
  if (navigateFromManagePostSection) {
    navigation.navigate(ScreenIds.ManagePost);
    if (navigateFromSavedPost) {
      navigation.navigate(ScreenIds.PropertyPostSaved);
    } else if (navigateFromCrawlerPost) {
      navigation.navigate(ScreenIds.PropertyPostCrawler, {defaultIndex: 0});
    } else {
      navigation.navigate(ScreenIds.YourPropertyPost, {defaultIndex: 0});
    }
  }
};

const mappingDetailInfo = ({propertyType = PropertyType.apartment, detailInfo, masterData}) => {
  let dropdownData = {
    propertyStatus: [],
    directions: [],
    balconyDirections: [], // Balcony direction dropdown list
    legalStatus: [],
  };
  if (masterData) {
    const dropdownDataTemp = Selector.mapToDropdownData(
      {...masterData, directions: getDirectionList(), balconyDirections: getDirectionList()},
      detailInfo,
      propertyType,
    );
    dropdownData = dropdownDataTemp.data;
  }

  const originDetailState = Selector.initialDetailStateByPropertyType(detailInfo, propertyType);

  return {...originDetailState, dropdownData: dropdownData};
};

export {
  calculateCommission,
  mappingDetailInfo,
  mapPlusServicesOptions,
  redirectUserOnCancelPropertyPost,
};
