import { language } from '@/i18n';
import NavigationActionsService from '@/navigation/navigation';
import { appLocaleSelector } from '@/redux/app/selector';
import { pauseAccount, unPauseAccount } from '@/redux/user/actions';
import { userSelector } from '@/redux/user/selector';
import ErrorDialog from '@/screens/DeletetAccount/ErrorDialog';
import PauseAccountConfirmDialog from '@/screens/DeletetAccount/PauseAccountConfirmDialog';
import { activeToggleUserPaused, isUserPaused } from '@/shared/processing';
import React, { memo, ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ShowMeOnBidBid } from './ShowMeOnBidBid';
import IconGrayShowMeSVG from '@/components/SVG/IconGrayShowMeSVG';

const ShowMeOnBidbidContainer = (): ReactElement => {
  appLocaleSelector();
  const dispatch = useDispatch();
  const user = userSelector();
  const { pauses } = user.data;
  const [pauseAccDialogConfirmVisible, setPauseAccDialogConfirmVisible] = useState(false);
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const pauseAccountConfirmOnPressed = () => {
    NavigationActionsService.showLoading();
    if (!isUserPaused(pauses)) {
      dispatch(
        pauseAccount({
          onSuccess: () => {
            NavigationActionsService.hideLoading();
          },
          onFail: error => {
            NavigationActionsService.hideLoading();
            setTimeout(() => {
              // alertError(error, 'ERROR', () => {});
              setErrorMessage(error);
              setErrorDialogVisible(true);
            }, 400);
          },
        }),
      );
    } else {
      dispatch(
        unPauseAccount({
          onSuccess: () => {
            NavigationActionsService.hideLoading();
          },
          onFail: error => {
            NavigationActionsService.hideLoading();
            setTimeout(() => {
              // alertError(error, 'ERROR', () => {});
              setErrorMessage(error);
              setErrorDialogVisible(true);
            }, 400);
          },
        }),
      );
    }
  };

  return (
    <>
      <ShowMeOnBidBid
        title={language('settingsScreen.showMeOnBidBid')}
        content={''}
        image={<IconGrayShowMeSVG />}
        isEnabled={isUserPaused(pauses) ? false : true}
        disabled={!activeToggleUserPaused(pauses)}
        toggleSwitchCallBack={(flag: boolean) => {
          if (!flag) {
            pauseAccountConfirmOnPressed();
          } else {
            setPauseAccDialogConfirmVisible(true);
          }
        }}
      />

      {pauseAccDialogConfirmVisible && (
        <PauseAccountConfirmDialog
          isVisible={pauseAccDialogConfirmVisible}
          onBackdropPress={() => setPauseAccDialogConfirmVisible(false)}
          confirmOnPressedCallback={pauseAccountConfirmOnPressed}
        />
      )}

      {errorDialogVisible && (
        <ErrorDialog
          isVisible={errorDialogVisible}
          onBackdropPress={() => setErrorDialogVisible(false)}
          errorMessage={errorMessage}
          confirmOnPressed={() => {
            setErrorDialogVisible(false);
          }}
        />
      )}
    </>
  );
};

export default memo(ShowMeOnBidbidContainer);
