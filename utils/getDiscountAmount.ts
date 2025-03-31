export const getDiscountAmount = (
  totalPrice: number,
  discountPercentage: number,
): number => {
  if (discountPercentage < 0 || discountPercentage > 100) {
    throw new Error("Discount percentage must be between 0 and 100");
  }
  return (totalPrice * discountPercentage) / 100;
};
