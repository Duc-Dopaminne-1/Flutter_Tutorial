/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import {useCountPropertiesByCityQuery} from '../../api/graphql/generated/graphql';
import {AppContext} from '../../appData/appContext/useAppContext';
import {FETCH_POLICY} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS} from '../../assets/theme/metric';
import Section from '../../components/Section';
import SearchDataUtils from '../../utils/SearchDataUtils';
import {getCities, getPropertySearchInput} from './HomeUtil';
import styles from './styles';

const Area = ({cityData, onPressItem, lastUpdatedTime}) => {
  const {getMasterData} = useContext(AppContext);
  const masterData = getMasterData();
  const approvalStatusIds = SearchDataUtils.getApprovalIds(masterData);
  const queryInput = getPropertySearchInput(cityData, approvalStatusIds);
  const {data: response, refetch} = useCountPropertiesByCityQuery({
    ...FETCH_POLICY.NETWORK_ONLY,
    variables: {input: queryInput},
  });
  useEffect(() => {
    refetch();
  }, [lastUpdatedTime]);
  return (
    <TouchableOpacity
      key={`${cityData.cityId}`}
      onPress={() => onPressItem(cityData)}
      style={[styles.imageArea, HELPERS.mainEnd]}>
      <Image source={cityData.image} style={[styles.imageAreaContainer]} />
      <View style={[METRICS.marginStart, METRICS.marginBottom]}>
        <Text style={styles.areaTitle}>{cityData.cityName}</Text>
        <Text style={styles.areaDescription}>
          {translate(STRINGS.X_PROPERTY, {total: response?.searchPropertyPosts?.totalCount ?? 0})}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const HighlightAreas = ({onPressItem, lastUpdatedTime}) => {
  const props = {onPressItem, lastUpdatedTime};
  const cities = getCities();
  return (
    <Section
      sectionName={translate(STRINGS.HIGHTLIGHT_AREA)}
      titleStyle={styles.sectionText}
      containerStyle={METRICS.marginTop}
      titleContainerStyle={METRICS.retsetVerticalMargin}>
      <View style={styles.listAreasContainer}>
        <Area cityData={cities.HCM} {...props} />
        <Area cityData={cities.HN} {...props} />
        <Area cityData={cities.DN} {...props} />
        <Area cityData={cities.QN} {...props} />
      </View>
    </Section>
  );
};

export default HighlightAreas;
