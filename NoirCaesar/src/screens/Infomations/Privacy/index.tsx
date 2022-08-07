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
import HTML from 'react-native-render-html';
import { ScrollView } from 'react-native';

const Privacy = () => {
  const disatch = useDispatch();
  const content = useSelector<RootState, string>((state: RootState) => state.pageContent.policy.content);

  useEffect(() => {
    disatch(
      getPageContent({
        page_type: PageTypeListEnum.Policy,
      }),
    );
  }, []);

  const onBack = () => {
    NavigationActionsService.pop();
  };

  return (
    <Container>
      <CustomHeader title={translate('information.privacy')} leftImage={BACK} leftAction={onBack} />
      <ScrollView>
        <HTML containerStyle={styles.webView} html={content} allowFontScaling={false} />
      </ScrollView>
    </Container>
  );
};

export default Privacy;
