export const parseProductWithPartner = (product, partner) => {
  return {
    ...product,
    partnerName: partner?.name,
    partnerImage: partner?.imageLink
  };
};
