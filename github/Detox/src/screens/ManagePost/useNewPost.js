import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import React, {createContext, useState} from 'react';

import {PostServiceType} from '../../api/graphql/generated/graphql';
import {API_TYPE, APPROVAL_STATUS} from '../../assets/constants';
import ArrayUtils from '../../utils/ArrayUtils';
import {extractAddressData} from '../../utils/DataProcessUtil';
import {mapToImageSourcesUI, mapToUiImageSelectionSources} from '../../utils/ImageUtil';
import JsonDataUtils from '../../utils/JsonDataUtils';
import {mapToPropertyDetail} from './PropertyPostUtils';

const mapToGeneralInfo = originData => {
  const {
    postTitle,
    propertyTypeId,
    propertyTypeName,
    propertyTypeDescription,
    projectId,
    projectInfo,
    freeTextProject,
    propertyAddress,
    postDescription,
    ownerIsAuthor,
    owner,
    isRented,
    isSold,
    postTypeId,
    unitOfMeasureId,
    negotiable,
    price,
    commission,
    commissionTpl,
    commissionBuyer,
    commissionSeller,
    saleCommissionCurrencyUnitId,
    propertyPostApprovalStatusId,
    isFollowed,
  } = originData;
  return {
    postTitle,
    propertyTypeId,
    propertyTypeName,
    propertyTypeDescription,
    projectId,
    projectInfo,
    freeTextProject,
    propertyAddress,
    postDescription,
    ownerIsAuthor,
    owner,
    isFollowed,
    forRent: false,
    forSale: true,
    postTypeId,
    unitOfMeasureId,
    negotiable,
    isRented,
    isSold,
    price,
    commission,
    saleCommissionCurrencyUnitId,
    commissionTpl,
    commissionBuyer,
    commissionSeller,
    propertyPostApprovalStatusId,
  };
};

/**
 * split array legal: legal images files (MO only support images) and files (PDF)
 * when create API to merge 2 array
 * @param {*} legalData legal documents
 * @returns object separate {legalDocuments, legalFiles} with legalDocuments = images
 */
const mapLegalDocuments = legalData => {
  if (legalData) {
    const mappingImages = mapToImageSourcesUI({images: legalData});
    return {legalDocuments: mappingImages};
  } else {
    return null;
  }
};

export const PostType = {
  sale: 'sale',
  rent: 'rent',
};

const getApprovalCountByName = (nameArr = [], approvalStatusArr = []) => {
  if (isEmpty(nameArr) || isEmpty(approvalStatusArr)) {
    return 0;
  }
  return approvalStatusArr
    .filter(it => nameArr.includes(it.approvalStatus.toLowerCase()))
    .map(it => it.count)
    .reduce((prev, current) => prev + current);
};

export const initialPostCount = approvalStatusArr => {
  return getApprovalCountByName(
    [
      APPROVAL_STATUS.APPROVAL,
      APPROVAL_STATUS.REQUEST,
      APPROVAL_STATUS.WAITING,
      APPROVAL_STATUS.SOLD,
      APPROVAL_STATUS.CLOSE,
    ],
    approvalStatusArr,
  );
};

export const initialState = {
  expiredDate: moment().add(3, 'months').toDate().getTime(),
  generalInfo: {},
  detailInfo: {},
  images: [],
  /**
   * map 3 type Facility
   * type 1 to UI: ui create
   * type 2 view: view on detail
   * type 3 create or edit
   */
  coordinate: {longitude: NaN, latitude: NaN},
  apiType: API_TYPE.NONE,
  postServiceType: PostServiceType.Normal,
  apiModel: {
    response: null,
    loading: false,
    error: null,
  },
  isPrivate: false,
  originState: {}, //raw data from server
  isEdit: false,
  shouldRefreshList: false,
  propertyPostApprovalStatusId: '',
  lastFullAddress: '',
  tokenCaptcha: '',
  supportRequestTypeIds: [],
  userIsValidated: false,
  step1Data: {},
  step2Data: {},
  step3Data: {},
  step4Data: {},
  // process view ui
  step1Valid: false,
  step2Valid: false,
  step3Valid: false,
  step4Valid: false,
};

