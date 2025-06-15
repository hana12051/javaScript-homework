// 등급을 나누는 힘수

function evaluateScore(score) {
  let grade, description;

  if (score >= 90) {
    grade = 'A';
    description = '매우 우수';
  } else if (score >= 80) {
    grade = 'B';
    description = '우수';
  } else if (score >= 70) {
    grade = 'C';
    description = '보통';
  } else if (score >= 60) {
    grade = 'D';
    description = '미달, 통과 기준 근접';
  } else {
    grade = 'F';
    description = '낙제';
  }

  return {
    score,
    grade,
    description
  };
}

const result = evaluateScore(87);
console.log(result); 

const result2 = evaluateScore(55);
console.log(result2);