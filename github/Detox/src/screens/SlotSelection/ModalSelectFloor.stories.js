import {storiesOf} from '@storybook/react-native';
import React, {createRef, useEffect} from 'react';
import {View} from 'react-native';

import {HELPERS} from '../../assets/theme/helpers';
import {ModalSelectFloor} from './ModalSelectFloor';

storiesOf('z|b2c/SelectFloorModal', module) //format
  .add('default!', () => {
    const props = {
      // eslint-disable-next-line no-alert
      onApplyFilter: arraySelect => alert(arraySelect),
      floorData: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    };
    const modalRef = createRef();

    useEffect(() => {
      modalRef.current.open();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <View style={HELPERS.fill}>
        <ModalSelectFloor ref={modalRef} {...props} />
      </View>
    );
  });
