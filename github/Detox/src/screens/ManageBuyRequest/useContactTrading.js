import React, {createContext, useState} from 'react';

import {PropertyPostDto} from '../../api/graphql/generated/graphql';
import {
  mapPropertyToObject,
  mapResponseContactTradingInfoB2CUI,
  mapResponseRequestInfoToUI,
} from './Selector';

export const initialState = {
  isRental: false,
  contactTradingInfo: {},
  agentInfo: {},
  summarySentDetailCount: {},
  masterData: {},
  isSending: false,
  isEdit: false,
  isAtleastGoldUser: false,
  rawDataC2C: null,
  rawDataB2C: null,
};

const ContactTradingContext = createContext(initialState);
const ContactTradingProvider = ({children}) => {
  const [state, setState] = useState(initialState);
  const isEdit = state.isEdit;
  const resetState = () => {
    setState({...initialState, isAtleastGoldUser: state?.isAtleastGoldUser});
  };

  const setFieldToState = newField => {
    setState({...state, ...newField});
  };

  function updateContactTradingInfo(rawData) {
    const contactTradingInfo = mapResponseRequestInfoToUI(
      rawData,
      state?.masterData,
      state?.isSending,
      state?.contactTradingInfo?.propertyPostInfo,
    );
    setState({
      ...state,
      contactTradingInfo: {...state.contactTradingInfo, ...contactTradingInfo},
      isEdit: false,
    });
  }

  /**
   * set PropertyPostInfo for YCLHM đã gửi (có 2 mode: đã gửi và đã nhận)
   * format data object: contactTradingInfo: {..., propertyPostInfo: {}}
   *
   * @param {*} rawData
   * @param {*} propertyPostDto: PropertyPostDto
   * @param {*} isSending
   */
  function setContactTradingInfoC2C(rawData, propertyPostDto: PropertyPostDto, isSending) {
    const contactTradingInfo = mapResponseRequestInfoToUI(
      rawData,
      state?.masterData,
      isSending,
      propertyPostDto,
    );

    setState({
      ...state,
      isSending: isSending,
      rawDataC2C: rawData,
      contactTradingInfo: {
        propertyPostInfo: propertyPostDto,
        ...contactTradingInfo,
      },
      isEdit: false,
    });
  }

  function setContactTradingInfoB2C(infoB2C) {
    const {contactTradingInfo, propertyPostInfo, staffInfo} = mapResponseContactTradingInfoB2CUI(
      infoB2C,
      state?.masterData,
    );
    setState({
      ...state,
      rawDataB2C: infoB2C,
      contactTradingInfo: {
        ...contactTradingInfo,
        propertyPostInfo,
        ...staffInfo,
      },
    });
  }

  const setEditData = () => {
    setState({...state, isEdit: true});
  };

  const setSummarySentDetailCount = data => {
    const newState = {
      ...state,
      summarySentDetailCount: {...state.summarySentDetailCount, ...data},
    };

    setState(newState);
  };

  /**
   * set PropertyPostInfo for YCLHM đã gửi (có 2 mode: đã gửi và đã nhận)
   * format data object: contactTradingInfo: {..., propertyPostInfo: {}}
   * @param {*} data
   */
  const setPropertyPostInfo = data => {
    const propertyPostInfo = mapPropertyToObject(data);
    setState({...state, contactTradingInfo: {...state.contactTradingInfo, propertyPostInfo}});
  };

  const setAgentInfo = agentInfo => {
    if (agentInfo) {
      const isAtleastGoldUser = true; //agentInfo?.rankId >= MAP_RANK.rank2.id;
      setState({...state, agentInfo: agentInfo, isAtleastGoldUser});
    }
  };

  const updateCreateContactRequestInfo = info => {
    if (info) {
      setState({
        ...state,
        createContactRequestInfo: {...info},
      });
    }
  };

  const resetCreateContactRequestInfo = () => {
    setState({...state, createContactRequestInfo: {}, createContactPropertyInfo: {}});
  };

  return (
    <ContactTradingContext.Provider
      value={{
        state,
        isEdit,
        setState,
        resetState,
        updateContactTradingInfo,
        setPropertyPostInfo,
        setFieldToState,
        setSummarySentDetailCount,
        setAgentInfo,
        setEditData,
        setContactTradingInfoB2C,
        setContactTradingInfoC2C,
        updateCreateContactRequestInfo,
        resetCreateContactRequestInfo,
      }}>
      {children}
    </ContactTradingContext.Provider>
  );
};

export {ContactTradingContext, ContactTradingProvider};
