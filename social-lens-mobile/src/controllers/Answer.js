import firebase from 'react-native-firebase';
import moment from 'moment';
import axios from 'axios';
import _ from 'lodash'
import {API_BASE_URL} from 'app/config';
import {processBar} from "../shared/global";
import AsyncStorage from "@react-native-community/async-storage";
import {languageUSer} from "../i18n";

const store = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export const Uploading = {
  CAMPAIGNID: 'campaignId',
  ANSWERS: 'answers',
  MEDIAS: 'medias',
  TOTALMEDIA: 'totalMedia',
  UPLOADED: 'uploaded',
  TOTALQUESTION: 'totalQuestion'
}

export const StoreUploading = {
  UPLOADING: 'uploading',
}

export const shareFirebase = 90

function getTotalMedia(medias) {
  let totalMedias = 0
  Object.keys(medias).map(key => {
    medias[key].map(media => {
          totalMedias++
        }
    )
  });
  return totalMedias
  }

function getIndexOfMedia(medias, res, dataCache) {
  const mediaId = res.ref.substr(res.ref.indexOf('-')+1, res.ref.length-1)
  let indexMedias = -1
  let indexDetail = -1
  Object.keys(dataCache[Uploading.MEDIAS]).map(key => {
    dataCache[Uploading.MEDIAS][key].map((media, index) => {

          if (media && media.id === mediaId) {
            indexMedias = key
            indexDetail = index
          }
        }
    )
  });

  indexDetail !== -1 && dataCache[Uploading.MEDIAS][indexMedias].splice(indexDetail, 1);
  return indexMedias
}

  function handleError(err) {
    processBar.next({
      showLoading: false,
      total: 0
    })
    setTimeout(() => {
      alert(err)
    }, 500)
  }

  function processUpload (snapshot, totalMedias, listUpload, totalMediaCache, totalMediasUploaded) {
  const totalMedia = totalMediaCache ? totalMediaCache : totalMedias
    listUpload[snapshot.ref.path] = (snapshot.bytesTransferred / snapshot.totalBytes * (shareFirebase / totalMedia))

    let totalProcess = 0
    Object.keys(listUpload).map(key => {
      totalProcess = totalProcess + listUpload[key]
    })

    processBar.next({
      showLoading: true,
      total: totalProcess + (shareFirebase / totalMedia * totalMediasUploaded)
    })
}

function updateCacheImage(dataCache, indexOfMedia, media) {
  const index = Uploading.UPLOADED;
    dataCache[index][indexOfMedia] ? dataCache[index][indexOfMedia].push(media) : dataCache[index][indexOfMedia] = [media]
}

 function dowLoadLink(task, media, path, resolve, medias, dataCache) {
  task.then( async (res) => {
    const indexOfMedia = getIndexOfMedia(medias, res, dataCache)

    if ( media.type === 'image') {
      const image = {
        downloadUrl: res.downloadURL,
        gsUrl: `gs://${res.metadata.bucket}${path}`,
        type: media.type,
      };
      updateCacheImage(dataCache, indexOfMedia, image)
      await AsyncStorage.setItem(StoreUploading.UPLOADING, JSON.stringify(dataCache));
      return resolve(image);
    } else {
      const video = {
        downloadUrl: res.downloadURL,
        gsUrl: `gs://${res.metadata.bucket}${path}`,
        type: media.type,
        transcriptionId: null,
        transcriptionStatus: 'progress'
      };
      updateCacheImage(dataCache, indexOfMedia, video)
      await AsyncStorage.setItem(StoreUploading.UPLOADING, JSON.stringify(dataCache));
      return resolve(video);
    }
  })
}

