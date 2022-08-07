import React, { ReactElement, memo, useEffect, useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { colors } from '@/vars';
import { CustomLine } from '@/components/CustomeLine';
import ShareContactItemName from '@/screens/ShareContact/component/ShareContactItemName';
import { Contact, shareContacts } from '@/shared/shareContacts';
import { UpdateTotalSelectContact } from '@/shared/global';
import CheckSVG from '@/components/SVG/CheckSVG';
import CheckedSVG from '@/components/SVG/CheckedSVG';

interface ShareContactItemProps {
  item: Contact;
}
function ShareContactItem(props: ShareContactItemProps): ReactElement {
  const {
    item: { key, value, phone, isSelected, isInvited },
  } = props;
  const [isChecked, setIsChecked] = useState(false);
  const icon = isInvited ? <CheckSVG /> : isChecked ? <CheckedSVG /> : <CheckSVG />;

  useEffect(() => {
    if (isChecked !== isSelected) {
      setIsChecked(isSelected);
    }
  }, [isSelected]);

  const onPress = () => {
    if (isInvited) return;

    if (isChecked) {
      shareContacts.unSelected(key);
    } else {
      shareContacts.selected(key);
    }
    setIsChecked(!isChecked);
    UpdateTotalSelectContact.next(true);
  };

  return (
    <Pressable hitSlop={20} onPress={onPress} style={[styles.container, isInvited && styles.hideView]}>
      <View style={styles.wrapItem}>
        <ShareContactItemName value={value} phone={phone} />
        <View style={styles.wrapCheckBox}>{icon}</View>
      </View>
      <CustomLine />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingLeft: 15,
    paddingRight: 20,
    paddingBottom: 20,
    paddingTop: 14,
  },
  wrapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapCheckBox: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  hideView: {
    opacity: 0.4,
  },
});

export default memo(ShareContactItem);
