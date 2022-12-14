import {useAnalytics} from '@segment/analytics-react-native';
import moment from 'moment';
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  useCreateCommentMutation,
  useCreateReplyMutation,
  useGetCommentsLazyQuery,
  useGetRepliesByCommentIdForFrontOfficeLazyQuery,
  useLikeCommentMutation,
} from '../api/graphql/generated/graphql';
import {useGraphqlApiLazy, useMutationGraphql} from '../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../appData/appContext/useAppContext';
import {FETCH_POLICY} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {IMAGES} from '../assets/images';
import {translate} from '../assets/localize';
import {Message} from '../assets/localize/message/Message';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {medium, normal, small, smallNormal, tiny} from '../assets/theme/metric';
import {useLogin} from '../screens/Auth/useLogin';
import {TrackingActions} from '../screens/WithSegment';
import {getCommentObjectType} from '../utils/GetMasterData';
import {SCREEN_SIZE} from '../utils/ImageUtil';
import NumberUtils from '../utils/NumberUtils';
import Avatar from './Avatar';
import ModalCreateComment from './Modal/ModalCreateComment';

const AVATAR_SIZE = 35;

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  bubbleInfoContainer: {
    flexDirection: 'row',
    margin: small,
    alignItems: 'center',
    marginBottom: normal,
  },
  infoView: {flexDirection: 'row', marginRight: 25},
  textTime: {color: COLORS.GRAY_A3, fontSize: smallNormal},
  textLike: {fontSize: smallNormal},
  textReply: {fontSize: 12, color: COLORS.BLACK_31},
  bubbleItemContainer: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: tiny,
    padding: tiny,
    marginLeft: tiny,
  },
  messageLine: {flex: 1, marginLeft: normal, marginTop: small, borderLeftWidth: 1},
  inputView: {
    paddingVertical: normal,
    height: 82,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  inputText: {
    paddingHorizontal: normal,
    flex: 1,
    borderRadius: tiny,
    paddingRight: 40,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GRAY_A3,
    justifyContent: 'center',
  },
  viewMoreText: {...FONTS.bold, color: COLORS.PRIMARY_A100, marginLeft: 64, marginBottom: 16},
  titleMessage: {...FONTS.bold, fontSize: 20, marginLeft: 4},
  emptyText: {
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: medium,
    color: COLORS.BLACK_31,
    fontSize: 14,
    ...FONTS.regular,
  },
  avatar: {width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE},
  moreComment: {marginLeft: 32},
  commentContent: {
    ...FONTS.regular,
    width: width - 100,
    marginRight: normal,
    color: COLORS.BLACK_31,
    lineHeight: 22,
  },
  iconReply: {marginRight: tiny, width: 16, height: 16, tintColor: COLORS.BLACK_31},
});

const REQUEST_CAPTCHA_TYPE = {
  comment: 'comment',
  reply: 'reply',
};

