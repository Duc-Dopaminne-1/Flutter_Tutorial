import { IAuthState } from '@src/modules/auth/reducer';
import { IBookState } from '@src/modules/books';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IComment } from '@goldfishcode/noir-caesar-api-sdk/libs/api/comment/models';
import { ITVState } from '@src/modules/tv';
import { IExploreState } from '@src/modules/explore';
import { IBlogState } from '@src/modules/blog';
import { ICartState } from '@src/modules/cart/reducer';
import { IPageContentState } from '@src/modules/pageContent/reducer';
import { IPaymentState } from '@src/modules/payment';
import { IAPState } from '@src/modules/iap/reducer';
import { IChatChannelState } from '@src/modules/chat/channel';
import { IListChatMessageState } from '@src/modules/chat/message';
import { INotificationState } from '@src/modules/notifications/notification';
import { IListUserState } from '@src/modules/user';
import { ILibraryState } from '@src/modules/library/reducer';

export interface RootState {
  auth: IAuthState;
  book: IBookState;
  comment: IPagination<IComment>;
  tv: ITVState;
  appState: any;
  explore: IExploreState;
  blog: IBlogState;
  cart: ICartState;
  pageContent: IPageContentState;
  payment: IPaymentState;
  iap: IAPState;
  chatChannel: IChatChannelState;
  chatMessage: IListChatMessageState;
  notification: INotificationState;
  user: IListUserState;
  library: ILibraryState;
}
