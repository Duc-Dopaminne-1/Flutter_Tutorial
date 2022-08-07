import firebase from 'react-native-firebase';
import moment from 'moment';

const auth = firebase.auth();
const store = firebase.firestore();

const getCampaignById = async campaignId =>
  new Promise((resolve, reject) => {
    let collection = store.collection('campaigns');
    let campaignDoc = collection.doc(campaignId);
    campaignDoc.get()
      .then(snapshot => {
        let campaignData = snapshot.data();

        let participantDoc = store
          .collection('participant_groups')
          .doc(campaignData.participant_group_id);
        participantDoc.get().then(group_snapshot => {
          let participant_group_data = group_snapshot.data();
          campaignData.participant_group = participant_group_data;
          resolve(campaignData);
        }).catch(error => reject(error));
      })
      .catch(error => reject(error));
  });

const compare = (itemA, itemB) => {
  return itemB.createdAt - itemA.createdAt;
};

const getCampaigns = async () => {
  try {
    let collection = store.collection('campaigns');
    let snapshot = await collection.get();
    let tasks = snapshot.docs.map(campaignDoc => getCampaignById(campaignDoc.id));
    let campaigns = await Promise.all(tasks);
    campaigns = campaigns.filter(campaign => {
      if ( !campaign.status ) {
        return false;
      }
      // check from, to dates
      const today = moment().unix();
      const from = moment(campaign.from).unix();
      const to = moment(campaign.to).unix();
      if (from > today || today > to) {
        return false;
      }
      let index = campaign?.participant_group?.participant_list.findIndex(
        item => item.email === auth.currentUser.email && item.status
      );
      return index > -1;
    });
    campaigns.sort(compare);
    return campaigns;
  } catch (error) {
    throw error;
  }
};

export default {
  getCampaignById,
  getCampaigns
};