const ChatBubbleInfo = React.memo(
  ({like, showReply = true, onPressLike, isLike = 0, onPressReply, time}) => {
    const commentTime = moment(time).startOf(new Date()).fromNow();
    const [numberLike, setNumberLike] = useState(like ?? 0);
    const [isLiked, setIsLiked] = useState(isLike);
    const {showLogin} = useLogin();
    const likeColor = isLiked ? COLORS.PRIMARY_B100 : COLORS.GRAY_A3;

    const likeComment = () => {
      showLogin(() => {
        setIsLiked(!isLiked);
        setNumberLike(isLiked ? numberLike - 1 : numberLike + 1);
        onPressLike();
      });
    };

    return (
      <View style={styles.bubbleInfoContainer}>
        <View style={styles.infoView}>
          <Text style={styles.textTime}>{commentTime}</Text>
        </View>
        <TouchableOpacity onPress={likeComment} style={[styles.infoView, HELPERS.crossCenter]}>
          <Icon name={'heart'} size={15} color={likeColor} style={{marginRight: tiny}} />
          <Text style={styles.textLike}>{`${NumberUtils.convertNumberToThousand(
            numberLike,
          )} Th??ch`}</Text>
        </TouchableOpacity>
        {showReply && (
          <TouchableOpacity onPress={onPressReply} style={[styles.infoView, HELPERS.crossCenter]}>
            <Image style={styles.iconReply} source={IMAGES.IC_MESSAGE_LINEAR} />
            <Text style={styles.textReply}>{translate('social.comment.reply')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

const BubbleItem = React.memo(({item, showReply = true, onPressReply, onPressLike}) => {
  const data = item?.node ?? item;
  const {content, userInfo, currentUserLikeComment, totalLike, createdDatetime} = data;
  const {fullName} = userInfo;
  return (
    <View>
      <View style={styles.bubbleItemContainer}>
        <Text style={{...FONTS.bold, color: COLORS.BLACK_31, maxWidth: SCREEN_SIZE.WIDTH - 80}}>
          {fullName}
        </Text>
        <Text style={styles.commentContent}>{content}</Text>
      </View>
      <ChatBubbleInfo
        isLike={currentUserLikeComment}
        showReply={showReply}
        onPressReply={onPressReply}
        like={totalLike}
        onPressLike={onPressLike}
        time={createdDatetime}
      />
    </View>
  );
});

const ItemComment = React.memo(({index, item, onPressReply, onPressLike}) => {
  const borderColor = index === index - 1 ? COLORS.NEUTRAL_WHITE : COLORS.GRAY_A3;
  const {replies, totalReply, commentId} = item?.node;
  const [listReply, setListReply] = useState(replies);

  const {startApi: getReplyComment} = useGraphqlApiLazy({
    graphqlApiLazy: useGetRepliesByCommentIdForFrontOfficeLazyQuery,
    dataField: 'curRepliesByCommentIdForFrontOffice',
    onSuccess: data => {
      const list = [...data?.edges];
      setListReply(list.reverse());
    },
  });

  const getReply = () => {
    getReplyComment({
      variables: {
        commentId: commentId,
        first: listReply.length + 5,
        after: '',
      },
    });
  };

  const onPress = () => {
    onPressReply(item?.node?.commentId);
  };

  return (
    <View style={{...HELPERS.row, marginBottom: small}}>
      <View>
        <Avatar
          name={''}
          size={AVATAR_SIZE}
          url={item?.node?.userInfo?.profilePhoto}
          containerStyle={styles.avatar}
        />
        <View style={[styles.messageLine, {borderLeftColor: borderColor}]} />
      </View>
      <View>
        <BubbleItem onPressReply={onPress} onPressLike={() => onPressLike(item)} item={item} />
        {listReply &&
          listReply.map(replyItem => (
            <ItemReply
              key={replyItem.feedItemId}
              onPressLike={() => onPressLike(replyItem)}
              item={replyItem}
            />
          ))}
        {totalReply && totalReply >= 2 && listReply.length < totalReply ? (
          <TouchableOpacity onPress={getReply}>
            <Text style={[styles.viewMoreText, {marginLeft: small}]}>
              {translate('social.comment.viewMoreReply')}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
});

const ItemReply = React.memo(({item, onPressLike}) => {
  const itemReply = item.node ?? item;
  return (
    <>
      <View style={HELPERS.row}>
        <Avatar
          name={''}
          size={AVATAR_SIZE}
          url={itemReply?.userInfo?.profilePhoto}
          containerStyle={styles.avatar}
        />
        <BubbleItem showReply={false} onPressLike={() => onPressLike(itemReply)} item={itemReply} />
      </View>
    </>
  );
});

const ViewMoreText = ({text, pageInfo, customStyle, onPress}) => {
  if (pageInfo && pageInfo.hasNextPage) {
    return (
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.viewMoreText, customStyle]}>{text}</Text>
      </TouchableOpacity>
    );
  }
  return null;
};

const TextTitle = ({totalComemnt = 0}) => (
  <Text style={styles.titleMessage}>{`${translate(
    'social.comment.title',
  )} (${totalComemnt})`}</Text>
);

const InputChat = ({customStyle, onPress}) => {
  return (
    <View style={[styles.inputView, HELPERS.row, customStyle]}>
      <TouchableOpacity onPress={onPress} style={styles.inputText}>
        <Text style={{color: COLORS.GRAY_A0}}>{translate('social.comment.placeHolder')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const ViewEmptyMessage = ({onPress, customEmptyMessage}) => (
  <>
    <TextTitle />
    <View style={{height: small}} />
    <InputChat onPress={onPress} />
    <Image style={[HELPERS.selfCenter, {marginTop: normal}]} source={IMAGES.EMPTY_COMMENT} />
    <Text style={styles.emptyText}>
      {customEmptyMessage ? customEmptyMessage : translate('social.comment.emptyMessage')}
    </Text>
  </>
);

const CommentComponents = forwardRef(
  ({objectId, customStyle, objectTitle = '', feedObjectTypeId, customEmptyMessage}, ref) => {
    const {track} = useAnalytics();
    const [comments, setComments] = useState([]);
    const [requestCommentType, setRequestCommentType] = useState('comment');
    const [error, setError] = useState('');
    const {showLogin} = useLogin();
    const [replyInfo, setReplyInfo] = useState({});
    const [page, setPage] = useState(1);
    const [pageInfo, setPageInfo] = useState(1);
    const [isShowCaptcha, setShowCaptcha] = useState(false);
    const inputRef = useRef(null);
    const modalCommentRef = useRef(null);
    const {getMasterData, showToastInfo} = useContext(AppContext);
    const masterData = getMasterData();
    const {typeId, isActive} = getCommentObjectType(masterData, feedObjectTypeId);

    const onSuccessGetListComment = data => {
      setComments(data?.edges);
      setPageInfo(data?.pageInfo);
    };

    const {startApi: getListComment} = useGraphqlApiLazy({
      graphqlApiLazy: useGetCommentsLazyQuery,
      queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
      dataField: 'curCommentsByObjectIdForFrontOffice',
      onSuccess: onSuccessGetListComment,
      onError: () => {},
    });

    const getListComments = () => {
      if (isActive) {
        getListComment({
          variables: {
            input: {
              feedObjectId: objectId,
              feedObjectTypeId: typeId,
            },
            first: page * 5,
            after: '',
          },
        });
      }
    };

    useEffect(() => {
      getListComments();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const {startApi: createComment} = useMutationGraphql({
      graphqlApiLazy: useCreateCommentMutation,
      dataField: 'createCommentForFrontOffice',
      showSpinner: true,
    });

    const {startApi: likeComment} = useMutationGraphql({
      graphqlApiLazy: useLikeCommentMutation,
      dataField: 'likeCommentForFrontOffice',
    });

    const {startApi: createReply} = useMutationGraphql({
      graphqlApiLazy: useCreateReplyMutation,
      dataField: 'createCommentForFrontOffice',
      showSpinner: true,
    });

    const commentSuccess = data => {
      track(TrackingActions.commentSubmitted, {
        name: objectTitle ?? '',
      });

      showToastInfo({
        title: translate('social.comment.titleSuccess'),
        message: translate('social.comment.sendMessageSuccess'),
      });
      setShowCaptcha(data?.recaptchaEnable);
      inputRef?.current?.clear();
      modalCommentRef?.current?.close();
    };

    // create comment
    const createCommets = (message, captcha = null) => {
      showLogin(() =>
        createComment(
          {
            variables: {
              input: {
                content: message,
                feedObjectId: objectId,
                feedObjectTitle: objectTitle,
                feedObjectTypeId: typeId,
                tokenCaptcha: captcha,
              },
            },
          },
          data => {
            commentSuccess(data);
          },
          errorData => {
            if (errorData?.errorMessageCode === Message.MPC_ERR_011) {
              showModalVerifyCode();
            } else if (
              errorData?.errorMessageCode === Message.MPC_ERR_015 &&
              errorData?.errorResponse?.recaptchaEnable
            ) {
              setShowCaptcha(errorData?.errorResponse?.recaptchaEnable);
            } else if (errorData?.errorMessageCode === Message.MPC_ERR_010) {
              setError(translate('social.comment.sendMessageError'));
            }
          },
        ),
      );
    };

    const showModalVerifyCode = () => {
      setShowCaptcha(true);
    };

    const createReplys = ({message, parentComment, captcha = null}) => {
      showLogin(() =>
        createReply(
          {
            variables: {
              input: {
                content: message,
                feedObjectId: objectId,
                feedObjectTitle: objectTitle,
                feedObjectTypeId: typeId,
                parentCommentId: parentComment,
                tokenCaptcha: captcha,
              },
            },
          },
          data => {
            setReplyInfo({});
            commentSuccess(data);
          },
          () => {
            showModalVerifyCode();
          },
        ),
      );
    };

    const onPressLike = item => {
      const itemData = item?.node ?? item;
      const feedItemId = itemData.feedItemId || '';
      likeComment(
        {
          variables: {
            input: {
              commentId: itemData.commentId,
              feedItemId: feedItemId,
              isLikeComment: !itemData.currentUserLikeComment,
            },
          },
        },
        () => {},
      );
    };

    const onRequestCommentWithCaptcha = (message, captcha) => {
      if (requestCommentType === REQUEST_CAPTCHA_TYPE.comment) {
        createCommets(message, captcha);
      } else {
        createReplys({
          message: message,
          messageReply: replyInfo.message,
          parentComment: replyInfo.parentComment,
          captcha: captcha,
        });
      }
    };

    useImperativeHandle(ref, () => ({
      refreshComment() {
        getListComments();
      },
      comments: comments,
      isActive: isActive,
    }));

    const openModalComment = type => {
      setRequestCommentType(type);
      setError('');
      showLogin(() => {
        modalCommentRef?.current?.open();
      });
    };

    if (isActive === false) {
      return null;
    }

    if (!comments || comments.length === 0) {
      return (
        <>
          <View style={customStyle}>
            <ViewEmptyMessage
              onPress={() => openModalComment(REQUEST_CAPTCHA_TYPE.comment)}
              customEmptyMessage={customEmptyMessage}
            />
          </View>
          <ModalCreateComment
            objectId={objectId}
            onRequestCommentWithCaptcha={(message, captch) =>
              onRequestCommentWithCaptcha(message, captch)
            }
            errorCaptcha={error}
            isShowCaptcha={isShowCaptcha}
            modalRef={modalCommentRef}
          />
        </>
      );
    } else {
      return (
        <>
          <View style={customStyle}>
            <TextTitle totalComemnt={comments.length} />
            <View style={{paddingVertical: normal}}>
              {comments.map((item, index) => (
                <ItemComment
                  onPressReply={commentId => {
                    setReplyInfo({
                      parentComment: commentId,
                    });
                    openModalComment(REQUEST_CAPTCHA_TYPE.reply);
                  }}
                  onPressLike={commentItem => onPressLike(commentItem)}
                  key={item?.node?.commentId}
                  item={item}
                  index={index}
                />
              ))}
            </View>
            <ViewMoreText
              pageInfo={pageInfo}
              text={translate('social.comment.viewMoreComment')}
              onPress={() => setPage(page + 1)}
              customStyle={styles.moreComment}
            />
            <InputChat onPress={() => openModalComment(REQUEST_CAPTCHA_TYPE.comment)} />
          </View>
          <ModalCreateComment
            objectId={objectId}
            onRequestCommentWithCaptcha={(message, captch) =>
              onRequestCommentWithCaptcha(message, captch)
            }
            errorCaptcha={error}
            isShowCaptcha={isShowCaptcha}
            modalRef={modalCommentRef}
          />
        </>
      );
    }
  },
);

export default React.memo(CommentComponents);
