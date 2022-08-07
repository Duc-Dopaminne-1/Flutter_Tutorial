import React, { useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Heading, Title3 } from '..';
import { ICBack } from '../../assets/icons';
import { TEXT_COLOR } from '../../constants/colors';
import { ICON_SIZE } from '../../constants/size';
import { styles } from './styles';
import themeContext from '../../constants/theme/themeContext';

const BackHeader = props => {
  const theme = useContext(themeContext);
  const { scene, navigation } = props;
  let options = props?.options;
  if (!options) {
    options = scene?.descriptor?.options;
  }

  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene?.route?.name || '';

  const translate = options.translate !== undefined ? options.translate : true;

  const headerRightIcon =
    options.headerRightIcon !== undefined ? options.headerRightIcon : undefined;

  const headerRightModal =
    options.headerRightModal !== undefined ? options.headerRightModal : undefined;

  const headerLeftIcon = options.headerLeftIcon !== undefined ? options.headerLeftIcon : undefined;

  const rightRouteName = options.rightRouteName !== undefined ? options.rightRouteName : undefined;

  const leftRouteName = options.leftRouteName !== undefined ? options.leftRouteName : undefined;

  const RightComponent = options?.RightComponent || null;

  const { disableShadow } = options;
  const containerStyle = [styles.container, disableShadow ? {} : styles.shadow];

  return (
    <View style={containerStyle}>
      <View style={[styles.wrapper]}>
        <View style={styles.leftContainer}>
          {!options.hideLeftHeader ? (
            <View style={styles.leftButton}>
              <TouchableOpacity
                onPress={
                  options.backAction
                    ? options.backAction
                    : leftRouteName
                    ? () => navigation.navigate(leftRouteName)
                    : navigation.goBack
                }>
                {headerLeftIcon ? (
                  headerLeftIcon
                ) : (
                  <ICBack
                    color1={theme.icon.color1}
                    width={ICON_SIZE.MEDIUM}
                    height={ICON_SIZE.MEDIUM}
                  />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View />
          )}
          <Title3
            translate={translate}
            color={theme?.text?.primary}
            style={[styles.title, { textAlign: theme?.text.textAlign }]}>
            {title}
          </Title3>
        </View>

        {headerRightIcon ? (
          <TouchableOpacity
            onPress={() => {
              rightRouteName ? navigation.navigate(rightRouteName) : null;
            }}>
            {headerRightIcon}
          </TouchableOpacity>
        ) : headerRightModal ? (
          headerRightModal
        ) : (
          <View />
        )}
        {RightComponent ? (
          <View style={styles.right}>
            <RightComponent />
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default BackHeader;
