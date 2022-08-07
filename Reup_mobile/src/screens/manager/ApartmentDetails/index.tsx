import React, { useState } from 'react';
import styles from './styles';
import { View, ScrollView, Image } from 'react-native';
import IC_APARTMENT from '@src/res/icons/icon_apartment.png';
import { CustomButton } from '@src/components/CustomButton';
import { CustomFlatList } from '@src/components/FlatList';
import Container from '@src/components/Container';
import translate from '@src/localize';
import CustomSectionHeader from '@src/components/CustomSection';
import { upperCase } from 'lodash';
import { useRoute } from '@react-navigation/native';
import RectangleAvatar from '@src/components/RectangleAvatar';
import { CustomText } from '@src/components/CustomText';
import { FAMILY_MEMBER, ADD_PLUS, VEHICLES, PET } from '@src/constants/icons';
import FamilyMemberItem from '@src/components/FlatListItem/FamilyMemberItem';
import RoleType from '../Tenant/enum';
import LINE from '@res/icons/ForLeaseForSale/image-line-dot.png';
import NavigationActionsService from '@src/navigation/navigation';
import { MEMBER_DETAILS, TRANSFER_APARTMENT } from '@src/constants/screenKeys';
import { NEW_MEMBER } from '@src/constants/screenKeys';
import { action as UnitAction } from '@src/modules/Units';
import { useDispatch, useSelector } from 'react-redux';
import { IUnitPet } from '@reup/reup-api-sdk/libs/api/unit/pet/models';
import { RootState } from '@src/types/types';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IUnitVehicle } from '@reup/reup-api-sdk/libs/api/unit/vehicle/models';
import { VehicleItem, PetItem } from '@src/components/FlatListItem/TenantThingsItem';
import { IUnitMember } from '@reup/reup-api-sdk/libs/api/unit/member/models';
import { ICompanyUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model';
import InviteUser from '../InviteUser';
import { LimitLoadMore, HEIGHT, WIDTH } from '@src/constants/vars';
import { getApartmentName } from '@src/utils';
import { name } from 'faker';

interface Props {
  route?: any
  item: ICompanyUnit
  flatList: any
}

const ApartmentDetails = (props: Props) => {
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>([])
  const [isInvite, setIsInvite] = useState<boolean>(false);
  const route = useRoute();
  const { item, flatList } = route.params as Props;
  const dispatch = useDispatch();
  const petList = useSelector<RootState, IPagination<IUnitPet>>((state: RootState) => state.unit.listPet);
  const vehicleList = useSelector<RootState, IPagination<IUnitVehicle>>((state: RootState) => state.unit.listVehicle);
  const memberList = useSelector<RootState, IPagination<IUnitMember>>((state: RootState) => state.unit.listMember);

  const renderHeader = () => {
    return <CustomSectionHeader
      style={styles.sectionHeader}
      title={upperCase(translate("apartments.apartment_details"))}
      icon={IC_APARTMENT}
    />
  }

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
  };

  const onLoadVehicles = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    if (item && item.id) {
      dispatch(UnitAction.getVehicles({
        unitId: item.id,
        page: page,
        limit: LimitLoadMore,
        onSuccess: (data) => {
          onLoadSuccess()
        },
        onFail: (error) => {
          onLoadFailure()
        }
      }))
    }
  };

  const onLoadMembers = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    if (item && item.id) {
      dispatch(UnitAction.getMembers({
        unitId: item.id,
        page: page,
        limit: LimitLoadMore,
        onSuccess: (data) => {
          onLoadSuccess()
        },
        onFail: (error) => {
          onLoadFailure()
        }
      }))
    }
  };

  const onLoadPets = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    if (item && item.id) {
      dispatch(UnitAction.getPets({
        unitId: item.id,
        page: page,
        limit: LimitLoadMore,
        onSuccess: (data) => {
          onLoadSuccess()
        },
        onFail: (error) => {
          onLoadFailure()
        }
      }))
    }
  };

  const _renderImage = (urlImage: string) => {
    return (
      <RectangleAvatar
        width={item.image_urls && item.image_urls.length === 1 ? (WIDTH - 30) : (WIDTH - 50)}
        height={HEIGHT * 0.25}
        avatar={urlImage}
        styleContainer={styles.images} />
    )
  }

  const renderImages = () => {
    const data = item.image_urls ?? []
    return (
      <CustomFlatList
        onLoad={onLoad}
        contentContainerStyle={styles.flatListImages}
        data={data}
        horizontal={true}
        renderItem={_renderImage}
      />
    )
  }

  const renderTitle = () => {
    return <CustomText
      numberOfLines={1}
      style={styles.title}
      text={getApartmentName(item.block, item.floor, item.code)}
      styleContainer={styles.apartmentCode} />
  }

  const renderBuilding = () => {
    const property = item && item.property
    const nameProperty = property && property.name
    if (!nameProperty) {
      return
    }
    return (
      <View style={styles.textContainers}>
        <View style={styles.rowItem}>
          <CustomText
            numberOfLines={1}
            style={styles.subTitle}
            text={`${translate('apartments.building')}:`}
            styleContainer={styles.key} />
          <CustomText
            numberOfLines={1}
            style={styles.textRight}
            text={nameProperty}
            styleContainer={styles.value} />
        </View>
        <View style={styles.line} />
      </View>
    )
  }

  const renderSquare = () => {
    return (
      <View style={styles.textContainers}>
        <View style={styles.rowItem}>
          <CustomText
            numberOfLines={1}
            style={styles.subTitle}
            text={`${translate('apartments.square_m2')}:`}
            styleContainer={styles.key} />
          <CustomText
            numberOfLines={1}
            style={styles.textRight}
            text={item.square ? `${item.square}m2` : ''}
            styleContainer={styles.value} />
        </View>
        <View style={styles.line} />
      </View>
    )
  }

  const renderBath = () => {
    return (
      <View style={styles.textContainers}>
        <View style={styles.rowItem}>
          <CustomText
            numberOfLines={1}
            style={styles.subTitle}
            text={`${translate('apartments.bathroom')}:`}
            styleContainer={styles.key} />
          <CustomText
            numberOfLines={1}
            style={styles.textRight}
            text={`${item.restroom ?? ''}`}
            styleContainer={styles.value} />
        </View>
        <View style={styles.line} />
      </View>
    )
  }

  const renderBed = () => {
    return (
      <View style={styles.textContainers}>
        <View style={styles.rowItem}>
          <CustomText numberOfLines={1}
            style={styles.subTitle}
            text={`${translate('apartments.bedroom')}:`}
            styleContainer={styles.key} />
          <CustomText
            numberOfLines={1}
            style={styles.textRight}
            text={`${item.bedroom ?? ''}`}
            styleContainer={styles.value} />
        </View>
        <View style={styles.line} />
      </View>
    )
  }

  const renderDescription = () => {
    return (
      <View style={styles.textContainers}>
        <CustomText
          numberOfLines={1}
          style={[styles.subTitle, styles.subTitleDes]}
          text={`${translate('apartments.description')}:`}
          styleContainer={styles.key} />
        <CustomText
          styleContainer={{ alignItems: 'flex-start' }}
          style={[styles.subTitle, styles.description]}
          text={item.descriptions ?? ''} />
      </View>
    )
  }

  const onAddItem = () => {
    const unitId = item.id;
    NavigationActionsService.push(NEW_MEMBER, { unitId });
  };

  const getSelectedIds = (selectedIds: string[], item: any) => {
    const existItem = selectedIds.findIndex(id => id === item.id);
    if (existItem >= 0) {
      const selectedItems = [...selectedIds];
      selectedItems.splice(existItem, 1);
      return selectedItems;
    } else {
      const temps = [...selectedIds, item.id];
      return temps;
    }
  }

  const _itemSeparator = () => {
    return <View style={styles.separator}><Image source={LINE} /></View>;
  };

  const selectMember = (memberItem: IUnitMember) => {
    setSelectedMemberIds(getSelectedIds(selectedMemberIds, memberItem));
    NavigationActionsService.push(MEMBER_DETAILS, { unitId: item.id, memberItem })
  };

  const _renderFamilyItem = (item: IUnitMember) => {
    return <FamilyMemberItem role={RoleType.management} item={item} onPressItem={selectMember} />;
  };

  const renderFamilyList = () => {
    const data = memberList.results ?? []
    const enableLoadMore = memberList.next && memberList.next.length != 0
    return (
      <View style={[styles.sectionHeaderView, styles.memberSectionContent]}>
        <CustomSectionHeader
          title={translate('tenant_detail.members')}
          icon={FAMILY_MEMBER}
          style={styles.sectionHeader}
          rightComponent={
            <CustomButton
              onPress={onAddItem}
              iconLeft={ADD_PLUS}
              text={translate('tenant_detail.create')}
              style={styles.buttonCreateMember} />
          }
        />
        <CustomFlatList
          onLoad={onLoadMembers}
          ItemSeparatorComponent={_itemSeparator}
          data={data}
          hasNext={enableLoadMore}
          loadMore
          renderItem={_renderFamilyItem}
          emptyContainerStyle={styles.emptyContainerView}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </View>
    );
  };

  const selectVehicle = (item: IUnitVehicle) => {
    setSelectedVehicleIds(getSelectedIds(selectedVehicleIds, item));
  };

  const _renderVehicleItem = (item: IUnitVehicle) => {
    return <VehicleItem role={RoleType.management} item={item} selectedIds={selectedVehicleIds} onPress={selectVehicle} />;
  };

  const renderVehicleList = () => {
    const enableLoadMore = vehicleList.next && vehicleList.next.length != 0
    const data = vehicleList.results ?? []

    return (
      <View style={styles.sectionHeaderView}>
        <CustomSectionHeader
          title={translate('tenant_detail.vehicles')}
          icon={VEHICLES}
          style={styles.sectionHeader}
        />
        <CustomFlatList
          onLoad={onLoadVehicles}
          data={data}
          renderItem={_renderVehicleItem}
          horizontal={true}
          hasNext={enableLoadMore}
          emptyContainerStyle={styles.emptyContainerView}
          loadMore={enableLoadMore} />
      </View>
    );
  };

  const selectPet = (item: IUnitPet) => {
    setSelectedPetIds(getSelectedIds(selectedPetIds, item));
  };

  const _renderPetItem = (item: IUnitPet) => {
    return <PetItem role={RoleType.management} item={item} selectedIds={selectedPetIds} onPress={selectPet} />;
  };

  const renderPetList = () => {
    const enableLoadMore = petList.next && petList.next.length != 0
    const data = petList.results ?? []

    return (
      <View style={styles.sectionHeaderView}>
        <CustomSectionHeader
          title={translate('tenant_detail.pets')}
          icon={PET}
          style={styles.sectionHeader}
        />
        <CustomFlatList
          onLoad={onLoadPets}
          data={data}
          renderItem={_renderPetItem}
          horizontal={true}
          hasNext={enableLoadMore}
          loadMore={enableLoadMore}
          emptyContainerStyle={styles.emptyContainerView}
        />
      </View>
    );
  };

  const renderContents = () => {
    return (
      <ScrollView>
        <View style={styles.scrollViewContainer}>
          {renderImages()}
          {renderTitle()}
          {renderBuilding()}
          {renderSquare()}
          {renderBed()}
          {renderBath()}
          {renderDescription()}
        </View>
        {renderFamilyList()}
        {renderVehicleList()}
        {renderPetList()}
      </ScrollView>
    )
  }

  const onPressTransfer = (item: any) => {
    NavigationActionsService.push(TRANSFER_APARTMENT, { item, flatList })
  }

  const onPressInvite = (item: any) => {
    setIsInvite(true);
  }

  const renderBottomButton = (item: any) => (
    <View style={styles.bottomButtonView}>
      <CustomButton text={upperCase(translate('apartments.transfer'))} style={[styles.widthButton, styles.transferButton]} onPress={onPressTransfer.bind(undefined, item)} />
      <CustomButton text={upperCase(translate('apartments.invite'))} style={[styles.widthButton, styles.deleteButton]} onPress={onPressInvite.bind(undefined, item)} />
    </View>
  );

  const onBackdropPressInvite = () => {
    flatList && flatList.current && flatList.current.reloadData()
    setIsInvite(false);
  }

  return (
    <Container
      title={translate('apartments.apartments')}
      isShowHeader={true}
      isDisplayNotification={false}
      isDisplayMenuButton={false}
      spaceBottom={true}>
      <View style={styles.container}>
        {renderHeader()}
        {renderContents()}
        {renderBottomButton(item)}
      </View>
      <InviteUser item={item} visible={isInvite} onBackdropPress={onBackdropPressInvite} />
    </Container>
  );
};

export default ApartmentDetails;
