import firebase from 'react-native-firebase';

const store = firebase.firestore();
const auth = firebase.auth();

let collection = store.collection('conversation');

const sendMessage = async (message, campaignId) => {  
  let conversationRef = collection.doc(campaignId);
  let doc = await conversationRef.get();

  let data = [];
  if (doc.exists) {
    data = doc.data().messages;
  }

  data.unshift(message);
  await conversationRef.set({
    messages: data
  });
};

const getConversationMessages = async campaignId => {
  let collection = store.collection('conversation');
  let conversationRef = collection.doc(campaignId);
  let doc = await conversationRef.get();
  let data = [];
  if ( doc.exists ) {
    data = doc.data().messages;
  }
  return data;
};

const checkConversation = async campaignId => {
  let uid = auth.currentUser.uid;
  let ref = store.collection('conversation').doc(campaignId);
  let doc = await ref.get();
  let data = [];
  if ( doc.exists ) {
    data = doc.data().messages;
  }
  let isJoined = false;
  for ( let index in data ) {
    if (data[index].user._id === uid) {
      isJoined = true;
      break;
    }
  }
  return isJoined;
};

export default {
  sendMessage,
  getConversationMessages,
  checkConversation
};
