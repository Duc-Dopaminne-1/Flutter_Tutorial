import { Image, Text, TouchableOpacity, View } from 'react-native';
import React, { Component } from 'react';
import { IUser } from '@models/user';
import { MINUS } from '@src/constants/icons';
import { styles } from './styles';

interface Props {
  item: IUser;
  onClickItem: (item: IUser) => void;
  isFirstItem?: boolean;
}

export default class ItemContactMessage extends Component<Props> {
  /**
   * Function render item Filter
   */

  /**
   * Function on click item Filter
   */
  onPress = () => {
    this.props.onClickItem(this.props.item);
  };

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <View style={styles.container}>
          <Text style={styles.textStyleChecked} allowFontScaling={false}>
            {`${this.props.item.firstName} ${this.props.item.lastName}`}
          </Text>

          <View style={styles.imagePlus}>
            <Image style={styles.containerImage} resizeMode="contain" source={MINUS} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
