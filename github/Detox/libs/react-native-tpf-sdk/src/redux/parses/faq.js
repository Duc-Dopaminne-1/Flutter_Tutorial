import moment from 'moment';
import { RequestType } from '../../global/request_type';

const getRequestType = requestType => {
  const result = RequestType.find(item => item.code === requestType);
  return result?.displayName;
};

const getImgNameType = imageLink => {
  const imgSplit = imageLink.split('/');
  const imgUrl = imgSplit[imgSplit.length - 1].split('.');
  const imgName = imgUrl[0].slice(imgUrl[0].length - 4);
  const imgType = imgUrl[imgUrl.length - 1];
  return {
    imgName: imgName ? `IMG_${imgName}.${imgUrl[1]?.toUpperCase()}` : '',
    imgType
  };
};

const parseImages = (images = []) => {
  return images.map(image => {
    return {
      url: image?.link,
      name: getImgNameType(image?.link || '')?.imgName,
      size: image?.size || '0 MB',
      type: getImgNameType(image?.link || '')?.imgType
    };
  });
};

const parseSupportDetail = detail => {
  return {
    id: detail?.id,
    date: detail?.creationTime ? moment(detail?.creationTime).format('DD/MM/YYYY') : '',
    memberId: detail?.memberId,
    content: detail?.content,
    images: detail?.imageLink ? parseImages(detail?.imageLink) : []
  };
};

export const parseFAQSupportItem = item => {
  return {
    id: item?.id,
    memberId: item?.memberId,
    date: item?.creationTime ? moment(item?.creationTime).format('DD/MM/YYYY') : '',
    lastModify: item?.lastModificationTime
      ? moment(item?.lastModificationTime).format('DD/MM/YYYY')
      : '',
    requestType: item?.requestType ? getRequestType(item?.requestType) : '',
    content: item?.content,
    images: item?.imageLink ? parseImages(item?.imageLink) : [],
    requesterType: item?.requesterType,
    status: item?.status,
    supporDetail: item?.supporDetail
      ? item?.supporDetail.map(_item => parseSupportDetail(_item))
      : []
  };
};

export const parseListFAQSupport = list => {
  return list.map(item => parseFAQSupportItem(item?.faqSupport));
};
