import React, {useEffect, useState} from 'react';
import {View} from 'react-native';

import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import ErrorText from '../../../../components/ErrorText';
import RadioSelectionsView, {ITEM_TYPE} from '../../../../components/RadioSelectionsView';

const postTypes = [
  {
    id: 0,
    name: translate(STRINGS.SELLING),
    checked: true,
  },
  {
    id: 1,
    name: translate('common.forRent'),
    checked: false,
  },
  {
    id: 2,
    name: translate('common.sellingAndRent'),
    checked: false,
  },
];
const mapListPostType = postType => {
  const mappingList = postTypes;
  if (postType?.forSale && postType?.forRent) {
    mappingList.map(e => ({
      ...e,
      checked: e.id === 2,
    }));
  } else if (postType?.forRent) {
    mappingList.map(e => ({
      ...e,
      checked: e.id === 1,
    }));
  } else {
    mappingList.map(e => ({
      ...e,
      checked: e.id === 0,
    }));
  }
  return mappingList;
};
const PostTypeInput = ({state, onChoosePostType = () => {}, error, style = {}}) => {
  const [dataPostTypes, setDataPostTypes] = useState(postTypes);
  useEffect(() => {
    setDataPostTypes(mapListPostType(state?.postType));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.postType]);

  const onChoose = item => {
    switch (item?.id) {
      case 0:
        onChoosePostType({forSale: true, forRent: false});
        break;
      case 1:
        onChoosePostType({forSale: false, forRent: true});
        break;
      case 2:
        onChoosePostType({forSale: true, forRent: true});
        break;
      default:
        onChoosePostType({forSale: true, forRent: false});
        break;
    }
  };
  return (
    <View style={style}>
      <RadioSelectionsView
        type={ITEM_TYPE.ROW_SPACE}
        headerTitle={translate('newPost.postType')}
        headerStyle={[commonStyles.blackTextBold20, METRICS.smallMarginBottom]}
        checkedStyle={commonStyles.radioSelectedPrimary}
        uncheckedStyle={commonStyles.radio}
        data={dataPostTypes}
        onChosen={onChoose}
        titleStyle={HELPERS.noneFill}
      />
      <ErrorText errorText={error} />
    </View>
  );
};

export default PostTypeInput;
