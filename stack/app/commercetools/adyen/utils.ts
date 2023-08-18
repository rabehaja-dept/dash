export const getAccountAgeAndChangeIndicator = (date: number) => {
  const diffTime = Math.abs(new Date().getTime() - new Date(date).getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return "thisTransaction";
  } else if (diffDays < 30) {
    return "lessThan30Days";
  } else if (diffDays >= 30 && diffDays <= 60) {
    return "from30To60Days";
  } else if (diffDays > 60) {
    return "moreThan60Days";
  } else {
    return "notApplicable";
  }
};

export const validateResponseLength = (response: any): boolean => {
  if (!response.results.length || response.results.length > 1) {
    return false;
  }

  return true;
};
