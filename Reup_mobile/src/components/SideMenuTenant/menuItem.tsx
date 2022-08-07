import { MenuData } from ".";

//TODO: Just for testing
export const hardMenuData: MenuData[] = [
  {
    key: 'home',
    title: 'Home',
    icon: '',
    isActive: false,
  },
  {
    key: 'my-account',
    title: 'My Account',
    icon: '',
    subMenus: [
      {
        key: 'my_profile',
        title: 'My Profile',
        icon: '',
        isActive: false,
      },
      {
        key: 'my_apartments',
        title: 'My Apartments',
        icon: '',
        isActive: false,
      },
      {
        key: 'document',
        title: 'Documents',
        icon: '',
        isActive: false,
      }
    ],
    isActive: false,
  },
  {
    key: 'financial-management',
    title: 'Financial Management',
    icon: '',
    isActive: false,
  },
  {
    key: 'monthly-bill',
    title: 'Monthly Bill',
    icon: '',
    isActive: false,
  },
  {
    key: 'calendar',
    title: 'Calendar',
    icon: '',
    isActive: false,
  },
  {
    key: 'maintenance-requests',
    title: 'Maintenance Requests',
    icon: '',
    isActive: false,
  },
  {
    key: 'bulletin_board',
    title: 'Bulletin Board',
    icon: '',
    subMenus: [
      {
        key: 'general_notifications',
        title: 'General Notifications',
        icon: '',
        isActive: false,
      },
      {
        key: 'for_lease_for_sale',
        title: 'For Lease - For Sale',
        icon: '',
        isActive: false,
      }
    ],
    isActive: false,
  },
  {
    key: 'front_desk',
    title: 'Front Desk',
    icon: '',
    subMenus: [
      {
        key: 'facilities',
        title: 'Facilities',
        icon: '',
        isActive: false,
      },
      {
        key: 'my_delivery',
        title: 'My Delivery',
        icon: '',
        isActive: false,
      },
      {
        key: 'incoming_visitors',
        title: 'Incoming Visitors',
        icon: '',
        isActive: false,
      }
    ],
    isActive: false,
  },
  {
    key: 'store',
    title: 'Store',
    icon: '',
    isActive: false,
  },
  {
    key: 'log-out',
    title: 'Log out',
    icon: '',
    isActive: false,
  },
];
