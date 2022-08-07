const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

export const convertDate = (month: string) => { // (month, year) to [month, year]
  const data = month.toLowerCase().split(',');
  if(data.length === 2) {
    return [months.indexOf(data[0]) + 1, parseInt(data[1])];
  }
 return [];
};
