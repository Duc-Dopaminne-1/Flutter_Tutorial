import { FONT_SIZE, LINE_HEIGHT } from './appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR, TEXT_COLOR } from './colors';
import { BORDER_RADIUS, DEVICE_WIDTH, SPACING } from './size';

export const HtmlContent = {
  styles: `
  * {
    margin: 0 !important;
    line-height: ${LINE_HEIGHT.BodyText}px !important;
    background-color: ${BACKGROUND_COLOR.Primary} !important;
  }
  ul {
    list-style: none;
    padding:  0  0  0 16px;
  }
  
  ul li::before {
    content: '•';
    color: ${TEXT_COLOR.GreenBold};
    font-weight: bold;
    display: inline-block; 
    width: 1em;
    margin-left: -1em;
  }

  div, li, ol, ul, span, strong, a, p {
    font-size: ${FONT_SIZE.BodyText}px !important;
    text-align: justify !important;
    color: ${TEXT_COLOR.GreenBold};
  }
  body {
      width: ${DEVICE_WIDTH - 2 * SPACING.Medium}px !important;
  }
  div {
    padding-bottom: 10px !important;
  }
  header {
    font-size: ${FONT_SIZE.Heading}px !important;
    }
  h1, h2, h3, h4, h5 {
    font-size:${FONT_SIZE.Heading}px !important;
  }
  img {
    width: ${DEVICE_WIDTH - SPACING.Medium * 2}px !important;
    height: ${DEVICE_WIDTH * 0.6}px !important;
    display: block !important;
    margin-top: ${SPACING.Normal}px !important;
    margin-bottom: ${SPACING.Normal}px !important;
  }
  `
};
import React, { useContext } from 'react';
import themeContext from '../constants/theme/themeContext';

export const HtmlContentPadding = (padding = SPACING.Medium, width = null) => {
  const theme = useContext(themeContext);

  return `
  * {
    margin: 0 !important;
    line-height: ${LINE_HEIGHT.BodyText}px !important;
    background-color: ${BACKGROUND_COLOR.Primary} !important;
    font-family: ${theme.fonts.MEDIUM}, sans-serif !important;
  }
  ul {
    list-style: none;
    padding:  0  0  0 16px;
  }
  
  ul li::before {
    content: '•';
    color: ${TEXT_COLOR.GreenBold};
    font-weight: bold;
    display: inline-block; 
    width: 1em;
    margin-left: -1em;
  }

  div, li, ol, ul, span, strong, a, p {
    font-size: ${FONT_SIZE.BodyText}px !important;
    text-align: justify !important;
    color: ${TEXT_COLOR.GreenBold};
  }
  body {
      width: ${width ? width : DEVICE_WIDTH - 2 * padding}px !important;
      height: 50px !important;
  }
  div {
    padding-bottom: 10px !important;
  }
  header {
    font-size: ${FONT_SIZE.Heading}px !important;
    }
  h1, h2, h3, h4, h5 {
    font-size:${FONT_SIZE.Heading}px !important;
  }
  img {
    width: ${width ? width : DEVICE_WIDTH - 2 * padding}px !important;
    height: ${width ? width : DEVICE_WIDTH - 2 * padding}px !important;
    display: block !important;
    margin-top: ${SPACING.Normal}px !important;
    margin-bottom: ${SPACING.Normal}px !important;
  }
  `;
};

export const Shadow = {
  shadowColor: CUSTOM_COLOR.ShuttleGray,
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.2,
  shadowRadius: BORDER_RADIUS,
  elevation: 4
};