const parseToFacilityToUI = data => {
  const listData = JsonDataUtils.parseJSONArray(data);
  const listFacilities = listData.map((item, index) => ({
    id: index.toString(),
    name: item.name,
    description: item?.name,
    checked: true,
  }));
  return listFacilities;
};

const NewPostContext = createContext(initialState);
const NewPostProvider = ({children}) => {
  const [state, setState] = useState(initialState);
  const isEdit = state.isEdit;

  const setInputFieldState = newFieldState => {
    setState({...state, ...newFieldState});
  };

  const resetState = (editMode, approvalStatusId, userIsValidated) => {
    const updateState = {
      ...initialState,
      isEdit: editMode ?? false,
      userIsValidated: userIsValidated ?? false,
      propertyPostApprovalStatusId: approvalStatusId,
    };

    setState(updateState);

    return updateState;
  };

  const resetEditDataToOriginState = () => {
    const parsedData = parseToGetEditData(state.originState);
    setState({...state, ...parsedData, isEdit: true});
  };

  const setEditData = data => {
    const parsedData = parseToGetEditData(data);
    setState({...state, ...parsedData});
  };

  function parseToGetEditData(data) {
    if (!data) {
      return initialState;
    }
    const legalDocuments = mapLegalDocuments(data?.legalDocuments);
    const parsedData = {
      ...initialState,
      coordinate: {longitude: data.longitude ?? 0, latitude: data.latitude ?? 0},
      originState: data,
      isPrivate: data.isPrivate,
      staffUserId: data?.staffUserId,
      step1Data: {
        ...mapToGeneralInfo(data),
        ...mapToPropertyDetail(data),
        nearFacility: parseToFacilityToUI(data.nearFacility),
        internalFacility: parseToFacilityToUI(data.internalFacility),
        lastFullAddress: extractAddressData(data.propertyAddress, false, true),
      },
      step2Data: {
        ...legalDocuments,
        // other doc size for limit uploading size image
        legalFilesSize: ArrayUtils.hasArrayData(legalDocuments?.legalFiles)
          ? legalDocuments?.legalFiles?.length
          : 0,
        otherServiceOptions: [],
        supportRequestTypeIds: JsonDataUtils.parseJSONArray(data?.supportRequestTypeIds),
        images: mapToUiImageSelectionSources({
          images: data.images,
          isSortable: true,
        }),
        postDescription: data?.postDescription,
        postTitle: data?.postTitle,
        isPrivate: data?.isPrivate,
        isShowGoogleStreetView: data?.isShowGoogleStreetView,
        matterportUrl: data?.matterportUrl,
      },
      step3Data: {
        agentAutoSuggestion: false,
        chosenAgent: null,
        staffUserId: data?.staffUserId,
      },
      step4Data: {
        postServiceType: data?.postServiceType,
        guaranteedPackageId:
          data?.guaranteedPackage?.guaranteedPackageId ?? data?.guaranteedPackageId,
        ownerIsAuthor: data?.ownerIsAuthor === false ? false : true,
        owner: data?.owner,
        forRent: false,
        forSale: true,
      },
      // process view ui
      step1Valid: true,
      step2Valid: true,
      step3Valid: true,
      step4Valid: true,
    };
    return parsedData;
  }

  const updateEditData = newData => {
    if (!newData) {
      return state;
    }
    const newState = {...state, ...newData};
    setState(newState);
  };

  const onSaveDraft = draft => {
    setState({...state, ...draft, isPrivate: true, apiType: API_TYPE.CREATE});
  };
  const onCreate = model => {
    setState({
      ...state,
      ...model,
      isPrivate: false,
      apiType: API_TYPE.CREATE,
      userIsValidated: false,
    });
  };

  const onUpdate = model => {
    setState({...state, ...model, isPrivate: false, apiType: API_TYPE.UPDATE});
  };

  return (
    <NewPostContext.Provider
      value={{
        state,
        setState,
        resetState,
        setEditData,
        parseToGetEditData,
        updateEditData,
        isEdit,
        onSaveDraft,
        onCreate,
        onUpdate,
        setInputFieldState,
        resetEditDataToOriginState,
      }}>
      {children}
    </NewPostContext.Provider>
  );
};

export {NewPostContext, NewPostProvider};
