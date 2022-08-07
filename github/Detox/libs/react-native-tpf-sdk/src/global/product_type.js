import React from 'react';
import {
  ICFinanceActive,
  ICFinanceInActive,
  ICInsurranceHealthyActive,
  ICInsurranceHealthyInActive
} from '../assets/icons';

export const ProductType = [
  {
    id: 0,
    title: 'product_type.finance',
    iconActive: <ICFinanceActive />,
    iconInActive: <ICFinanceInActive />
  },
  {
    id: 1,
    title: 'product_type.insurrance',
    iconActive: <ICInsurranceHealthyActive />,
    iconInActive: <ICInsurranceHealthyInActive />
  },
  {
    id: 2,
    title: 'product_type.addition_service',
    iconActive: <ICFinanceActive />,
    iconInActive: <ICFinanceInActive />
  }
];
