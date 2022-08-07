import firebase from 'react-native-firebase';
import moment from 'moment';

const store = firebase.firestore();

export const updateParticipantStartStatusOfCampaign = async (pGroupId, email) => {
    const groupRef = await store.collection('participant_groups').doc(pGroupId).get();
    const groupData = groupRef.data();

    groupData.participant_list.map((item) => {
        if (email === item.email && !item.start) {
            item.start = moment().unix();
        }
    });
    store.collection('participant_groups').doc(pGroupId).set(groupData);
}