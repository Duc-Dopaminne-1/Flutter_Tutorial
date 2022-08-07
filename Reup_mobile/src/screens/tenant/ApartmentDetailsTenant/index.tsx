import React, { useState, useRef } from 'react';
import styles from './styles';
import { View, ScrollView, Image, Alert } from 'react-native';
import IC_APARTMENT from '@src/res/icons/icon_apartment.png';
import { CustomButton, ImageButton } from '@src/components/CustomButton';
import { CustomFlatList } from '@src/components/FlatList';
import Container from '@src/components/Container';
import translate from '@src/localize';
import CustomSectionHeader from '@src/components/CustomSection';
import { upperCase } from 'lodash';
import { useRoute } from '@react-navigation/native';
import RectangleAvatar from '@src/components/RectangleAvatar';
import { CustomText } from '@src/components/CustomText';
import { FAMILY_MEMBER, ADD_PLUS, VEHICLES, PET, ICON_DELETE } from '@src/constants/icons';
import FamilyMemberItem from '@src/components/FlatListItem/FamilyMemberItem';
import LINE from '@res/icons/ForLeaseForSale/image-line-dot.png';
import NavigationActionsService from '@src/navigation/navigation';
import { MEMBER_DETAILS_TENANT, NEW_MEMBER_TENANT, NEW_PET_TENANT, NEW_VEHICLE_TENANT } from '@src/constants/screenKeys';
import { action as UnitAction } from '@src/modules/Units';
import { useDispatch, useSelector } from 'react-redux';
import { IUnitPet } from '@reup/reup-api-sdk/libs/api/unit/pet/models';
import { RootState } from '@src/types/types';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IUnitVehicle } from '@reup/reup-api-sdk/libs/api/unit/vehicle/models';
import { VehicleItem, PetItem } from '@src/components/FlatListItem/TenantThingsItem';
import { IUnitMember } from '@reup/reup-api-sdk/libs/api/unit/member/models';
import { ICompanyUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model';
import InviteUser from '../InviteUserTenant';
import { LimitLoadMore, HEIGHT, WIDTH } from '@src/constants/vars';
import RoleType from '@src/screens/manager/Tenant/enum';
import { getApartmentName } from '@src/utils';

interface Props {
  route?: any
  item: ICompanyUnit
  flatList: any
}

const ApartmentDetailsTenant = (props: Props) => {
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>([])
  const [isInvite, setIsInvite] = useState<boolean>(false);
  const route = useRoute();
  const { item, flatList } = route.params as Props;
  const petFlatList = useRef<any>(null);
  const vehicleFlatList = useRef<any>(null);
  const dispatch = useDispatch();
  const petList = useSelector<RootState, IPagination<IUnitPet>>((state: RootState) => state.unit.listPet);
  const vehicleList = useSelector<RootState, IPagination<IUnitVehicle>>((state: RootState) => state.unit.listVehicle);
  const memberList = useSelector<RootState, IPagination<IUnitMember>>((state: RootState) => state.unit.listMember);


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

  const onRemovePet = (petId: string) => {
    if (item && item.id) {
      dispatch(UnitAction.removePet({
        unitId: item.id,
        petId: petId,
        onSuccess: () => {
          petFlatList && petFlatList.current && petFlatList.current.reloadData()
          setSelectedPetIds(selectedPetIds.filter(item => { item != petId }));
        },
        onFail: (error) => {
        }
      }))
    }
  };

  const onRemoveVehicle = (vehicleId: string) => {
    if (item && item.id) {
      dispatch(UnitAction.removeVehicle({
        unitId: item.id,
        vehicleId: vehicleId,
        onSuccess: () => {
          vehicleFlatList && vehicleFlatList.current && vehicleFlatList.current.reloadData()
          setSelectedVehicleIds(selectedVehicleIds.filter(item => { item != vehicleId }));
        },
        onFail: () => {
        }
      }))
    }
  };


  const onDeleteVehicleItem = () => {
    Alert.alert(translate('alert.title_confirm'), translate('alert.message_delete'), [
      {
        text: translate('alert.delete'),
        style: 'default',
        onPress: () => {
          selectedVehicleIds.forEach(item => {
            onRemoveVehicle(item);
          })
        },
      },
      {
        text: translate('alert.cancel'),
        style: 'cancel',
        onPress: () => undefined,
      },
    ]);
  }

  const onDeletePetItem = () => {
    Alert.alert(translate('alert.title_confirm'), translate('alert.message_delete'), [
      {
        text: translate('alert.delete'),
        style: 'default',
        onPress: () => {
          selectedPetIds.forEach(item => {
            onRemovePet(item)
          })
        },
      },
      {
        text: translate('alert.cancel'),
        style: 'cancel',
        onPress: () => undefined,
      },
    ]);
  }


  const renderHeader = () => {
    return <CustomSectionHeader
      style={styles.sectionHeader}
      title={upperCase(translate("apartments.apartment_details"))}
      icon={IC_APARTMENT}
    />
  }

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
    NavigationActionsService.push(NEW_MEMBER_TENANT, { unitId });
  };

  const onAddVehicle = () => {
    NavigationActionsService.push(NEW_VEHICLE_TENANT, { unitId: item.id, vehicleFlatList });
  };


  const onAddPet = () => {
    NavigationActionsService.push(NEW_PET_TENANT, { unitId: item.id, petFlatList });
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
    NavigationActionsService.push(MEMBER_DETAILS_TENANT, { unitId: item.id, memberItem })
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
            <View style={styles.buttonCreateVehicle}>
              <ImageButton
                onPress={onAddItem}
                icon={ADD_PLUS}
                styleContainer={styles.buttonCreateVehicle}
                styleIcon={styles.iconAddImageBtn} />
            </View>
          }
        />
        <CustomFlatList
          onLoad={onLoadMembers}
          ItemSeparatorComponent={_itemSeparator}
          data={data}
          hasNext={enableLoadMore}
          loadMore
          emptyContainerStyle={styles.emptyContainerView}
          renderItem={_renderFamilyItem} />
      </View>
    );
  };

  const selectVehicle = (item: IUnitVehicle) => {
    setSelectedVehicleIds(getSelectedIds(selectedVehicleIds, item));
  };

  const _renderVehicleItem = (item: IUnitVehicle) => {
    return <VehicleItem role={RoleType.tenant} item={item} selectedIds={selectedVehicleIds} onPress={selectVehicle} />;
  };

  const renderVehicleRightButtons = () => {
    return (<View style={{ flexDirection: 'row' }}>
      {selectedVehicleIds.length > 0 ?
        <View style={styles.containerImageBtn}>
          <ImageButton
            onPress={onDeleteVehicleItem}
            icon={ICON_DELETE}
            styleContainer={styles.containerImageBtn}
            styleIcon={styles.iconDeleteImageBtn}
          /></View> : undefined}
      <View style={styles.buttonCreateVehicle}>
        <ImageButton
          onPress={onAddVehicle}
          icon={ADD_PLUS}
          styleContainer={styles.buttonCreateVehicle}
          styleIcon={styles.iconAddImageBtn} />
      </View>
    </View >)
  }

  const renderPetRightButtons = () => {
    return (<View style={{ flexDirection: 'row' }}>
      {selectedPetIds.length > 0 ?
        <View style={styles.containerImageBtn}>
          <ImageButton
            onPress={onDeletePetItem}
            icon={ICON_DELETE}
            styleContainer={styles.containerImageBtn}
            styleIcon={styles.iconDeleteImageBtn}
          /></View> : undefined}
      <View style={styles.buttonCreateVehicle}>
        <ImageButton
          onPress={onAddPet}
          icon={ADD_PLUS}
          styleContainer={styles.buttonCreateVehicle}
          styleIcon={styles.iconAddImageBtn} />
      </View>
    </View >)
  }

  const renderVehicleList = () => {
    const enableLoadMore = vehicleList.next && vehicleList.next.length != 0
    const data = vehicleList.results ?? []
    return (
      <View style={styles.sectionHeaderView}>
        <CustomSectionHeader
          title={translate('tenant_detail.vehicles')}
          icon={VEHICLES}
          style={styles.sectionHeader}
          rightComponent={renderVehicleRightButtons()}
        />
        <CustomFlatList
          style={styles.sectionHeader}
          onLoad={onLoadVehicles}
          ref={vehicleFlatList}
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
    return <PetItem role={RoleType.tenant} item={item} selectedIds={selectedPetIds} onPress={selectPet} />;
  };

  const renderPetList = () => {
    const enableLoadMore = petList.next && petList.next.length != 0

    return (
      <View style={styles.sectionHeaderView}>
        <CustomSectionHeader
          title={translate('tenant_detail.pets')}
          icon={PET}
          style={styles.sectionHeader}
          rightComponent={renderPetRightButtons()}
        />
        <CustomFlatList
          onLoad={onLoadPets}
          style={styles.sectionHeader}
          data={petList.results}
          ref={petFlatList}
          renderItem={_renderPetItem}
          horizontal={true}
          hasNext={enableLoadMore}
          emptyContainerStyle={styles.emptyContainerView}
          loadMore={enableLoadMore}
        />
      </View>
    );
  };

  const renderContents = () => {
    return (
      <ScrollView >
        <View style={styles.scrollViewContainer}>
          {renderImages()}
          {renderTitle()}
          {renderSquare()}
          {renderBed()}
          {renderBath()}
          {renderDescription()}
        </View>
        {renderFamilyList()}
        {renderVehicleList()}
        {renderPetList()}
      </ScrollView >
    )
  }

  const onPressInvite = (item: any) => {
    setIsInvite(true);
  }

  const renderBottomButton = (item: any) => (
    <View style={styles.bottomButtonView}>
      <CustomButton text={upperCase(translate('apartments.invite'))} style={[styles.deleteButton]} onPress={onPressInvite.bind(undefined, item)} />
    </View>
  );

  const onBackdropPressInvite = () => {
    setIsInvite(false);
    flatList && flatList.current && flatList.current.reloadData()
  }

  return (
    <Container
      title={translate('apartments.apartment_details')}
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

export default React.memo(ApartmentDetailsTenant);
