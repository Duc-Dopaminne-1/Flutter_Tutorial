import { MeetAndGreet } from '@/services/meet';

export const meetArrived = async (auctionId: string, lng: number, lat: number, byPass: boolean) => {
  try {
    const response = await MeetAndGreet.meetArrived(auctionId, lng, lat, byPass);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const meetConfirmation = async (auctionId: string) => {
  try {
    const response = await MeetAndGreet.meetConfirmation(auctionId);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
