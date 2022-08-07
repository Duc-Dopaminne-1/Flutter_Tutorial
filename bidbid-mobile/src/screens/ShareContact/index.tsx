import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { AlphabetList } from 'react-native-section-alphabet-list';
import { StyleSheet, View } from 'react-native';
import { Contact, shareContacts } from '@/shared/shareContacts';
import { colors, fonts } from '@/vars';
import ShareContactTitle from '@/screens/ShareContact/component/ShareContactTitle';
import ShareContactItem from '@/screens/ShareContact/component/ShareContactItem';
import NavigationActionsService from '@/navigation/navigation';
import ShareContactButton from '@/screens/ShareContact/component/ShareContactButton';
import { SafeArea } from '@/components/SafeArea';
import ShareContactHeader from '@/screens/ShareContact/component/ShareContactHeader';
import { shareContact } from '@/shared/global';
import { getListInvited, sendInvite } from '@/redux/user/actions';
import SearchBar from '@/screens/Profile/ProfileEditSchoolSearch/components/SearchBar';
import { language } from '@/i18n';
import { getCountryCode } from '@/redux/app/actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PNF = require('google-libphonenumber').PhoneNumberFormat;

export function ShareContactScreen(): ReactElement {
  const [shouldShowLater, setShouldShowLater] = useState(false);
  const [data, setData] = useState(shareContacts.getContact());
  let laterRef: any = useRef(null);

  useEffect(() => {
    shareContacts.setResetSelect();
    NavigationActionsService.showLoading();

    NavigationActionsService.dispatchAction(
      getListInvited({
        onSuccess: data => {
          if (data && data.length > 0) {
            shareContacts.filterContactInvited(data);
            setData(shareContacts.getContact());
          }
          shareContacts.prepareSelectAll();
          setTimeout(() => {
            NavigationActionsService.hideLoading();
          }, 1000);
        },
        onFail: () => {
          NavigationActionsService.hideLoading();
        },
      }),
    );
  }, []);

  const onScrollBeginDrag = () => {
    setShouldShowLater(true);
  };

  const onScrollEndDrag = () => {
    if (laterRef.current !== null) {
      clearTimeout(laterRef.current);
    }
    laterRef.current = setTimeout(() => {
      if (shouldShowLater) {
        setShouldShowLater(false);
      }
    }, 3000);
  };

  const renderItem = item => <ShareContactItem item={item} />;

  const onPressInvite = () => {
    NavigationActionsService.showLoading();
    NavigationActionsService.dispatchAction(
      getCountryCode({
        onSuccess: data => {
          const { country_code } = data;
          const listPhone = shareContacts.getSelected().map(item => {
            const number = phoneUtil.parseAndKeepRawInput(item, country_code);
            return phoneUtil.format(number, PNF.E164);
          });
          NavigationActionsService.dispatchAction(
            sendInvite({
              phoneNumbers: listPhone,
              onSuccess: () => {
                NavigationActionsService.hideLoading();
                NavigationActionsService.goBack();
                setTimeout(() => {
                  shareContact.next({ title: language('inviteSent') });
                }, 500);
              },
              onFail: () => {
                NavigationActionsService.hideLoading();
                NavigationActionsService.goBack();
              },
            }),
          );
        },
        onFail: () => {
          NavigationActionsService.hideLoading();
        },
      }),
    );
  };

  const onChangeSuggestResult = (data: Contact[]) => {
    setData(data);
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <ShareContactHeader />
      <SearchBar
        isFromContact
        inputData={shareContacts.getContact()}
        onChangeSuggestResult={onChangeSuggestResult}
        searchField="value"
        searchFieldSecond="phone"
        searchPlaceholderText={language('searchContacts')}
      />

      <AlphabetList
        style={styles.wrapAlphabetList}
        indexContainerStyle={styles.wrapContact}
        data={data}
        extraData={data}
        onScrollBeginDrag={onScrollBeginDrag}
        onMomentumScrollEnd={onScrollEndDrag}
        indexLetterStyle={!shouldShowLater ? styles.hideText : styles.textLater}
        renderCustomItem={renderItem}
        renderCustomSectionHeader={section => <ShareContactTitle title={section.title} />}
        legacyImplementation={false}
        horizontal={false}
        stickySectionHeadersEnabled
        windowSize={121}
        removeClippedSubviews={false}
        initialNumToRender={30}
        updateCellsBatchingPeriod={1}
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={50}
        viewabilityConfig={{
          waitForInteraction: true,
          viewAreaCoveragePercentThreshold: 95,
        }}
      />
      <ShareContactButton onPress={onPressInvite} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapAlphabetList: {
    flex: 1,
  },
  textLater: {
    color: colors.blue_700,
    fontSize: fonts.size.s14,
    fontFamily: fonts.family.RobotoRegular,
    marginTop: 0,
  },
  hideText: {
    marginRight: 100,
  },
  wrapContact: {
    position: 'absolute',
    right: 4,
  },
});
