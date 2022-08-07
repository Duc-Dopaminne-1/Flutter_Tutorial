import React, { useContext, useMemo } from 'react';
import moment from 'moment';
import styles from './styles';
import { insurance01 } from '../../../../assets/images';
import { useNavigation } from '@react-navigation/native';
import { View, Text, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native';
import { DEVICE_WIDTH } from '../../../../constants/size';
import themeContext from '../../../../constants/theme/themeContext';

const DATA = [
  {
    id: '1',
    createdAt: '2021-05-09T16:06:33.566Z',
    name: 'Madelyn Jacobs',
    avatar: 'avatar 1',
    IDnumber: 94529
  },
  {
    id: '2',
    createdAt: '2021-05-09T09:50:01.599Z',
    name: 'Kiana Ledner',
    avatar: 'avatar 2',
    IDnumber: 20383
  },
  {
    id: '3',
    createdAt: '2021-05-10T07:58:19.602Z',
    name: 'Emmanuelle Marks',
    avatar: 'avatar 3',
    IDnumber: 89666
  },
  {
    id: '4',
    createdAt: '2021-05-09T15:51:11.670Z',
    name: 'Alena Christiansen',
    avatar: 'avatar 4',
    IDnumber: 704
  },
  {
    id: '5',
    createdAt: '2021-05-09T20:21:07.783Z',
    name: 'Khalid Kuhn',
    avatar: 'avatar 5',
    IDnumber: 16611
  },
  {
    id: '6',
    createdAt: '2021-05-10T07:28:57.877Z',
    name: 'Natalia Rice',
    avatar: 'avatar 6',
    IDnumber: 98098
  },
  {
    id: '7',
    createdAt: '2021-05-10T01:56:06.711Z',
    name: 'Miss Thelma DuBuque',
    avatar: 'avatar 7',
    IDnumber: 98787
  },
  {
    id: '8',
    createdAt: '2021-05-10T08:34:42.134Z',
    name: 'Chanelle Krajcik',
    avatar: 'avatar 8',
    IDnumber: 57637
  },
  {
    id: '9',
    createdAt: '2021-05-09T12:25:28.497Z',
    name: 'Ms. Albert Satterfield',
    avatar: 'avatar 9',
    IDnumber: 75591
  },
  {
    id: '10',
    createdAt: '2021-05-10T06:06:44.318Z',
    name: 'Gerald Mraz',
    avatar: 'avatar 10',
    IDnumber: 10712
  }
];

const ListFooterComponent = () => <View style={styles.listFooterComponent} />;

const ASpList = ({ currenntIndex, insuranceProfile = false }) => {
  const ref = React.useRef(null);
  const navigation = useNavigation();
  const { fonts } = useContext(themeContext);

  const styleText = useMemo(
    () => ({
      ...styles.nomalText,
      fontFamily: fonts?.REGULAR
    }),
    [styles, fonts]
  );

  React.useEffect(() => {
    const x = currenntIndex * DEVICE_WIDTH;
    ref.current.scrollTo({ x });
  }, [currenntIndex]);

  const keyExtractor = item => item.id + '';
  const renderItem = ({ item }) => {
    const date = moment(item.createdAt).format('DD/MM/YYYY');
    const onPress = () => {
      if (insuranceProfile) {
        navigation.navigate('InsuranceRecordDetails');
      }
    };

    return (
      <TouchableOpacity onPress={onPress} style={styles.profileWrapper}>
        <View style={styles.avatarWrapper}>
          <Image style={styles.avatar} source={insurance01} resizeMode="stretch" />
        </View>
        <View style={styles.profileContentWrapper}>
          <View style={styles.profileConten01}>
            <Text style={[styles.customerName, { fontFamily: fonts.MEDIUM }]}>{item.name}</Text>
            <Text style={styleText}>{'#' + item.IDnumber}</Text>
          </View>
          <View style={styles.profileConten01}>
            <Text style={styleText}>{item.IDnumber + '52114521'}</Text>
            <Text style={styleText}>{date}</Text>
          </View>
          <View style={styles.dot} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView ref={ref} horizontal scrollEnabled={false} style={styles.contentWrapper}>
      <View style={styles.content}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={ListFooterComponent}
        />
      </View>
      <View style={styles.content}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={ListFooterComponent}
        />
      </View>
      <View style={styles.content}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={ListFooterComponent}
        />
      </View>
      <View style={styles.content}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={ListFooterComponent}
        />
      </View>
    </ScrollView>
  );
};

ASpList.propTypes = {
  // bla: PropTypes.string,
};

ASpList.defaultProps = {
  // bla: 'test',
};

export default ASpList;
