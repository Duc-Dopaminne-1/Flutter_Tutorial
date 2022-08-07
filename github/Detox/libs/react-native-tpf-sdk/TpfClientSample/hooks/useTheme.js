import React, { useState, useCallback } from 'react';

export const THEME_TYPE = {
  DEFAULT: 'default',
  OPTION1: 'theme1',
  OPTION2: 'theme2',
  OPTION3: 'theme3'
};

const asyncFontTypes = font => ({
  BLACK: `${font} Black`,
  BOLD: `${font} Bold`,
  MEDIUM: `${font} Medium`,
  REGULAR: `${font} Regular`,
  ITALIC: `${font} Italic`,
  SEMIBOLD: `${font} SemiBold`
});

export const DEFAULT = {
  app: {
    primaryColor1:
      '#26894F' /*Primary Color 1: nút back, action header menu, text tab focus, check box, radio button
  , 1 số text (giá), hot/new mask (chữ màu trắng, background thay đổi),
  close button, help box icon, khung textinput focus, icon upload load, hồ sơ tài chính (đang chờ hỗ trợ)
  on/off switch,
    */,
    primaryColor2:
      '#E53030' /*Primary Color 2: step number tạo hồ sơ, hyperlink, hồ sơ tài chính (yêu cầu hồ trợ),
background của helpbox (tooltip) (chữ màu trắng), slider bottom(danh sách bảo hiểm), yêu cầu hỗ trợ,
highlight text (phản hồi của TPF support ticket), background của header menu button (danh sách sản phẩm)*/,
    primaryColor3: '#121414'
  },
  button: {
    primary: { textColor: '#FFFFFF', background: '#26894F' },
    secondary: { textColor: '#26894F', background: '#FFFFFF' },
    disablePrimary: { textColor: '#BABABA', background: '#E8E8E8' },
    disableSecondary: { textColor: '#FFCE98', background: '#FFF4E9' }
  },
  icon: {
    color1: '#26894F',
    color2: '#E53030',
    background: '#F3F9F8'
  },
  text: {
    primary: '#313131',
    secondary: '#A3A3A3', //(placeholder, note, description)
    fontFamily: 'Nunito', // set được name
    textAlign: 'left' // left - center - right
  },
  fonts: {
    BLACK: 'Nunito Black',
    BOLD: 'Nunito Bold',
    MEDIUM: 'Nunito Medium',
    REGULAR: 'Nunito Regular',
    ITALIC: 'Nunito Italic',
    SEMIBOLD: 'Nunito SemiBold'
  }
};

export const Option1 = {
  app: {
    primaryColor1: '#EA5C2B',
    primaryColor2: '#FF7F3F',
    primaryColor3: '#121414'
  },
  button: {
    primary: { textColor: '#FFFFFF', background: '#EA5C2B' },
    secondary: { textColor: '#313131', background: '#FF7F3F' }
  },
  icon: {
    color1: '#EA5C2B',
    color2: '#FF7F3F',
    background: '#F3F9F8'
  },
  text: {
    primary: '#461111',
    secondary: '#A3A3A3',
    textAlign: 'center',
    fontFamily: 'Lato'
  },
  fonts: {
    BLACK: 'Lato Black',
    BOLD: 'Lato Bold',
    MEDIUM: 'Lato Medium',
    REGULAR: 'Lato Regular',
    ITALIC: 'Lato Italic',
    SEMIBOLD: 'Lato Semibold'
  }
};

export const Option2 = {
  app: {
    primaryColor1: '#7900FF',
    primaryColor2: '#548CFF',
    primaryColor3: '#121414'
  },
  button: {
    primary: { textColor: '#FFFFFF', background: '#7900FF' },
    secondary: { textColor: '#FFFFFF', background: '#548CFF' },
    disablePrimary: { textColor: '#313131', background: '#F5F4F4' },
    disableSecondary: { textColor: '#313131', background: '#F5F4F4' }
  },
  icon: {
    color1: '#F6D860',
    color2: '#95CD41'
  },
  text: {
    primary: '#064663',
    secondary: '#C8C2BC',
    fontFamily: 'Montserrat'
  },
  fonts: asyncFontTypes('Montserrat')
};

export const Option3 = {
  app: {
    primaryColor1: '#D83A56',
    primaryColor2: '#FF7F3F',
    primaryColor3: '#121414'
  },
  button: {
    primary: { textColor: '#FFFFFF', background: '#D83A56' },
    secondary: { textColor: '#FFFFFF', background: '#FF7F3F' },
    disablePrimary: { textColor: '#313131', background: '#E6E6E6' },
    disableSecondary: { textColor: '#313131', background: '#E6E6E6' }
  },
  icon: {
    color1: '#D83A56',
    color2: '#FF7F3F'
  },

  text: {
    primary: '#370665',
    secondary: '#DFE0DF',
    textAlign: 'center',
    fontFamily: 'Poppins'
  },
  fonts: asyncFontTypes('Poppins')
};

export default function useTheme() {
  const [theme, setTheme] = useState(DEFAULT);

  const onChangeTheme = useCallback(({ type }) => {
    switch (type) {
      case THEME_TYPE.OPTION1:
        setTheme(Option1);
        break;

      case THEME_TYPE.OPTION2:
        setTheme(Option2);
        break;

      case THEME_TYPE.OPTION3:
        setTheme(Option3);
        break;

      case THEME_TYPE.DEFAULT:
      default:
        setTheme(DEFAULT);
        break;
    }
  }, []);

  return {
    theme,
    onChangeTheme
  };
}
