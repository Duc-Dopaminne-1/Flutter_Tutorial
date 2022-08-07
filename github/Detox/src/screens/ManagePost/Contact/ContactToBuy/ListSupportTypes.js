import React, {useState} from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';

import {
  RequestTypeDto,
  useGetPlusServicesLazyQuery,
} from '../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../../api/graphql/useGraphqlApiLazy';
import {CONSTANTS, FETCH_POLICY} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {micro, normal, small} from '../../../../assets/theme/metric';
import CustomCheckbox from '../../../../components/Checkbox/CustomCheckbox';
import {useMount} from '../../../commonHooks';

const styles = StyleSheet.create({
  headerTitle: {
    paddingTop: 4,
    fontSize: 15,
    color: COLORS.ITEM_TITLE,
    ...FONTS.regular,
    paddingBottom: normal,
  },
  itemContainer: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    paddingHorizontal: normal,
    paddingVertical: small,
    marginBottom: normal,
    borderRadius: 4,
    position: 'relative',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    ...FONTS.regular,
    color: COLORS.BLACK_33,
  },
  // itemDescription: {
  //   fontSize: 10,
  //   ...FONTS.regular,
  //   color: COLORS.BLACK_33,
  // },
  itemCheckbox: {
    height: CONSTANTS.ITEM_HEIGHT - micro,
    marginLeft: normal,
  },
});

type ListSupportTypesProps = {
  items: [{name: String, id: String, selected: Boolean}],
  onSelected: (ids: [String]) => {},
};

const ListSupportTypes = ({items = [], onSelectItem}: ListSupportTypesProps) => {
  return (
    <View>
      <Text style={styles.headerTitle}>{translate(STRINGS.SELECT_SEVICE)}</Text>
      {items &&
        items.map((item, index) => (
          <TouchableWithoutFeedback onPress={() => onSelectItem(index)} key={index}>
            <View style={styles.itemContainer}>
              <View>
                <Text style={styles.itemTitle}>{item.name}</Text>
                {/* <Text style={styles.itemDescription}>
                  ({translate(STRINGS.REFERENCE_PRICE)}:{' '}
                  <Text style={{...FONTS.bold}}>
                    {item.price} {item.unitOfMeasureName}
                  </Text>
                  )
                </Text> */}
              </View>
              <CustomCheckbox
                images={['checkbox', 'checkbox-blank-outline']}
                customCheckedBox
                iconCheckedColor={COLORS.PRIMARY_A100}
                iconColor={COLORS.GRAY_C9}
                shouldGetValueOutSide
                style={styles.itemCheckbox}
                parentCheckedValue={item.selected}
                disabled={true}
              />
            </View>
          </TouchableWithoutFeedback>
        ))}
    </View>
  );
};

export const useServices = () => {
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState(null);

  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useGetPlusServicesLazyQuery,
    dataField: 'plusServices',
    queryOptions: {...FETCH_POLICY.CACHE_AND_NETWORK},
    showSpinner: false,
    onError: () => {},
    onSuccess: (response: {edges?: [RequestTypeDto]}) => {
      const services = response?.edges?.map(service => ({
        id: service.requestTypeId,
        name: service.requestTypeDescription,
        selected: false,
      }));
      setItems(services);
    },
  });

  useMount(() => {
    startApi({variables: {orderBy: {sortOrder: 'ASC'}}});
  });

  const onSelectItem = index => {
    const itemsTmp = [...items];
    itemsTmp[index].selected = !itemsTmp[index].selected;
    setItems(itemsTmp);

    const ids = items
      .filter(e => {
        return e.selected;
      })
      .map(item => item.id);

    setSelectedIds(ids);
  };

  return {
    items,
    selectedIds,
    onSelectItem,
  };
};

export default ListSupportTypes;
