// 성인 여부를 확인하는 함수

const canSellAlcohol = (registrationCard) => {
  return registrationCard.age >= 19;
};

const user1 = { name: "선현", age: 25, gender: "여" };
const user2 = { name: "민지", age: 18, gender: "여" };

console.log(canSellAlcohol(user1)); // true
console.log(canSellAlcohol(user2)); // false