import {isEmpty} from 'lodash';
import React, {useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SpringScrollView} from 'react-native-spring-scrollview';

import {CONSTANTS, ITEM_TYPE, PROJECT_STATUS} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal, small, tiny} from '../../../assets/theme/metric';
import Avatar from '../../../components/Avatar';
import BaseScreen from '../../../components/BaseScreen';
import ImageProgress from '../../../components/ImageProgress';
import LinkTextButton from '../../../components/LinkTextButton';
import ProjectItem from '../../../components/ProjectItem';
import ScrollViewHeader from '../../../components/ScrollViewHeader';
import {mapSearchItemUi} from '../../../components/SearchProjectItem/types';
import {SizeBox} from '../../../components/SizeBox';
import useGetDetailInvestor from '../../../hooks/useGetDetailInvestor';
import {checkValidImageUrl} from '../../../utils/ImageUtil';
import {redirectToURL} from '../../../utils/UiUtils';
import {useFormatPrice} from '../../Home/useFormatPrice';
import ScreenIds from '../../ScreenIds';
import {mapToUiModel} from './InvestorInformationList';

const getTotalCountStatusFromProjectStatus = (projectStatus, status) => {
  if (!projectStatus || !projectStatus?.length || !status) return 0;
  return projectStatus?.find(p => p?.statusName === status)?.count || 0;
};

const ProjectInvestoItem = ({item, updateProject, navigation, formatPrice}) => {
  const mappingItem = mapSearchItemUi(item, formatPrice);

  const onPressItem = () => {
    navigation.navigate(ScreenIds.ProjectDetail, {
      projectId: item.projectId,
    });
  };
  return (
    <ProjectItem
      key={item.projectId}
      onPress={onPressItem}
      actions={{
        updateItem: updateProject,
      }}
      style={{marginBottom: SIZES.MARGIN_16}}
      projectInfo={mappingItem}
      containerStyle={{marginTop: SIZES.MARGIN_16}}
      itemType={ITEM_TYPE.full}
    />
  );
};