const submitAnswers = async (campaignId, answers, medias, totalQuestion, uploaded, totalMediaCache) => {
  const collection = store.collection('answers');
  const answerRefId = `${campaignId}-${auth.currentUser.uid}`;
  let answerRef = collection.doc(answerRefId);
  let answerDoc = await answerRef.get();

  let totalMedias = getTotalMedia(medias)
  let totalMediasUploaded = getTotalMedia(uploaded ? uploaded : [])
  const dataCache = {}

  const totalMedia = totalMediaCache ? totalMediaCache : totalMedias

  processBar.next({
    showLoading: true,
    total: (shareFirebase / totalMedia * totalMediasUploaded)
  })

  dataCache[Uploading.CAMPAIGNID] = campaignId
  dataCache[Uploading.ANSWERS] = answers
  dataCache[Uploading.MEDIAS] = _.cloneDeep(medias)
  dataCache[Uploading.TOTALMEDIA] = totalMedia
  dataCache[Uploading.TOTALQUESTION] = totalQuestion ? totalQuestion : 0
  dataCache[Uploading.UPLOADED] = uploaded ? _.cloneDeep(uploaded) : {};

  await AsyncStorage.setItem(StoreUploading.UPLOADING, JSON.stringify(dataCache));
  let listUpload = {}
  let mediaTasks = Object.keys(medias).map(key => {
    let tasks = medias[key].map(
      media =>
        new Promise( (resolve, reject) => {
          if (media && media.uri) {
            let path = `/media/${moment().unix()}-${media.id}`;
            let ref = storage.ref(path);
            const task = ref.putFile(media.uri, {})
            task.on('state_changed',
                function progress(snapshot) {
                  processUpload(snapshot, totalMedias, listUpload, totalMediaCache, totalMediasUploaded)
                },
                function error(err) {
                  handleError(err)
                },
                function complete() {
                  dowLoadLink(task, media, path, resolve, medias, dataCache)
                }
            );
          } else {
            resolve(media);
          }
        })
    );
    return Promise.all(tasks);
  });
  let mediasArray = await Promise.all(mediaTasks);
  let mediasObject = {};

  mediasArray.map((media, index) => {
    mediasObject[`${index}`] = media;
    if(uploaded && uploaded.hasOwnProperty(index)) {
      mediasObject[`${index}`] = mediasObject[`${index}`].concat(uploaded[index])
    }
  });

  let answer = {
    answers,
    medias: mediasObject,
    updatedAt: moment().unix(),
    feedbacks: [],
    completed: ''
  };

  if (answerDoc.exists) {
    await answerRef.update(answer);
  } else {
    await answerRef.set(answer);
  }

  await AsyncStorage.removeItem(StoreUploading.UPLOADING);
  return answerRefId;
};

const getAnswerByUserCampaign = async campaignId => {
  const collection = store.collection('answers');
  try {
    let answerRef = collection.doc(`${campaignId}-${auth.currentUser.uid}`);
    let answerDoc = await answerRef.get();
    if (answerDoc.exists) {
      return answerDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const transcribeAnswer = async (numOfQuestions, answerRefId) => {
  try {
    let url = API_BASE_URL + 'analytics/autotranscribe';
    const collection = store.collection('answers');
    const answerRef = collection.doc(answerRefId);
    const snapshot = await answerRef.get();
    let answerData = snapshot.data();

    let tasks = [];

    for( let index = 0; index < numOfQuestions; index++) {
      answerData.medias[index].map((item, vIndex) => {
        if ( item.type === 'video' ) {
            tasks.push(
                axios.post(url, {
                  type: 'answer',
                  url: item.gsUrl,
                  id: answerRefId,
                  index,
                  vIndex
                }, {
                  headers: {
                    'content-type': 'application/json',
                    language: languageUSer
                  }
                })
            )
        }
      });
    }
    await Promise.all(tasks);
  } catch (error) {
    alert(error.message);
  }
};

const requestPayment = async (message) => {
  let url = API_BASE_URL + 'report/sendAdminEmail';
  return axios.post(url, {
    message
  }, {
    headers: { 
      'content-type': 'application/json',
      language: languageUSer
    }
  });
};

export default {
  submitAnswers,
  getAnswerByUserCampaign,
  transcribeAnswer,
  requestPayment
};
