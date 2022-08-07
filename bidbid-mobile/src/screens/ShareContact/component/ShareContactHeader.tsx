import React, { ReactElement, memo, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import CustomHeader from '@/components/CustomHeader';
import { language } from '@/i18n';
import { colors } from '@/vars';
import { isIOS } from '@/shared/devices';
import { UpdateTotalSelectContact } from '@/shared/global';
import { shareContacts } from '@/shared/shareContacts';
import IconBack from '@/components/SVG/BackSvg';

function ShareContactHeader(): ReactElement {
  const [title, setTitle] = useState('');

  useEffect(() => {
    const UpdateTotalSelectContactSubscribe = UpdateTotalSelectContact.subscribe(_data => {
      const totalSelect = shareContacts.getTotalSelect();
      if (totalSelect > 0) {
        setTitle(`(${totalSelect} ${totalSelect > 1 ? language('selectedPlural') : language('selected')})`);
        return;
      }
      setTitle('');
    });

    return () => {
      UpdateTotalSelectContactSubscribe && UpdateTotalSelectContactSubscribe.unsubscribe();
    };
  }, []);

  return (
    <CustomHeader
      leftIcon={<IconBack />}
      subTitle={title}
      title={language('selectRecipients')}
      titleStyle={styles.textTitle}
      iconContainerStyle={styles.iconContainerStyle}
    />
  );
}

const styles = StyleSheet.create({
  iconContainerStyle: {
    marginHorizontal: 14,
  },
  textTitle: {
    color: colors.title_grey,
    fontWeight: isIOS ? '600' : 'bold',
  },
});

export default memo(ShareContactHeader);