const ProjectInvestor = ({
  projectOfInvestor = [],
  formatPrice,
  navigation,
  pressMoreProjectInvestor,
}) => {
  const [items, setItems] = useState(projectOfInvestor);

  const updateProject = item => {
    const tempItem = [...items];
    const foundIndex = tempItem.findIndex(i => i.projectId === item.projectId);
    if (foundIndex >= 0) {
      tempItem[foundIndex] = {...tempItem[foundIndex], ...item};
    }
    setItems([...tempItem]);
  };

  return (
    <View style={{padding: normal}}>
      {items?.map(item => (
        <ProjectInvestoItem
          formatPrice={formatPrice}
          key={item.projectId}
          navigation={navigation}
          item={item}
          updateProject={updateProject}
        />
      ))}
      <TouchableOpacity onPress={pressMoreProjectInvestor}>
        <Text style={styles.textViewMoreProject}>{translate('common.viewMore')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const IntroductionView = ({introduction}) => {
  const goToWebsite = () => {
    redirectToURL(introduction?.website);
  };

  return (
    <View style={{padding: normal}}>
      <Text style={styles.infoTitle}>{translate('investor.detail.introductionTitle')}</Text>
      <InfoView
        title={translate('investor.detail.introductionAddress')}
        description={introduction?.address}
      />
      <InfoView
        title={translate('investor.detail.introductionWeb')}
        description={<LinkTextButton title={introduction?.website} onPress={goToWebsite} />}
      />
      <InfoView
        title={translate('investor.detail.introductionPhone')}
        description={introduction?.phone}
      />
      <InfoView
        title={translate('investor.detail.introductionArea')}
        description={introduction?.areas}
      />
      <InfoView
        title={translate('investor.detail.dateOfEstablishment')}
        description={introduction?.dateOfEstablishment}
      />
      <InfoView
        title={translate('investor.detail.charterCapital')}
        description={introduction?.charterCapital}
      />
      <Text style={{marginTop: normal}}>{introduction?.introduce}</Text>
    </View>
  );
};

const Activity = ({activityImages}) => {
  return (
    <View style={styles.activityContainer}>
      <Text style={styles.activityTitle}>{translate('investor.detail.activity')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {!isEmpty(activityImages) &&
          activityImages?.map((item, index) => (
            <ImageProgress
              url={item?.url}
              key={`${item?.url}_${index}`}
              imageStyle={styles.imageStyle}
              imageContainerStyle={styles.imageContainer}
              containerStyle={styles.viewImageContainer}
            />
          ))}
      </ScrollView>
    </View>
  );
};

const OtherInvestor = ({navigation, otherInvestorData}) => {
  const onPressViewMore = () => {
    navigation.push(ScreenIds.InvestorInformationList);
  };

  const ItemInvestor = ({itemData}) => {
    const item = mapToUiModel(itemData);
    const onPressItem = () => {
      navigation.push(ScreenIds.InvestorDetail, {investorCode: item.code});
    };

    const logoSource = checkValidImageUrl(item?.logo) ? {uri: item?.logo} : null;

    return (
      <TouchableOpacity onPress={onPressItem} style={styles.otherContainer}>
        <FastImage style={styles.otherImage} resizeMode={'contain'} source={logoSource} />
        <Text numberOfLines={3} style={styles.otherInvestorName}>
          {item.investorName}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.otherInvestorsContainer}>
      <View style={styles.otherInvestorsSection}>
        <Text style={styles.otherTitle}>{translate('investor.detail.otherInvestor')}</Text>
        <TouchableOpacity onPress={onPressViewMore}>
          <Text style={[styles.textViewMoreInvestor]}>{translate('common.viewMore')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {otherInvestorData &&
          otherInvestorData?.map(item => <ItemInvestor key={item.investorId} itemData={item} />)}
      </ScrollView>
    </View>
  );
};

export const InvestorDetailContainer = ({
  otherInvestorData,
  projectOfInvestor,
  investorDetail,
  navigation,
  formatPrice,
  pressMoreProjectInvestor,
}) => {
  const {activityImages = [], introduction = {}} = investorDetail;

  return (
    <View style={{backgroundColor: COLORS.NEUTRAL_WHITE}}>
      <Image source={IMAGES.IMG_BANNER_INVESTOR} resizeMode={'cover'} style={styles.banner} />
      <Avatar url={introduction?.logo} containerStyle={styles.avatar} />
      <View style={[METRICS.verticalPadding, styles.content]}>
        <Text style={[METRICS.horizontalPadding, styles.projectName]}>{introduction?.name}</Text>
        {/* TODO Investor follow */}
        {/* <View style={styles.viewFollow}>
          <CustomButton
            onPress={() => {}}
            titleColor={COLORS.NEUTRAL_WHITE}
            style={styles.btnFollower}
            title={'Theo dõi'}
          />
          <TouchableOpacity onPress={() => {}} style={[styles.followIcon]}>
            <Icon size={16} name={'message-processing'} color={COLORS.PRIMARY_A100} />
          </TouchableOpacity>
        </View> */}
        <View style={styles.viewFollowInfo}>
          <View style={styles.infoBlock}>
            <Text style={{color: COLORS.GRAY_A3}}>{translate(STRINGS.COMING_SOON)}</Text>
            <Text style={styles.infoBlockTitle}>
              {getTotalCountStatusFromProjectStatus(
                introduction.projectCountByStatuses,
                PROJECT_STATUS.COMING_SOON,
              )}
            </Text>
          </View>
          <View style={styles.line} />
          <View style={styles.infoBlock}>
            <Text style={{color: COLORS.GRAY_A3}}>{translate(STRINGS.OPENING)}</Text>
            <Text style={styles.infoBlockTitle}>
              {getTotalCountStatusFromProjectStatus(
                introduction.projectCountByStatuses,
                PROJECT_STATUS.OPENING,
              )}
            </Text>
          </View>
          <View style={styles.line} />
          <View style={styles.infoBlock}>
            <Text style={{color: COLORS.GRAY_A3}}>{translate(STRINGS.SOLD)}</Text>
            <Text style={styles.infoBlockTitle}>
              {getTotalCountStatusFromProjectStatus(
                introduction.projectCountByStatuses,
                PROJECT_STATUS.SOLD,
              )}
            </Text>
          </View>
        </View>
      </View>
      <SizeBox height={SIZES.SEPARATOR_8} backgroundColor={COLORS.NEUTRAL_BACKGROUND} />
      <IntroductionView introduction={introduction} />
      <SizeBox height={SIZES.SEPARATOR_8} backgroundColor={COLORS.NEUTRAL_BACKGROUND} />
      <Activity activityImages={activityImages} />
      <SizeBox height={SIZES.SEPARATOR_8} backgroundColor={COLORS.NEUTRAL_BACKGROUND} />
      <Text style={styles.projectTitle}>{translate('investor.detail.projectOfInvestor')}</Text>
      {projectOfInvestor && projectOfInvestor.length > 0 ? (
        <ProjectInvestor
          navigation={navigation}
          formatPrice={formatPrice}
          projectOfInvestor={projectOfInvestor}
          pressMoreProjectInvestor={pressMoreProjectInvestor}
        />
      ) : (
        <View style={styles.projectEmpty}>
          <Image style={{marginBottom: normal}} source={IMAGES.IC_EMPTY_LIST} />
          <Text>{translate('investor.detail.emptyProject')}</Text>
        </View>
      )}
      <SizeBox height={SIZES.SEPARATOR_8} backgroundColor={COLORS.NEUTRAL_BACKGROUND} />
      <OtherInvestor otherInvestorData={otherInvestorData} navigation={navigation} />
    </View>
  );
};

const InvestorDetailScreen = ({navigation, route}) => {
  const {investorCode, investorId} = route.params;
  const {formatPrice} = useFormatPrice();
  const {otherInvestorData, investorDetail, projectOfInvestor} = useGetDetailInvestor(
    investorCode,
    investorId,
  );

  const pressMoreProjectInvestor = () => {
    navigation.navigate(ScreenIds.InvestorProjectList, {
      investorId,
    });
  };

  const getOtherInvestors = () => {
    const otherInvestors = (otherInvestorData?.searchFOInvestors?.investorInfoDtos ?? [])?.filter(
      investor => investor?.investorId !== investorId,
    );

    if (otherInvestors?.length > CONSTANTS.DEFAULT_INVESTOR_PAGE_SIZE) {
      return otherInvestors?.slice(0, CONSTANTS.DEFAULT_INVESTOR_PAGE_SIZE - 1);
    }
    return otherInvestors;
  };

  return (
    <BaseScreen title={translate('investor.detail.title')}>
      {investorDetail ? (
        <SpringScrollView keyboardShouldPersistTaps="always" refreshHeader={ScrollViewHeader}>
          <InvestorDetailContainer
            navigation={navigation}
            pressMoreProjectInvestor={pressMoreProjectInvestor}
            projectOfInvestor={projectOfInvestor}
            investorDetail={investorDetail}
            formatPrice={formatPrice}
            otherInvestorData={getOtherInvestors()}
          />
        </SpringScrollView>
      ) : null}
    </BaseScreen>
  );
};

const InfoView = ({title, description}) => {
  return (
    <View style={styles.itemInfoContainer}>
      <Text style={{color: COLORS.GRAY_A3}}>{title}: </Text>
      <Text>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  viewFollowInfo: {
    height: 60,
    backgroundColor: COLORS.NEUTRAL_BACKGROUND,
    flexDirection: 'row',
    marginTop: normal,
    borderRadius: small,
  },
  line: {width: 1, backgroundColor: COLORS.GREY_F0, marginVertical: small},
  infoBlock: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  imageStyle: {
    width: 276,
    height: 155,
    borderRadius: normal,
    marginEnd: normal,
  },
  imageContainer: {
    width: 276,
    height: 155,
    ...HELPERS.absolute,
  },

  viewImageContainer: {
    borderRadius: normal,
    marginEnd: normal,
    width: 276,
    height: 155,
  },
  activityTitle: {...FONTS.bold, fontSize: 20, marginBottom: normal},
  itemInfoContainer: {
    flexDirection: 'row',
    marginTop: small,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoTitle: {...FONTS.bold, fontSize: 20},
  otherContainer: {
    width: 132,
    height: 132,
    borderWidth: SIZES.BORDER_WIDTH_1,
    alignItems: 'center',
    padding: 12,
    borderColor: COLORS.GRAY_A3,
    borderRadius: normal,
    marginEnd: normal,
  },
  otherImage: {width: 50, height: 50},
  otherTitle: {...FONTS.bold, fontSize: 20, marginBottom: normal},
  projectTitle: {...FONTS.bold, fontSize: 20, marginLeft: normal, marginTop: normal},
  projectEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normal,
    height: 200,
  },
  projectName: {
    textAlign: 'left',
    ...FONTS.bold,
    fontSize: 20,
    marginTop: normal,
  },
  textViewMoreProject: {
    textAlign: 'center',
    ...FONTS.bold,
    color: COLORS.PRIMARY_A100,
    fontSize: 14,
  },
  textViewMoreInvestor: {
    ...FONTS.bold,
    color: COLORS.PRIMARY_A100,
    fontSize: 14,
    marginEnd: tiny,
  },

  otherInvestorsSection: {
    ...HELPERS.rowSpaceBetween,
  },
  otherInvestorsContainer: {paddingHorizontal: normal, marginTop: normal},
  otherInvestorName: {marginTop: small, ...FONTS.bold, textAlign: 'center'},
  // btnFollower: {
  //   backgroundColor: COLORS.PRIMARY_A100,
  //   flex: 1,
  //   height: 32,
  //   borderRadius: 8,
  // },
  // followIcon: {
  //   width: 32,
  //   height: 32,
  //   borderRadius: 32 / 2,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginLeft: 10,
  //   backgroundColor: COLORS.PRIMARY_A20,
  // },
  // viewFollow: {flexDirection: 'row', zIndex: 1, alignItems: 'center', marginTop: small},
  infoBlockTitle: {
    ...FONTS.bold,
    ...FONTS.fontSize24,
  },
  activityContainer: {
    paddingLeft: normal,
    marginVertical: normal,
  },
  avatar: {
    position: 'absolute',
    top: 200,
    left: 10,
    zIndex: 1,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: COLORS.GREY_C4,
  },
  banner: {
    height: 282,
    width: '100%',
  },
  content: {
    marginTop: 20,
  },
});

export default InvestorDetailScreen;
