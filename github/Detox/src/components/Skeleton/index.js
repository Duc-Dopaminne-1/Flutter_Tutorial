import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {COLORS} from '../../assets/theme/colors';
import {commonStyles} from '../../assets/theme/styles';

const styles = StyleSheet.create({
  view: {flexDirection: 'row', marginTop: 10},
});
export const SkeletonEvent = () => {
  return (
    <ScrollView horizontal>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item width={300} height={150} marginLeft={16} borderRadius={5} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            width={300}
            height={150}
            marginRight={16}
            marginLeft={16}
            borderRadius={5}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </ScrollView>
  );
};

export const SkeletonFiveStep = () => {
  return [1, 2, 3, 4, 5].map(item => (
    <SkeletonPlaceholder key={item}>
      <SkeletonPlaceholder.Item
        flexDirection="row"
        alignItems="center"
        marginLeft={12}
        marginTop={12}>
        <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
        <SkeletonPlaceholder.Item
          flex={1}
          {...commonStyles.shadowApp}
          marginLeft={12}
          marginRight={8}
          padding={12}
          borderRadius={5}>
          <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
          <SkeletonPlaceholder.Item marginTop={6} width={200} height={20} borderRadius={4} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  ));
};

export const SkeletonPlusServices = () => {
  return [1, 2, 3, 4, 5, 6, 7, 8].map(item => (
    <SkeletonPlaceholder key={item}>
      <SkeletonPlaceholder.Item
        flexDirection="row"
        alignItems="center"
        marginLeft={12}
        marginTop={12}>
        <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
        <SkeletonPlaceholder.Item
          borderWidth={1}
          flex={1}
          marginLeft={12}
          borderColor={COLORS.SEPARATOR_LINE}
          marginRight={8}
          padding={12}
          borderRadius={5}>
          <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
          <SkeletonPlaceholder.Item marginTop={6} width={200} height={20} borderRadius={4} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  ));
};

export const SkeletonNews = () => {
  return (
    <View style={{...commonStyles.shadowApp}}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item width={380} height={150} marginLeft={16} borderRadius={5} />
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                width={300}
                height={20}
                marginLeft={16}
                marginTop={5}
                borderRadius={5}
              />
              <SkeletonPlaceholder.Item
                width={250}
                height={20}
                marginLeft={16}
                marginTop={5}
                borderRadius={5}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
      <SkeletonPlaceholder>
        {[1, 2].map(item => {
          return (
            <SkeletonPlaceholder.Item key={item} flexDirection="row" marginTop={12}>
              <SkeletonPlaceholder.Item
                height={90}
                width={160}
                marginLeft={16}
                marginRight={16}
                marginTop={5}
                borderRadius={5}
              />
              <SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  height={18}
                  width={190}
                  marginRight={16}
                  marginTop={5}
                  borderRadius={5}
                />
                <SkeletonPlaceholder.Item
                  height={18}
                  width={180}
                  marginRight={16}
                  marginTop={5}
                  borderRadius={5}
                />
                <SkeletonPlaceholder.Item
                  height={18}
                  width={170}
                  marginRight={16}
                  marginTop={5}
                  borderRadius={5}
                />
                <SkeletonPlaceholder.Item
                  height={18}
                  width={50}
                  marginRight={16}
                  marginTop={5}
                  borderRadius={5}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          );
        })}
      </SkeletonPlaceholder>
    </View>
  );
};

export const SkeletonProjectHome = () => {
  return (
    <View style={{...commonStyles.shadowApp}}>
      <SkeletonPlaceholder>
        <View style={styles.view}>
          <SkeletonPlaceholder.Item
            height={200}
            width={300}
            marginRight={16}
            marginLeft={16}
            marginTop={5}
            borderRadius={5}
          />
          <SkeletonPlaceholder.Item
            height={200}
            width={300}
            marginRight={16}
            marginLeft={16}
            marginTop={5}
            borderRadius={5}
          />
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

export const SkeletonPropertyHome = () => {
  return (
    <View style={{...commonStyles.shadowApp}}>
      <SkeletonPlaceholder>
        <View style={styles.view}>
          <SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                height={200}
                marginRight={10}
                marginLeft={16}
                marginTop={5}
                borderRadius={5}
              />
              <SkeletonPlaceholder.Item
                flexDirection={'row'}
                marginLeft={16}
                marginRight={16}
                marginTop={12}>
                <SkeletonPlaceholder.Item height={40} width={40} borderRadius={20} />
                <SkeletonPlaceholder.Item>
                  <SkeletonPlaceholder.Item
                    height={10}
                    width={150}
                    marginHorizontal={20}
                    borderRadius={5}
                  />
                  <SkeletonPlaceholder.Item
                    height={10}
                    width={50}
                    marginTop={5}
                    marginHorizontal={20}
                    borderRadius={5}
                  />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item height={40} width={40} borderRadius={20} />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                height={25}
                width={250}
                marginHorizontal={20}
                borderRadius={5}
                marginTop={12}
              />
              <SkeletonPlaceholder.Item
                height={15}
                width={150}
                marginHorizontal={20}
                borderRadius={5}
                marginTop={12}
              />

              <SkeletonPlaceholder.Item
                flexDirection={'row'}
                marginLeft={16}
                marginRight={16}
                marginTop={12}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              height={200}
              marginRight={100}
              marginLeft={16}
              marginTop={5}
              borderRadius={5}
            />
            <SkeletonPlaceholder.Item
              flexDirection={'row'}
              marginLeft={16}
              marginRight={16}
              marginTop={12}>
              <SkeletonPlaceholder.Item height={40} width={40} borderRadius={20} />
              <SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item
                  height={10}
                  width={150}
                  marginHorizontal={20}
                  borderRadius={5}
                />
                <SkeletonPlaceholder.Item
                  height={10}
                  width={50}
                  marginTop={5}
                  marginHorizontal={20}
                  borderRadius={5}
                />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item height={40} width={40} borderRadius={20} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              height={25}
              width={250}
              marginHorizontal={20}
              borderRadius={5}
              marginTop={12}
            />
            <SkeletonPlaceholder.Item
              height={15}
              width={150}
              marginHorizontal={20}
              borderRadius={5}
              marginTop={12}
            />

            <SkeletonPlaceholder.Item
              flexDirection={'row'}
              marginLeft={16}
              marginRight={16}
              marginTop={12}
            />
          </SkeletonPlaceholder.Item>
        </View>
        {/* ==== */}
      </SkeletonPlaceholder>
    </View>
  );
};
