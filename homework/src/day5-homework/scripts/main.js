// countries.js에서 COUNTRIES 데이터 가져오기
import { COUNTRIES } from './countries.js'

;(() => {
  
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

})

//피드백 내용
//코드 구조를 계속 리팩토링 하면서 이벤트 위임이나, 
// 자동 완성 리스트 항목이 많아질 경우 성능 최적화(debounce) 등도 고려해보세요. 
// 그리고 상태 변수 관리를 객체로 묶어보는 연습도 진행해보세요.

//1차 리펙토링 성능 최적화 및 상태 변수를 객체로 묶어보기. 
;(() => {


const input = document.getElementById('country')
const suggestions = document.getElementById('suggestions')

// ✅ 상태 관리 객체로 통합 (currentIndex, filteredList, items 접근자 포함)
const state = {
  currentIndex: -1,
  filteredList: [],
  get items() {
    return suggestions.querySelectorAll('li') // 동적으로 suggestions 내부 요소 접근
  },
  reset() {
    this.currentIndex = -1
    this.filteredList = []
  },
}

// ✅ 디바운스 적용 - 빠른 입력 시 이벤트 과잉 실행 방지
input.addEventListener('input', debounce(handleInput, 300))
input.addEventListener('keydown', handleKeyDown)

suggestions.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    selectItem(e.target)
  }
})

function handleInput() {
  const keyword = input.value.toLowerCase().trim()
  if (!keyword) return hideSuggestions()

  // ✅ 상태 객체에 필터링된 결과 저장
  state.filteredList = COUNTRIES.filter(({ name }) =>
    name.toLowerCase().includes(keyword)
  )

  if (state.filteredList.length === 0) return hideSuggestions()

  suggestions.innerHTML = state.filteredList
    .map(({ name }) => `<li>${name}</li>`)
    .join('')
  suggestions.hidden = false
  state.currentIndex = -1
}

function handleKeyDown(e) {
  const items = state.items
  if (suggestions.hidden || items.length === 0) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    // ✅ 상태 객체 사용한 인덱스 이동 처리
    state.currentIndex = (state.currentIndex + 1) % items.length
    updateHighlight(items)
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    state.currentIndex = (state.currentIndex - 1 + items.length) % items.length
    updateHighlight(items)
  }

  if (e.key === 'Enter') {
    e.preventDefault()
    if (state.currentIndex >= 0) {
      selectItem(items[state.currentIndex])
    }
  }
}

function updateHighlight(items) {
  items.forEach((item, index) => {
    item.classList.toggle('highlighted', index === state.currentIndex)
    if (index === state.currentIndex) {
      item.scrollIntoView({ block: 'nearest' })
    }
  })
}

function selectItem(item) {
  input.value = item.textContent
  hideSuggestions()
}

function hideSuggestions() {
  suggestions.innerHTML = ''
  suggestions.hidden = true
  state.reset() // ✅ 상태 객체의 reset() 사용
}

// ✅ debounce 함수 정의 (최적화용 유틸 함수)
// delay 시간 동안 이벤트 재진입을 막고, 마지막 호출만 실행되게 함
function debounce(callback, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => callback(...args), delay)
  }
}

})

//2차 리펙토링 개발자도구 콘솔에 변화하는 모습 띄우기. 
;(() => {

const input = document.getElementById('country')
  const suggestions = document.getElementById('suggestions')

  const state = {
    currentIndex: -1, // 현재 하이라이트된 항목의 인덱스
    filteredList: [], // 필터링된 결과 저장용
    get items() {
      return suggestions.querySelectorAll('li') // 동적으로 리스트 항목 접근
    },
    reset() {
      this.currentIndex = -1
      this.filteredList = []
      console.log('🔄 state 초기화됨:', this)
    },
  }

  // 피드백 반영 ② 디바운스 적용 (입력 시 과도한 렌더링 방지)
  // - 사용자가 입력할 때마다 실행되는 함수 호출을 지연
  input.addEventListener('input', debounce(handleInput, 300))

  // 키보드 방향키 및 Enter 처리를 위한 이벤트
  input.addEventListener('keydown', handleKeyDown)

  // 피드백 반영 ③ 이벤트 위임 (li 요소에 직접 리스너 달지 않음)
  suggestions.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      selectItem(e.target)
    }
  })

  // 입력에 따라 자동완성 결과 필터링 및 출력
  function handleInput() {
    const keyword = input.value.toLowerCase().trim()
    console.log('⌨️ 입력값:', keyword)

    if (!keyword) return hideSuggestions()

    // 입력값 포함하는 국가 이름 필터링
    state.filteredList = COUNTRIES.filter(({ name }) =>
      name.toLowerCase().includes(keyword)
    )

    console.log('🔍 필터링된 결과:', state.filteredList)

    if (state.filteredList.length === 0) return hideSuggestions()

    // 결과 렌더링
    suggestions.innerHTML = state.filteredList
      .map(({ name }) => `<li>${name}</li>`)
      .join('')
    suggestions.hidden = false
    state.currentIndex = -1
  }

  // 키보드 ↑↓ 엔터 처리
  function handleKeyDown(e) {
    const items = state.items
    if (suggestions.hidden || items.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      state.currentIndex = (state.currentIndex + 1) % items.length
      console.log('⬇️ 현재 인덱스:', state.currentIndex)
      updateHighlight(items)
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      state.currentIndex = (state.currentIndex - 1 + items.length) % items.length
      console.log('⬆️ 현재 인덱스:', state.currentIndex)
      updateHighlight(items)
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      if (state.currentIndex >= 0) {
        console.log('⏎ Enter로 선택된 항목:', items[state.currentIndex].textContent)
        selectItem(items[state.currentIndex])
      }
    }
  }

  // 현재 인덱스에 해당하는 항목 강조 + 스크롤
  function updateHighlight(items) {
    items.forEach((item, index) => {
      const isActive = index === state.currentIndex
      item.classList.toggle('highlighted', isActive)
      if (isActive) {
        console.log('✨ 강조된 항목:', item.textContent)
        item.scrollIntoView({ block: 'nearest' })
      }
    })
  }

  // 항목 선택 시 input에 값 설정 + 리스트 숨김
  function selectItem(item) {
    input.value = item.textContent
    console.log('✅ 선택됨:', item.textContent)
    hideSuggestions()
  }

  // 자동완성 리스트 숨기기 + 상태 초기화
  function hideSuggestions() {
    suggestions.innerHTML = ''
    suggestions.hidden = true
    state.reset()
  }

  // 디바운스 유틸 함수
  // - delay 시간 이후 마지막 호출만 실행됨
  function debounce(callback, delay = 300) {
    let timer
    return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        console.log('🕒 debounce 실행됨')
        callback(...args)
      }, delay)
    }
  }

})()