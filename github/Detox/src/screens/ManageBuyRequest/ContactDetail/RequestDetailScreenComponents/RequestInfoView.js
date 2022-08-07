import isEmpty from 'lodash/isEmpty';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useGetProjectByIdLazyQuery} from '../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../../api/graphql/useGraphqlApiLazy';
import {
  CONSTANTS,
  CONTACT_TRADING_TYPE,
  FETCH_POLICY,
  getLocationList,
} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {small} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import RequiredLabel from '../../../../components/RequiredLabel';
import TextView from '../../../../components/TextView';
import WhiteBoxInput from '../../../../components/WhiteBoxInput';
import PropertyType from '../../../ManagePost/PropertyType';
import ScreenIds from '../../../ScreenIds';
import {DETAIL_FIELD} from '../../DetailRequestConstant';
import {convertDirections} from '../../ManageBuyRequestUtils';

const GetListField = ({state, isSending, isB2C}) => {
  const {
    contactType = '',
    projectId = '',
    BDSPropertyType = '',
    interestedNeighborhood = '',
    propertyPrice: requestPriceRange = '',
    direction = '',
    propertyTypeName,
    propertyTotalArea = '',
    priceRange: propertyPrice,
    propertyPostInfo: {
      project: propertyProjectName,
      interestedNeighborhood: propertyInterestedNeighborhood,
      areaMeasurement: propertyAreaMeasurement,
      direction: propertyDirection,
      floor,
      block,
      note,
    },
  } = state;
  const [projectName, setProjectName] = useState('');
  const onSuccessGetProject = data => {
    if (!data) {
      return;
    }
    setProjectName(data?.projectName);
  };

  const {startApi: startGetProjectInfo} = useGraphqlApiLazy({
    graphqlApiLazy: useGetProjectByIdLazyQuery,
    dataField: 'foProjectById',
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: onSuccessGetProject,
  });

  const getProjectInfo = () => {
    if (!isSending) {
      setProjectName(propertyProjectName);
      return;
    }

    if (projectId) {
      startGetProjectInfo({variables: {projectId}});
    }
  };

  useEffect(getProjectInfo, [projectId]);

  const getInterestedNeighborhood = () => {
    const interestedArea = isSending ? interestedNeighborhood : propertyInterestedNeighborhood;
    return isEmpty(interestedArea) ? '-' : interestedArea;
  };

  const getPrice = () => {
    const price = isSending ? requestPriceRange : propertyPrice;
    return isEmpty(price) ? '-' : price;
  };

  const getArea = () => {
    const area = isSending ? propertyTotalArea : propertyAreaMeasurement;
    return isEmpty(area) ? '-' : area;
  };

  const mapDirections = directions => {
    if (!directions) {
      return '';
    }
    const arrayOfDirections = directions.split(',');
    const convertedarray = convertDirections(arrayOfDirections);
    const arrayToString = convertedarray.join(', ');
    return arrayToString;
  };

  const convertedDirection = mapDirections(isSending ? direction : propertyDirection);

  const C2CField = [
    {
      fieldName: DETAIL_FIELD.transactionType,
      value:
        contactType === CONTACT_TRADING_TYPE.RENT
          ? translate('common.rent')
          : translate(STRINGS.BUY_PROPERTY),
    },
    {
      fieldName: DETAIL_FIELD.propertyType,
      value: BDSPropertyType,
    },
    {
      fieldName: DETAIL_FIELD.project,
      value: isEmpty(projectName) ? '-' : projectName,
    },
    {
      fieldName: DETAIL_FIELD.area,
      value: getInterestedNeighborhood(),
    },
    {
      fieldName: DETAIL_FIELD.price,
      value: getPrice(),
    },
    {
      fieldName: DETAIL_FIELD.acreage,
      value: getArea(),
    },
    {
      fieldName: DETAIL_FIELD.direction,
      value: isEmpty(convertedDirection) ? '-' : convertedDirection,
    },
  ];
  const PropertyB2CTypeField =
    propertyTypeName === PropertyType.apartment
      ? [
          {
            fieldName: DETAIL_FIELD.floor,
            value: floor,
          },
          {
            fieldName: DETAIL_FIELD.block,
            value: block,
          },
        ]
      : [
          {
            fieldName: DETAIL_FIELD.subArea,
            value: block,
          },
        ];
  const B2CField = [
    {
      fieldName: DETAIL_FIELD.productCode,
      value: state?.propertyPostInfo?.postId,
    },
    {
      fieldName: DETAIL_FIELD.project,
      value: isEmpty(state?.propertyPostInfo?.project) ? '-' : state?.propertyPostInfo?.project,
      canBeInteractive: true,
    },
    ...PropertyB2CTypeField,
    {
      fieldName: DETAIL_FIELD.note,
      value: note,
    },
  ];

  const listField = isB2C ? B2CField : C2CField;
  return listField;
};

