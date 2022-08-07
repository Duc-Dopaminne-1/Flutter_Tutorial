import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import styles from './styles';
import { CustomText } from '@src/components/CustomText';
import { DetailInformation } from '@src/components/DetailInformation';
import translate from '@src/localize';
import { IPerson } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user/models';
import { formatPrice, formatCoin } from '@src/utils';
import HTML from 'react-native-render-html';

interface Props {
  title: string;
  code?: string;
  price?: number;
  creators?: Array<IPerson>;
  artists?: Array<IPerson>;
  writers?: Array<IPerson>;
  description?: string;
}

const ProductInfo = (props: Props) => {
  const { title, code, price, creators, artists, writers, description } = props;

  const getCreator = () => {
    if (creators && creators.length > 0) {
      const listCreator = [];
      for (let i = 0; i < creators.length; i++) {
        listCreator.push(creators[i].name);
      }
      return listCreator.join(' & ').toString();
    }
    return '';
  };

  const getArtist = () => {
    if (artists && artists.length > 0) {
      const listArtist = [];
      for (let i = 0; i < artists.length; i++) {
        listArtist.push(artists[i].name);
      }
      return listArtist.join(' & ').toString();
    }
    return '';
  };

  const getWriters = () => {
    if (writers && writers.length > 0) {
      const listWriter = [];
      for (let i = 0; i < writers.length; i++) {
        listWriter.push(writers[i].name);
      }
      return listWriter.join(' & ').toString();
    }
    return '';
  };

  const renderName = () => {
    return <CustomText numberOfLines={1} style={styles.name} text={`${title}`} />;
  };

  const renderProductCode = () => {
    return (
      <View style={styles.productCode}>
        {code && <CustomText style={styles.codeText} text={`SKU: ${code}`} />}
      </View>
    );
  };

  const renderPrice = () => {
    return <CustomText style={styles.textPrice} text={price ? `${formatPrice(price)}` : 'Out of stock'} />;
  };

  const renderDetailInfo = () => {
    return (
      <DetailInformation
        firstTitle={translate('books.creator')}
        firstDetail={getCreator()}
        secondTitle={translate('books.artist')}
        secondDetail={getArtist()}
        thirdTitle={translate('books.writers')}
        thirdDetail={getWriters()}
      />
    );
  };

  const renderDescription = () => {
    if (!description) return null;
    const htmlContent = `<p>${description}</p>`;
    return (
      <View style={styles.contentContainer}>
        <HTML ignoredStyles={["font-family"]} html={htmlContent} allowFontScaling={false} baseFontStyle={styles.contentDes} />
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.infoContainer}>
        {renderName()}
        {renderProductCode()}
        {renderPrice()}
        {renderDetailInfo()}
      </View>
      {renderDescription()}
    </View>
  );
};

export default ProductInfo;
