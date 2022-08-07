import findIndex from 'lodash/findIndex';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';

import {useGetRequestTypesLazyQuery} from '../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../api/graphql/useGraphqlApiLazy';
import {CONSULT_PROPERTY_POST_SUPPORT_TYPE} from '../assets/constants';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {small} from '../assets/theme/metric';
import {commonStyles} from '../assets/theme/styles';
import DropdownWithTitle from './DropdownWithTitle';

const listNotInDefault = [
  'KeyKeeperAndHouseViewing',
  'VerificationPost',
  'AdvancedVerificationPost',
  'PostImprovementAndBasicVerification',
  'Certification',
  'ConsultingSupply',
  'ContactTrading',
  'ConsultPropertyPost',
  'RefundDeposite',
];

const styles = StyleSheet.create({
  dropdown: {
    marginVertical: small,
  },
});

const SelectRequestType = ({
  onSelected,
  error,
  disabled,
  typeNotIns,
  defaultValue,
  queryOptions,
  showSearchBox = false,
}) => {
  const [items, setItems] = useState([]);
  const errorMessage = error ? translate(error) : null;
  const onSuccess = data => {
    if (data && data.edges) {
      const list = data.edges;
      let itemTmp = list.map(item => {
        return {
          id: item.requestTypeId,
          key: item.requestTypeName,
          name: item.requestTypeDescription,
          checked: item.requestTypeName === defaultValue,
        };
      });
      if (typeNotIns && typeNotIns.length) {
        itemTmp = itemTmp.filter(item => {
          return typeNotIns.indexOf(item.key) === -1;
        });
      }
      setItems(itemTmp);
      const index = findIndex(itemTmp, {checked: true});
      if (index !== -1) {
        onSelected({...itemTmp[index]});
      }
    }
  };

  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useGetRequestTypesLazyQuery,
    queryOptions: queryOptions,
    dataField: 'requestTypes',
    onSuccess,
  });

  useEffect(() => {
    let listNotIn = [...listNotInDefault];
    if (defaultValue === CONSULT_PROPERTY_POST_SUPPORT_TYPE) {
      listNotIn = listNotInDefault.filter(e => e !== CONSULT_PROPERTY_POST_SUPPORT_TYPE);
    }
    startApi({
      variables: {
        where: {
          requestTypeName_not_in: listNotIn,
        },
        orderBy: {
          sortOrder: 'ASC',
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DropdownWithTitle
      title={translate(STRINGS.WHAT_YOU_WANT_TO_ADVICE)}
      inputStyle={commonStyles.dropdownInput}
      dropdownTitle={translate(STRINGS.PLEASE_SELECT)}
      items={items}
      showSearchBox={showSearchBox}
      style={styles.dropdown}
      itemSelected={onSelected}
      error={errorMessage}
      isRequired={true}
      disabled={disabled}
    />
  );
};

SelectRequestType.propTypes = {
  onSelected: PropTypes.func,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  typeNotIns: PropTypes.array,
  defaultValue: PropTypes.string,
};

SelectRequestType.defaultProps = {
  onSelected: () => {},
  error: null,
  typeNotIns: [],
  disabled: false,
  defaultValue: null,
};

export default SelectRequestType;
