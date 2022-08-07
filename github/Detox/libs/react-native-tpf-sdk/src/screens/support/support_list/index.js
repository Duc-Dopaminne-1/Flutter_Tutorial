import { useNavigation } from '@react-navigation/native';
import { CommonTabHeader, SubHead } from '../../../components/';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from '../../../constants/colors';
import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { useSelector, useDispatch } from 'react-redux';
import ClosedTab from './tabs/closed_tab';
import PendingTab from './tabs/pending_tab';
import ProgressingTab from './tabs/progressing_tab';
import { getFAQSupportSummaryHandle } from '../../../redux/actions/faq';
import { FONT_FAMILY } from '../../../constants/appFonts';
import SCREENS_NAME from '../../../constants/screens';
import themeContext from '../../../constants/theme/themeContext';

const Support = props => {
  const { disableShadow } = props;
  const theme = useContext(themeContext);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState(0);
  const memberId = useSelector(state => state.auth.memberId);
  const processingCount = useSelector(state => state.faq.faqProcessingSupportListCount);
  const waitingCount = useSelector(state => state.faq.faqWaitingSupportListCount);
  const closedCount = useSelector(state => state.faq.faqClosedSupportListCount);

  const TabItem = [
    {
      id: 0,
      title: 'support.processing',
      count: `${processingCount || 0}`,
      tab: tabProps => <ProgressingTab route={props.route} {...tabProps} />
    },
    {
      id: 1,
      title: 'support.waiting_for_response',
      count: `${waitingCount || 0}`,
      tab: tabProps => <PendingTab route={props.route} {...tabProps} />
    },
    {
      id: 2,
      title: 'support.closed',
      count: `${closedCount || 0}`,
      tab: tabProps => <ClosedTab route={props.route} {...tabProps} />
    }
  ];
  useEffect(() => {
    dispatch(
      getFAQSupportSummaryHandle({
        params: {
          MemberId: memberId
        }
      })
    );
  }, [memberId, tabIndex, dispatch]);

  useEffect(() => {
    navigation.setOptions({
      disableShadow: typeof disableShadow !== 'undefined' ? disableShadow : true,
      RightComponent: () => {
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREENS_NAME.CREATE_SUPPORT_SCREEN, {})}>
            <SubHead translate semiBold color={theme.app.primaryColor1}>
              {'support.create_new'}
            </SubHead>
          </TouchableOpacity>
        );
      }
    });
  }, [navigation]);

  return (
    <SafeAreaView forceInset={{ bottom: 'never' }} style={styles.container}>
      <View style={styles.wrapper}>
        <CommonTabHeader
          justify
          translate
          tabs={TabItem}
          tabIndex={tabIndex}
          onPress={setTabIndex}
        />
        {TabItem[tabIndex].tab()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: BACKGROUND_COLOR.Primary,
    flex: 1
  },
  wrapper: {
    backgroundColor: CUSTOM_COLOR.White,
    flex: 1
  },
  rightHeaderButton: {}
});

export default React.memo(Support);
