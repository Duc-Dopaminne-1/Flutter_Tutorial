import {useState} from 'react';

export const BLOCKS = {
  // EVENTS: 'EVENTS',
  // STEPS: 'STEPS',
  // PROPERTY_POSTS: 'PROPERY_POST',
  // SERVICES: 'SERVICES',
  // REGISTER: 'REGISTER',
  // TOPENERS: 'TOPENERS',
  NEWS: 'NEWS',
  KNOWLEDGE: 'KNOWLEDGE',
};

const blocks = Object.values(BLOCKS);

export const useBlocks = () => {
  const [items, setItems] = useState([]);

  const isLastItem = () => {
    return items.length === blocks.length;
  };

  const load = item => {
    setItems(prevItems => [...prevItems, item]);
  };

  const loadMore = () => {
    if (isLastItem()) {
      return;
    }
    load(blocks[items.length]);
  };

  const isLoading = name => {
    return items.filter(value => value === name).length === 0;
  };

  return {
    setItems,
    loadMore,
    isLoading,
    isLastItem,
  };
};
