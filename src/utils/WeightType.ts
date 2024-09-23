export const GetCompleteWeightType = (id: number) => {
  if (id === 1) {
    return "Kilos";
  } else if (id === 2) {
    return "Libras";
  } else {
    return "Pesas";
  }
};

export const GetAcronymWeightType = (id: number) => {
  if (id === 1) {
    return "Kg";
  } else if (id === 2) {
    return "Lbs";
  } else {
    return "P";
  }
};
