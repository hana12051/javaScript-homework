// countries.js 모듈에서 COUNTRIES 배열 가져오기
import { COUNTRIES } from './countries.js'

// DOM 요소 가져오기
const input = document.getElementById('country')           // 사용자 입력 필드
const suggestions = document.getElementById('suggestions') // 자동완성 리스트 영역

// 사용자가 입력할 때마다 실행되는 이벤트
input.addEventListener('input', () => {
  // 입력된 텍스트를 소문자로 변환하고 앞뒤 공백 제거
  const keyword = input.value.toLowerCase().trim()

  // 입력이 없으면 리스트 초기화 후 숨김 처리
  if (!keyword) {
    suggestions.innerHTML = ''
    suggestions.hidden = true
    return
  }

  // COUNTRIES 목록 중에서 입력값이 포함된 국가 필터링
  const filtered = COUNTRIES.filter(({ name }) =>
    name.toLowerCase().includes(keyword)
  )

  // 필터링된 항목을 <li> 요소로 변환 후 목록에 출력
  suggestions.innerHTML = filtered
    .map(({ name }) => `<li>${name}</li>`)
    .join('')

  // 자동완성 목록 표시
  suggestions.hidden = false
})

// 자동완성 항목 클릭 시 입력 필드에 반영
suggestions.addEventListener('click', (e) => {
  // 클릭한 요소가 <li>일 때만 처리
  if (e.target.tagName === 'LI') {
    // 선택된 나라 이름을 input에 채워 넣음
    input.value = e.target.textContent

    // 자동완성 목록 초기화 및 숨김
    suggestions.innerHTML = ''
    suggestions.hidden = true
  }
})
