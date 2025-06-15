function calculateCostPrice(sellingPrice) {
  const marginRate = 0.1;
  const costPrice = sellingPrice / (1 + marginRate);
  return costPrice;
}
const price = calculateCostPrice(11_000);
console.log(`원가는 ${price}원입니다.`);