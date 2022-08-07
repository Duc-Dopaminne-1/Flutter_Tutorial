import React, {useEffect, useState} from 'react';

import {useGetProjectAssigneeForContactTradingB2CLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {commonStyles} from '../../../assets/theme/styles';
import DropdownWithTitle from '../../../components/DropdownWithTitle';

const SearchProjectDropdown = ({filterData, state, onChosen}) => {
  const [listProjectAssignee, setProjectAssignee] = useState([]);
  const onSuccessGetProjectAssignee = response => {
    const projectTemp = response?.edges.map(item => ({
      id: item.projectId,
      name: item.projectName,
      description: item.projectName,
      checked: item?.projectId === filterData?.projectSelect?.id ? true : false,
    }));
    setProjectAssignee(projectTemp);
  };

  const {startApi: getProjectFilter} = useGraphqlApiLazy({
    graphqlApiLazy: useGetProjectAssigneeForContactTradingB2CLazyQuery,
    dataField: 'getProjectAssigneeForContactTradingB2C',
    onSuccess: onSuccessGetProjectAssignee,
  });

  const [textSearch, setTextSearch] = useState('');

  const onChangeText = e => {
    setTextSearch(e);
  };

  useEffect(() => {
    getProjectFilter({
      variables: {
        keyWords: textSearch,
        pageSize: 10,
        page: 1,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textSearch]);

  return (
    <DropdownWithTitle
      inputStyle={{...commonStyles.inputBorderStyle}}
      title={translate(STRINGS.PROJECT)}
      dropdownTitle={translate(STRINGS.SELECT_PROJECT)}
      popupTitle={translate(STRINGS.PROJECT)}
      items={listProjectAssignee}
      onChosen={onChosen}
      isSelectSingle={true}
      isHaveAll={true}
      emptyText={translate(STRINGS.DO_NOT_HAVE_DATA)}
      value={state?.projectSelect?.name || false}
      showSearchBox={false}
      canSearchServer={true}
      onChangeText={onChangeText}
    />
  );
};

export default SearchProjectDropdown;
