// countries.js에서 COUNTRIES 데이터 가져오기
import { COUNTRIES } from './countries.js'

// DOM 요소 선택
const input = document.getElementById('country')
const suggestions = document.getElementById('suggestions')

let currentIndex = -1 // 현재 선택된 항목의 인덱스

// 사용자가 입력할 때마다 자동완성 필터링
input.addEventListener('input', () => {
  const keyword = input.value.toLowerCase().trim()

  if (!keyword) {
    suggestions.innerHTML = ''
    suggestions.hidden = true
    currentIndex = -1
    return
  }

  // 입력값을 포함하는 나라 이름 필터링
  const filtered = COUNTRIES.filter(({ name }) =>
    name.toLowerCase().includes(keyword)
  )

  if (filtered.length === 0) {
    suggestions.innerHTML = ''
    suggestions.hidden = true
    currentIndex = -1
    return
  }

  // 필터링된 나라 목록을 <li>로 출력
  suggestions.innerHTML = filtered
    .map(({ name }) => `<li>${name}</li>`)
    .join('')

  suggestions.hidden = false
  currentIndex = -1
})

// 키보드 ↑↓ 방향키 및 Enter 처리
input.addEventListener('keydown', (e) => {
  const items = suggestions.querySelectorAll('li')
  if (suggestions.hidden || items.length === 0) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    currentIndex = (currentIndex + 1) % items.length
    updateHighlight(items)
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    currentIndex = (currentIndex - 1 + items.length) % items.length
    updateHighlight(items)
  }

  if (e.key === 'Enter') {
    if (currentIndex >= 0 && items[currentIndex]) {
      e.preventDefault()
      selectItem(items[currentIndex])
    }
  }
})

// 마우스로 항목 클릭 시 선택
suggestions.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    selectItem(e.target)
  }
})

// 현재 선택된 항목에 클래스 부여 + 자동 스크롤
function updateHighlight(items) {
  items.forEach((item, index) => {
    const isActive = index === currentIndex
    item.classList.toggle('highlighted', isActive)

    // 선택된 항목은 자동으로 보이게 스크롤
    if (isActive) {
      item.scrollIntoView({ block: 'nearest' })
    }
  })
}

// 항목 선택 처리 함수
function selectItem(item) {
  input.value = item.textContent
  suggestions.innerHTML = ''
  suggestions.hidden = true
  currentIndex = -1
}
