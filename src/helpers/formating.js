const formatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const formatMoney = (cost) => {
  return formatter.format(cost);
};
