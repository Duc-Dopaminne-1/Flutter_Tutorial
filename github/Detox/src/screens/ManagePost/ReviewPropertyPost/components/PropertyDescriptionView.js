import React, {useMemo, useRef, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import HTMLView from 'react-native-htmlview';

import {translate} from '../../../../assets/localize';
import styles, {htmlStyles} from '../styles';

const MAX_DESCRIPTION_LINES = 5;
const DESCRIPTION_LINE_HEIGHT = 17;

const replaceTagToText = (postDescription, tag, text) => {
  if (!postDescription) {
    return '';
  }
  const result = postDescription.replaceAll(tag, text);
  return result;
};

const PropertyDescription = ({postDescription}) => {
  const [collapse, setCollapse] = useState(false);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const rendered = useRef(false);

  const onPressShowMore = () => {
    setCollapse(!collapse);
  };

  const onTextLayout = event => {
    if (!rendered.current && postDescription) {
      const textLargerThanMaxLine = event.nativeEvent.lines.length > MAX_DESCRIPTION_LINES;

      setShowMoreBtn(textLargerThanMaxLine);
      setCollapse(textLargerThanMaxLine);
      rendered.current = true;
    }
  };

  const renderNode = (node, index, siblings, parent, defaultRenderer) => {
    if (node.type === 'tag') {
      const specialStyle = node.attribs.style ?? {};

      const content = (
        <Text key={index} style={specialStyle}>
          {defaultRenderer(node.children, parent)}
        </Text>
      );

      const lineBreak = <Text key={node.name + index}>{'\n'}</Text>;

      switch (node.name) {
        case 'p':
          return content;
        case 'div':
          if (node.next === null) {
            return content;
          }

          if (node?.children?.length > 0 && !node?.children[0]?.name === 'br') {
            return lineBreak;
          }

          return (
            <>
              {content}
              {lineBreak}
            </>
          );
      }
    }
  };

  const descriptionContainerStyle = useMemo(
    () => ({height: collapse ? MAX_DESCRIPTION_LINES * DESCRIPTION_LINE_HEIGHT : 'auto'}),
    [collapse],
  );

  const parsedHTMLText = useMemo(() => {
    let result = replaceTagToText(postDescription, '</div>', '</div>\n');
    result = replaceTagToText(result, '<ul>\n', '');
    result = replaceTagToText(result, '\n</ul>', '');
    result = replaceTagToText(result, '<ol>\n', '');
    result = replaceTagToText(result, '\n</ol>', '');
    result = replaceTagToText(result, '<p>', '');
    result = replaceTagToText(result, '</p>', '');
    return result;
  }, [postDescription]);

  return (
    <>
      <Text style={styles.title}>{translate('common.description')}</Text>
      <Text
        style={styles.postDescription}
        numberOfLines={collapse ? MAX_DESCRIPTION_LINES : null}
        onTextLayout={onTextLayout}>
        {parsedHTMLText}
      </Text>
      <View style={descriptionContainerStyle}>
        <ScrollView scrollEnabled={false}>
          <HTMLView
            value={`<div>${postDescription}</div>`}
            renderNode={renderNode}
            stylesheet={htmlStyles}
            addLineBreaks={false}
          />
        </ScrollView>
      </View>
      {showMoreBtn && (
        <TouchableOpacity style={styles.showMoreBtn} onPress={onPressShowMore}>
          <Text style={styles.showMoreText}>
            {collapse ? translate('common.viewMore') : translate('common.collapse')}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default PropertyDescription;
