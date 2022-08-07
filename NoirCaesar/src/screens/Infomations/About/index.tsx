import React, { useEffect } from 'react';
import Container from '@components/Container';
import styles from './styles';
import translate from '@src/localize';
import { BACK } from '@src/constants/icons';
import { CustomHeader } from '@src/components/CustomHeader';
import NavigationActionsService from '@src/navigation/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getPageContent } from '@src/modules/pageContent/actions';
import { PageTypeListEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/page_content';
import { RootState } from '@src/types/types';
import { CustomText } from '@src/components/CustomText';
import { Image, View, ScrollView } from 'react-native';
import IC_LOGO from '@res/images/ic_logo.png';
import HTML from 'react-native-render-html';

const About = () => {
  const disatch = useDispatch();
  const content = useSelector<RootState, string>((state: RootState) => state.pageContent.about.content);

  useEffect(() => {
    disatch(
      getPageContent({
        page_type: PageTypeListEnum.About,
      }),
    );
  }, []);

  const onBack = () => {
    NavigationActionsService.toggleDrawer(true);
  };

  return (
    <Container>
      <CustomHeader title={translate('information.about')} leftImage={BACK} leftAction={onBack} />
      <View style={styles.container}>
        <Image source={IC_LOGO} style={styles.image} />
        <CustomText style={styles.ourMission} text={translate('information.our_mission')} />
      </View>
      <ScrollView>
        <HTML containerStyle={styles.webView} html={content} allowFontScaling={false} />
      </ScrollView>
    </Container>
  );
};

export default About;