const styles = StyleSheet.create({
  textHeader1: {
    ...FONTS.bold,
    ...FONTS.fontSize18,
  },
  textProductValue: {
    ...HELPERS.fill,
    ...FONTS.bold,
    color: COLORS.PRIMARY_A100,
  },
  inputNote: {
    borderWidth: SIZES.BORDER_WIDTH_1,
    height: CONSTANTS.INPUT_DESCRIPTION_HEIGHT,
    borderColor: COLORS.GREY_E4,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: small,
  },
  labelNote: {
    fontSize: 13,
  },
});

const mapLocation = location => {
  const locationList = getLocationList();
  let convertedLocation;
  locationList.forEach(e => {
    if (e.id === location) {
      convertedLocation = e.name;
    }
  });
  return convertedLocation;
};

const RequestInfoView = ({state, isB2C, onChangeNote, navigation, isSending = false}) => {
  const {
    location = '',
    propertyPostId = '',
    propertyPostInfo: {postId: propertyCode},
  } = state.contactTradingInfo ?? {};
  const SYMBOL_COLON = ':';
  const listField = GetListField({state: state.contactTradingInfo, isSending: isSending, isB2C});

  const navigateToProperty = () => {
    if (propertyPostId) {
      navigation.navigate(ScreenIds.ViewPropertyPost, {
        propertyPostId: propertyPostId,
        viewByOtherMode: true,
      });
    }
  };

  const navigateToProject = () => {
    const projectId = state?.contactTradingInfo?.propertyPostInfo?.projectId;
    if (projectId) {
      navigation.navigate(ScreenIds.ProjectDetail, {
        projectId: projectId,
      });
    }
  };

  const convertedLocation = mapLocation(location);

  return (
    <>
      <Text style={styles.textHeader1}>{translate(STRINGS.REQUEST_DETAIL_INFO)}</Text>
      {!isSending && !isB2C && (
        <>
          <View style={commonStyles.separatorRow16} />
          <TextView
            title={translate(STRINGS.POST_ID) + SYMBOL_COLON}
            value={propertyCode}
            valueStyle={styles.textProductValue}
            canBeInteractive={propertyCode ? true : false}
            onPress={navigateToProperty}
          />
        </>
      )}
      {listField.map((item, index) => {
        if (item.fieldName === DETAIL_FIELD.note) {
          if (isSending) {
            return null;
          }
          return (
            <View key={index}>
              <View style={commonStyles.separatorRow16} />
              <RequiredLabel
                isRequired={false}
                title={translate(STRINGS.NOTE) + SYMBOL_COLON}
                titleStyle={styles.labelNote}
                style={{marginBottom: small}}
              />
              <WhiteBoxInput
                textInputStyle={styles.inputNote}
                onChangeText={onChangeNote}
                editable={!isSending}
                multiline={true}
                placeholder={translate(STRINGS.NOTE_MORE)}
              />
            </View>
          );
        }
        return (
          <View key={index}>
            <View style={commonStyles.separatorRow16} />
            <TextView
              title={item.fieldName + SYMBOL_COLON}
              canBeInteractive={item.canBeInteractive}
              valueStyle={item.canBeInteractive ? styles.textProductValue : {}}
              onPress={navigateToProject}
              value={item.value}
            />
          </View>
        );
      })}
      {isSending && !isB2C && (
        <>
          <View style={commonStyles.separatorRow16} />
          <TextView
            title={translate(STRINGS.LOCATION) + SYMBOL_COLON}
            value={isEmpty(convertedLocation) ? '-' : convertedLocation}
          />
        </>
      )}
    </>
  );
};

export default RequestInfoView;
