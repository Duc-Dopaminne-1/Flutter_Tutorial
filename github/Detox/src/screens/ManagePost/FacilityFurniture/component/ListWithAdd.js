import PropTypes from 'prop-types';
import React, {useEffect} from 'react';

import IconTextButton from '../../../../components/IconTextButton';
import TextItem from '../../../../components/TextItem';
import ScreenIds from '../../../ScreenIds';

const ListWithAdd = ({items, screenId, addText, limitNumber, onAddItem, onEditItem}) => {
  const [isShowAdd, setIsShowAdd] = React.useState(true);

  useEffect(() => {
    items.length >= limitNumber ? setIsShowAdd(false) : setIsShowAdd(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <>
      {items.map((item, index) => {
        let name = item.name;
        if (screenId === ScreenIds.NewPostAddFacility) {
          name = `${item.name} (${item.distance} km) `;
        }
        return <TextItem key={item.name + index} title={name} onPress={() => onEditItem(item)} />;
      })}
      {isShowAdd && (
        <IconTextButton onPress={onAddItem} imageName="ios-add-circle" title={addText} />
      )}
    </>
  );
};

ListWithAdd.propTypes = {
  items: PropTypes.array.isRequired,
  setItems: PropTypes.func.isRequired,
  screenId: PropTypes.string.isRequired,
  addText: PropTypes.string,
  limitNumber: PropTypes.number,
};

ListWithAdd.defaultProps = {
  items: [],
  setItems: () => {},
  screenId: '',
  addText: '',
  limitNumber: 9,
};

export default ListWithAdd;
