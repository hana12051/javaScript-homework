//4번 할인된 게산 값 함수

function calculateDiscountPrice(price, discountRate) {
  const discount = price * (discountRate / 100);
  const discountedPrice = price - discount;
  return Math.round(discountedPrice); // 소수점 반올림
}

const salePrice = calculateDiscountPrice(18700, 20);
console.log(`할인가는 ${salePrice}원입니다.`);