import React from "react"
import { View } from "react-native"
import { CustomText } from "@src/components/CustomText"
import { IC_ELECTRICITY, IC_WATER, IC_TELECOM, IC_SERVICE, DELETE_ITEM } from "@src/constants/icons"
import { formatCurrency, isManagerApp } from "@src/utils"
import styles from "./styles"
import translate from "@src/localize"
import { IExpense } from "@reup/reup-api-sdk/libs/api/bulletin/expense/model"
import { CustomButton } from "@src/components/CustomButton"
import { CustomTouchable } from "@src/components/CustomTouchable"
import { Image } from "react-native-animatable"
import { ExpenseState } from "@reup/reup-api-sdk/libs/api/enum"
import CustomTextTicker from "@src/components/CustomTextTicker"

interface Props {
  item: IExpense
  onPressEdit?: (item: IExpense) => void,
  onPressDelete?: (item: IExpense) => void,
  onPressApprove?: (item: IExpense) => void,
  onPressCheckout?: (item: IExpense) => void,
}

const MonthlyBillContent = (props: Props) => {

  const { item, onPressApprove, onPressDelete, onPressEdit, onPressCheckout } = props

  const renderElectricity = () => {
    return (
      <View style={styles.containerElectricity}>
        <CustomText
          styleContainer={styles.containerTextElectricity}
          style={styles.textElectricity}
          text={translate('monthly_bill.electric')}
          leftIcon={IC_ELECTRICITY}
          styleLeftIcon={styles.iconElectricity}
          numberOfLines={1}
        />
        <CustomTextTicker
          styleContainer={styles.containerPriceElectricity}
          styleText={styles.priceElectricity}
          text={formatCurrency(item.electric_fee ?? 0)}
          numberOfLines={1}
        />
      </View>
    )
  }

  const renderWater = () => {
    return (
      <View style={styles.containerWater}>
        <CustomText
          styleContainer={styles.containerTextWater}
          style={styles.textWater}
          text={translate('monthly_bill.water')}
          leftIcon={IC_WATER}
          styleLeftIcon={styles.iconWater}
          numberOfLines={1}
        />
        <CustomTextTicker
          styleContainer={styles.containerPriceWater}
          styleText={styles.priceWater}
          text={formatCurrency(item.water_fee ?? 0)}
          numberOfLines={1}
        />
      </View>
    )
  }

  const renderTelecom = () => {
    return (
      <View style={styles.containerTelecom}>
        <CustomText
          styleContainer={styles.containerTextTelecom}
          style={styles.textTelecom}
          text={translate('monthly_bill.telecom')}
          leftIcon={IC_TELECOM}
          styleLeftIcon={styles.iconTelecom}
          numberOfLines={1}
        />
        <CustomTextTicker
          styleContainer={styles.containerPriceTelecom}
          styleText={styles.priceTelecom}
          text={formatCurrency(item.telecom_fee ?? 0)}
          numberOfLines={1}
        />
      </View>
    )
  }

  const renderService = () => {
    return (
      <View style={styles.containerService}>
        <CustomText
          styleContainer={styles.containerTextService}
          style={styles.textService}
          text={translate('monthly_bill.service')}
          leftIcon={IC_SERVICE}
          styleLeftIcon={styles.iconService}
          numberOfLines={1}
        />
        <CustomTextTicker
          styleContainer={styles.containerPriceService}
          styleText={styles.priceService}
          text={formatCurrency(item.service_fee ?? 0)}
          numberOfLines={1}
        />
      </View>
    )
  }

  const renderTotal = () => {
    return (
      <View style={styles.containerTotal}>
        <CustomText
          styleContainer={styles.containerTextTotal}
          style={styles.textTotal}
          text={translate('monthly_bill.total')}
          numberOfLines={1}
        />
        <CustomTextTicker
          styleContainer={styles.containerPriceTotal}
          styleText={styles.priceTotal}
          text={formatCurrency(item.total ?? 0)}
          numberOfLines={1}
        />
      </View>
    )
  }

  const renderApproveBtn = () => {
    return (
      <CustomButton
        text={translate('monthly_bill.approve')}
        textStyle={styles.approve}
        style={styles.containerApprove}
        onPress={() => onPressApprove && onPressApprove(item)}
      />
    )
  }

  const renderEditBtn = () => {
    return (
      <CustomButton
        text={translate('monthly_bill.edit')}
        textStyle={styles.edit}
        style={styles.containerEdit}
        onPress={() => onPressEdit && onPressEdit(item)}
      />
    )
  }

  const renderDeleteBtn = () => {
    return (
      <CustomTouchable style={styles.containerDelete} onPress={() => onPressDelete && onPressDelete(item)}>
        <Image source={DELETE_ITEM} />
      </CustomTouchable>
    )
  }

  const renderGroupBtn = () => {
    return (
      <View style={styles.containerGroupBtn}>
        <View style={styles.containerApproveEdit}>
          {renderApproveBtn()}
          {renderEditBtn()}
        </View>
        <View style={styles.containerDeleteBtn}>
          {renderDeleteBtn()}
        </View>
      </View>
    )
  }

  const renderCheckOutBtn = () => {
    return (
      <CustomButton
        text={translate('monthly_bill.checkout')}
        textStyle={styles.checkout}
        style={styles.containerCheckout}
        onPress={() => onPressCheckout && onPressCheckout(item)}
      />
    )
  }

  return (
    <View style={styles.container}>
      {renderElectricity()}
      {renderWater()}
      {renderTelecom()}
      {renderService()}
      {renderTotal()}
      {isManagerApp() && item && item.state == ExpenseState.Draft ? renderGroupBtn() : null}
      {item && item.state == ExpenseState.Pending ? renderCheckOutBtn() : null}
    </View>
  )
}

export default MonthlyBillContent
