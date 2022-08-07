import { scale } from '../utils/responsive';

const DEFAULT_PREFIX_FONT_FAMILY = 'Nunito ';

// fontFamily
const FONT_FAMILY = {
  BLACK: `${DEFAULT_PREFIX_FONT_FAMILY}Black`,
  BOLD: `${DEFAULT_PREFIX_FONT_FAMILY}Bold`,
  MEDIUM: `${DEFAULT_PREFIX_FONT_FAMILY}Medium`,
  REGULAR: `${DEFAULT_PREFIX_FONT_FAMILY}Regular`,
  ITALIC: `${DEFAULT_PREFIX_FONT_FAMILY}Italic`,
  SEMIBOLD: `${DEFAULT_PREFIX_FONT_FAMILY}SemiBold`
};

const configureFonts = fonts => {
  const fontConfig = Object.assign({}, FONT_FAMILY, fonts);
  return fontConfig;
};

// fontsize
const FONT_SIZE = {
  BoldTitle: scale(48),
  Title1: scale(40),
  Title2: scale(32),
  Title3: scale(24),
  Heading: scale(18),
  BodyText: scale(16),
  SubHead: scale(14),
  Small: scale(12),
  Tiny: scale(10)
};

const LINE_HEIGHT = {
  BoldTitle: scale(56),
  Title1: scale(48),
  Title2: scale(40),
  Title3: scale(32),
  Heading: scale(26),
  BodyText: scale(24),
  SubHead: scale(20),
  Small: scale(16),
  Tiny: scale(14)
};

export { LINE_HEIGHT, FONT_SIZE, FONT_FAMILY, configureFonts };
