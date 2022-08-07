import React from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CheckboxList from '../../../components/Checkbox/CheckboxList';
import {FeatureConfig} from '../../../configs/FeatureConfig';
// import FilterAgentGroups from './FilterAgentGroups';
import FilterAgentLocation from './FilterAgentLocation';
import FilterBottomButtons from './FilterBottomButtons';
import FindNearMeComponent from './FindNearMeComponent';

const numColumns = 2;
const itemCheckBoxWidth = (Dimensions.get('window').width - 2 * normal) / numColumns;
const styles = StyleSheet.create({
  titleSection: {
    fontSize: 15,
    color: COLORS.TEXT_DARK_10,
    ...FONTS.bold,
  },
  titleText: {
    ...FONTS.semiBold,
    fontSize: 24,
  },
  scrollViewContainer: {
    flex: 1,
    ...METRICS.horizontalPadding,
  },
  checkboxSection: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});

const FilterAgentContainer = ({
  state,
  itemsData,
  isShowFilterLocation = true,
  onChangeCity,
  onChangeDistrict,
  onSelectPropertyType,
  // onSelectAgentRanking,
  // onSelectAgentGroup,
  onSelectTopenerServiceType,
  // onRemoveItemAgentGroup,
  onCheckFindNearMe,
  onPressButtonSearch,
  onPressButtonCancelFilter,
}) => {
  return (
    <View style={[HELPERS.fill]}>
      <View style={commonStyles.viewFirstRow}>
        <Text style={styles.titleText}>{translate(STRINGS.FILTER)}</Text>
      </View>
      <ScrollView style={styles.scrollViewContainer} alwaysBounceVertical={false}>
        <CheckboxList
          title={translate(STRINGS.PROPERTY_TYPE)}
          selectedItems={state.propertyTypes}
          titleStyle={styles.titleSection}
          items={itemsData.propertyTypes}
          onSelect={onSelectPropertyType}
          listStyle={styles.checkboxSection}
          itemStyle={{width: itemCheckBoxWidth}}
          images={['checkbox', 'checkbox-blank-outline']}
          customCheckedBox
        />
        {/* <CheckboxList
          selectedItems={state.agentRankings}
          titleStyle={styles.titleSection}
          title={translate(STRINGS.AGENT_RANK)}
          items={itemsData.agentRankings}
          onSelect={onSelectAgentRanking}
          listStyle={styles.checkboxSection}
          itemStyle={{width: itemCheckBoxWidth}}
        />
        <FilterAgentGroups
          agentGroups={itemsData.agentGroups}
          onSelectAgentGroup={onSelectAgentGroup}
          onRemoveItemAgentGroup={onRemoveItemAgentGroup}
          isHavingAll={true}
        /> */}
        {FeatureConfig.enableTopenerService && (
          <CheckboxList
            title={translate('search.agent.filter.topenerService')}
            titleStyle={styles.titleSection}
            images={['checkbox', 'checkbox-blank-outline']}
            customCheckedBox
            isHorizontal={false}
            items={itemsData.topenerServiceTypes}
            selectedItems={state.topenerServiceTypes}
            onSelect={onSelectTopenerServiceType}
          />
        )}
        {isShowFilterLocation && (
          <FilterAgentLocation
            state={state}
            onChangeCity={onChangeCity}
            onChangeDistrict={onChangeDistrict}
          />
        )}
        <FindNearMeComponent state={state} onCheckFindNearMe={onCheckFindNearMe} />
      </ScrollView>
      <FilterBottomButtons
        onPressSearch={onPressButtonSearch}
        onPressCancelFilter={onPressButtonCancelFilter}
      />
    </View>
  );
};

export default FilterAgentContainer;
