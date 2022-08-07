// import PropTypes from 'prop-types';
// import React, { Component } from 'react';
// import { TouchableOpacity, View } from 'react-native';
// import { ICBack } from '../../assets/icons';
// import { TEXT_COLOR } from '../../constants/colors';
// import Heading from '../text/heading';
// import { styles } from './styles';

// export default class Header extends Component {
//   render() {
//     const { scene } = this.props;
//     const { isBackBtn } = this.props;
//     const { options } = scene.descriptor;
//     const title =
//       options.headerTitle !== undefined
//         ? options.headerTitle
//         : options.title !== undefined
//         ? options.title
//         : scene.route.name;

//     const translate = options.translate !== undefined ? options.translate : true;

//     const goBack = () => {
//       this.props.navigation.goBack();
//     };

//     // const headerRight =
//     //   options.headerRight !== undefined
//     //     ? options.headerRight
//     //     : options.headerRightModal !== undefined
//     //     ? options.headerRightModal
//     //     : null;
//     const { disableShadow } = options;
//     const RightComponent = options?.RightComponent || null;
//     const containerStyle = [styles.container, disableShadow ? {} : styles.shadow];

//     return (
//       <View style={containerStyle}>
//         <View style={styles.wrapper}>
//           {isBackBtn ? (
//             <TouchableOpacity onPress={goBack} style={styles.isBackBtn}>
//               <ICBack />
//             </TouchableOpacity>
//           ) : null}
//           <Heading translate={translate} numberOfLines={1} color={TEXT_COLOR.GreenBold}>
//             {title}
//           </Heading>
//           <View style={styles.right}>{RightComponent ? <RightComponent /> : null}</View>
//         </View>
//       </View>
//     );
//   }
// }

// Header.propTypes = {
//   isBackBtn: PropTypes.bool
// };

// Header.defaultProps = {
//   isBackBtn: false
// };
