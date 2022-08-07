import { styles } from './styles';
import { Divider } from '../../../components/';
import { scale } from '../../../utils/responsive';
import React, { useEffect } from 'react';
import MenuCard from './components/menu_card';
import { getFAQListHandle } from '../../../redux/actions/faq';
import PrimaryButton from '../../../components/primary_button';
import SafeAreaView from 'react-native-safe-area-view';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, ActivityIndicator, View } from 'react-native';
import SCREENS_NAME from '../../../constants/screens';

const FQA = ({ navigation }) => {
  const list = useSelector(state => state.faq.faqList);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFAQListHandle());
  }, [dispatch]);

  const goToCreateQuestion = () => {
    navigation.navigate(SCREENS_NAME.CREATE_SUPPORT_SCREEN);
  };

  return (
    <SafeAreaView forceInset={{ bottom: 'never' }} style={styles.container}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {list ? (
          list.map(t => {
            const onPress = () => {
              navigation.navigate(SCREENS_NAME.FAQ_DETAILS, { item: t });
            };
            return (
              <React.Fragment key={'' + t.id + t.title}>
                <MenuCard
                  imageUrl={t.imageUrl}
                  onPress={onPress}
                  title={t.title}
                  style={{ paddingVertical: scale(12) }}
                />
                <Divider style={styles.line} />
              </React.Fragment>
            );
          })
        ) : (
          <ActivityIndicator />
        )}
      </ScrollView>

      <View style={styles.action}>
        <PrimaryButton translate onPress={goToCreateQuestion} title={'create_question.name'} />
      </View>
    </SafeAreaView>
  );
};

export default FQA;
