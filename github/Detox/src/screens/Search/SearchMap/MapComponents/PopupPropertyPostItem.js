import PropTypes from 'prop-types';
import React from 'react';

import {
  useGetShortPropertyPostByIdForPublicLazyQuery,
  useGetShortPropertyPostByIdLazyQuery,
} from '../../../../api/graphql/generated/graphql';
import {ITEM_TYPE} from '../../../../assets/constants';
import PropertyItemGuarantee from '../../../../components/PropertyItem/PropertyItemGuarantee';
import {useNotLoggedIn} from '../../../Auth/useLogin';
import {mapPropertyC2CGuarantee} from '../../../Home/TopenerOfMonth/types';
import {useFormatPrice} from '../../../Home/useFormatPrice';
import PopupSearchItem from './PopupSearchItem';

const renderPropertyItem = ({
  data,
  onPress,
  formatPrice,
  actions,
  isOnRentalTab = false,
  isCreateUser = false,
}) => {
  if (!data) {
    return null;
  }
  const propertyInfo = mapPropertyC2CGuarantee(data, formatPrice, isCreateUser);

  return (
    <PropertyItemGuarantee
      actions={actions}
      onPress={onPress}
      {...propertyInfo}
      showPriceDetailForRent={isOnRentalTab}
      itemType={ITEM_TYPE.full}
      showBrokenInfo={false}
      isShowStatus
      showForRentBanner={false}
    />
  );
};

const PopupPropertyPostItem = ({style, propertyPostId, isCreateUser, onPress, isOnRentalTab}) => {
  const {formatPrice} = useFormatPrice();
  const notLoggedIn = useNotLoggedIn();
  return (
    <PopupSearchItem
      style={style}
      queryGraphql={
        notLoggedIn
          ? useGetShortPropertyPostByIdForPublicLazyQuery
          : useGetShortPropertyPostByIdLazyQuery
      }
      variables={{propertyPostId}}
      fieldData={notLoggedIn ? 'propertyPostDetail' : 'propertyPostById'}
      renderItem={(data, actions) =>
        renderPropertyItem({data, onPress, isCreateUser, isOnRentalTab, formatPrice, actions})
      }
    />
  );
};

PopupPropertyPostItem.propTypes = {
  propertyPostId: PropTypes.string,
  onPress: PropTypes.func,
};

PopupPropertyPostItem.defaultProps = {
  propertyPostId: '',
  onPress: () => {},
};
export default PopupPropertyPostItem;
