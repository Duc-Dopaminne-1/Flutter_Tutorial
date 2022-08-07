import React, { ReactElement, useState, memo } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { colors, fonts } from '@/vars';
import { CreateAuctionTitle } from '@/screens/CreateAuction/component/CreateAuctionTitle';
import { language } from '@/i18n';
import { CreateAuctionPlace } from '@/screens/CreateAuction/component/CreateAuctionPlace';
import { TypeMG } from '@/constants/app';
import ErrorMessage from '@/components/ErrorMessage';
import CreateAuctionDurationItem from './CreateAuctionDurationItem';

function CreateAuctionTypeMeet({ setFieldValue, errors, setFieldError, onSelectTypePlace }): ReactElement {
  const [activeSections, setActiveSections] = useState([]);

  const SECTIONS = [
    {
      id: '0',
      title: language('zoom'),
    },
    {
      id: '1',
      title: language('meetPerson'),
    },
  ];

  const renderContent = () => {
    if (activeSections.includes(1)) {
      return (
        <View style={styles.wrapContent}>
          <CreateAuctionPlace setFieldError={setFieldError} setFieldValue={setFieldValue} errors={errors} />
        </View>
      );
    }
    if (activeSections.includes(0)) {
      return (
        <View style={styles.wrapContent}>
          <Text style={styles.textVideo}>{language('videoCall')}</Text>
        </View>
      );
    }
    return null;
  };

  const updateSections = activeSections => {
    if (activeSections.includes(1)) {
      onSelectTypePlace(TypeMG.Offline, setFieldValue, setFieldError);
    } else if (activeSections.includes(0)) {
      onSelectTypePlace(TypeMG.Online, setFieldValue, setFieldError);
    } else {
      onSelectTypePlace(null, setFieldValue, setFieldError);
    }
    setActiveSections(activeSections);
  };

  const renderTitle = () => {
    return (
      <View style={styles.wrapHeader}>
        <FlatList
          data={SECTIONS}
          scrollEnabled={false}
          numColumns={2}
          renderItem={({ item }) => {
            const selected =
              (activeSections.includes(0) && item.id === SECTIONS[0].id) || (activeSections.includes(1) && item.id === SECTIONS[1].id);
            return (
              <CreateAuctionDurationItem
                style={styles.typeItem}
                itemId={selected ? parseInt(item.id) : -1}
                onPress={item => updateSections([parseInt(item.id.toString())])}
                item={{ name: item.title, id: parseInt(item.id) }}
              />
            );
          }}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CreateAuctionTitle isRequire title={language('placeMeetGreet')} />
      {renderTitle()}
      {renderContent()}
      <ErrorMessage errorValue={errors.typeMeet} />
    </View>
  );
}

export default memo(CreateAuctionTypeMeet);

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  wrapHeader: {
    flexDirection: 'row',
    marginLeft: -6,
    marginRight: -6,
  },
  wrapContent: {
    marginTop: 18,
  },
  textVideo: {
    color: colors.gray_500,
    fontSize: fonts.size.s14,
    fontFamily: fonts.family.PoppinsRegular,
  },
  typeItem: {
    flex: 1,
    flexGrow: 1,
    marginLeft: 6,
    marginRight: 6,
  },
});
