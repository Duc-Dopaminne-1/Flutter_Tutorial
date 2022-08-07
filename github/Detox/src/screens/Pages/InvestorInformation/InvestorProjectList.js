import React from 'react';
import {StyleSheet} from 'react-native';

import {useGetFoProjectsOfInvestorByIdLazyQuery} from '../../../api/graphql/generated/graphql';
import {EMPTY_TYPE, ITEM_TYPE} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {normal, normalPlus} from '../../../assets/theme/metric';
import LazyList, {PAGING_TYPE} from '../../../components/LazyList';
import PageScreen from '../../../components/PageScreen';
import ProjectItem, {ProjectItemHeight} from '../../../components/ProjectItem';
import {mapSearchItemUi} from '../../../components/SearchProjectItem/types';
import {useFormatPrice} from '../../Home/useFormatPrice';
import ScreenIds from '../../ScreenIds';

const InvestorProjectList = ({navigation, route}) => {
  const {formatPrice} = useFormatPrice();
  const {investorId} = route?.params;
  const queryParams = {
    input: {
      foInvestorId: investorId,
      page: 1,
      pageSize: 16,
    },
  };

  const renderProject = ({item, ...otherProps}) => {
    const mappingItem = mapSearchItemUi(item, formatPrice);

    const onPressItem = () => {
      navigation.navigate(ScreenIds.ProjectDetail, {
        projectId: item.projectId,
      });
    };

    return (
      <ProjectItem
        onPress={onPressItem}
        projectInfo={mappingItem}
        containerStyle={{marginTop: normal}}
        itemType={ITEM_TYPE.full}
        isFollowCountVisible={false}
        {...otherProps}
      />
    );
  };

  return (
    <PageScreen title={translate('investor.detail.projectOfInvestor')} showHeaderShadow>
      <LazyList
        useQuery={useGetFoProjectsOfInvestorByIdLazyQuery}
        queryOptions={{variables: queryParams}}
        extractArray={response => response?.getFOProjectsOfInvestorById?.projectDtos ?? []}
        renderItem={({item, ...otherProps}) => renderProject({item, ...otherProps})}
        itemHeight={ProjectItemHeight}
        extractTotalCount={response => response?.getFOProjectsOfInvestorById?.totalCount ?? 0}
        pagingType={PAGING_TYPE.OFFSET}
        emptyType={EMPTY_TYPE.BUY_REQUEST}
        containerStyle={styles.containerStyle}
      />
    </PageScreen>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: normalPlus,
  },
});

export default InvestorProjectList;
