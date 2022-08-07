import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {Image, Pressable, ScrollView, View} from 'react-native';

import {IMAGES} from '../assets/images';

const icons = Object.keys(IMAGES).filter(key => key.includes('IC'));

storiesOf('Icon', module) //format
  .add('.all!', () => {
    return (
      <ScrollView>
        <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
          {icons.map(key => {
            return (
              <Pressable
                key={key}
                style={({pressed}) => ({
                  backgroundColor: pressed ? 'gray' : '#E5E5E5',
                  borderWidth: 0.2,
                  borderColor: 'black',
                })}
                onPress={() => {
                  // eslint-disable-next-line no-alert
                  alert(key.toLowerCase());
                }}>
                <Image source={IMAGES[key]} />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    );
  });
