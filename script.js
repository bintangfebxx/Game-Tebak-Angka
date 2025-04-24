// inisialisasi variabel dahulu
const playButton = document.getElementById('playButton')
const beforePlay = document.getElementById('beforePlay')

const duringPlay = document.getElementById('duringPlay')
const jawabanUser = document.getElementById('jawabanUser')
const jawabanSalah = document.getElementById('jawabanSalah')
const answerButton1 = document.getElementById('answer-button1')
const answerButton2 = document.getElementById('answer-button2')
const answerButton3 = document.getElementById('answer-button3')

const infoSalah = document.getElementById('info-salah')

const afterPlay = document.getElementById('afterPlay')
const jawabanBenar = document.getElementById('jawabanBenar')

const totalBenar = document.getElementById('totalKombinasi')
const totalSalah = document.getElementById('totalSalah')
const clearData = document.getElementById('clearButton')

const jumlahSalah = document.getElementById('jumlahSalah')

// inisialisasi fungsi pembuatan kode
function getAnswer() {
  let answer = '123'.split('')
  for (let i = 0; i < answer.length; i++) {
    let j = Math.floor(Math.random() * (i + 1))
    let tmp = answer[i]
    answer[i] = answer[j]
    answer[j] = tmp
  }
  return answer.join('')
}

// inisialisasi key local storage
const victoryKey = 'Total_Victory'
const maxLostKey = 'Total_Lost'

// inisialisasi key session storage
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// key untuk kunci jawaban yang digenerate getAnswer
const sessionAnswerKey = 'SESSION_ANSWER'; 
// key untuk jumlah salah per sesi
const sessionUserAttemptsKey = 'SESSION_USER_ATTEMPTS';

// ketika browser load, tanyakan apakah browser bisa web storage
window.addEventListener('load', function() {
  if (typeof(Storage) !== 'undefinied') {
    if (localStorage.getItem(victoryKey) === null) {
      localStorage.setItem(victoryKey, 0)
    }
    if (localStorage.getItem(maxLostKey) === null) {
      localStorage.setItem(maxLostKey, 0)
    }
    if (sessionStorage.getItem(sessionAnswerKey) === null) {
      sessionStorage.setItem(sessionAnswerKey, '')
    }
    if (sessionStorage.getItem(sessionUserAttemptsKey) === null) {
      sessionStorage.setItem(sessionUserAttemptsKey, 0)
    }
    if (sessionStorage.getItem(sessionUserIsPlayingKey) === null) {
      sessionStorage.setItem(sessionUserIsPlayingKey, false)
    }
  } else {
    alert('Browser yang anda gunakan tidak mendukung Web Storage')
  }
})

// tampilkan nilai default(0) dari storage
totalBenar.innerText = localStorage.getItem(victoryKey)
totalSalah.innerText = localStorage.getItem(maxLostKey)
jumlahSalah.innerText = sessionStorage.getItem(sessionUserAttemptsKey)

// event buttonPlay diklik
playButton.addEventListener('click', function() {
  sessionStorage.setItem(sessionAnswerKey, getAnswer())
  beforePlay.setAttribute('hidden', true)
  duringPlay.removeAttribute('hidden')
})

// event pada answerButton 
answerButton1.addEventListener('click', function() {
  jawabanUser.innerText += '1'
  if (jawabanUser.innerText.length == 3) {
    checkAnswer(jawabanUser.innerText)
  }
})
answerButton2.addEventListener('click', function() {
  jawabanUser.innerText += '2'
  if (jawabanUser.innerText.length == 3) {
    checkAnswer(jawabanUser.innerText)
  }
})
answerButton3.addEventListener('click', function() {
  jawabanUser.innerText += '3'
  if (jawabanUser.innerText.length == 3) {
    checkAnswer(jawabanUser.innerText)
  }
})

// inisialisasi checkAnswer function
function checkAnswer(userGuess) {
  const answer = sessionStorage.getItem(sessionAnswerKey)

  if (userGuess == answer) {
    duringPlay.setAttribute('hidden', true)
    afterPlay.removeAttribute('hidden')
    jawabanBenar.innerText = answer

    updateScore()

  } else {
    // use parseInt because data we take from storage will be string
    const previousAttemptAmount = parseInt(sessionStorage.getItem(sessionUserAttemptsKey))
    // set ulang jadi + 1
    sessionStorage.setItem(sessionUserAttemptsKey, previousAttemptAmount + 1)
    jumlahSalah.innerText = sessionStorage.getItem(sessionUserAttemptsKey)
    jawabanUser.innerText = ''
    jawabanSalah.innerText = userGuess

    infoSalah.removeAttribute('hidden', true)
  }
}

function updateScore() {
  // ambil dan convert dulu value yang akan digunakan
  const sessionJumlahSalah = sessionStorage.getItem(sessionUserAttemptsKey)
  const localTotalSalah = localStorage.getItem(maxLostKey)

  if (sessionJumlahSalah > localTotalSalah) {
    localStorage.setItem(maxLostKey, sessionJumlahSalah)
    totalSalah.innerText = localStorage.getItem(maxLostKey)
  }

  // inisialisasi dulu
  const localTotalWin = parseInt(localStorage.getItem(victoryKey))
  // di set untuk local storagenya
  localStorage.setItem(victoryKey, localTotalWin + 1)
  // tampilkan ke layar
  totalBenar.innerText = localStorage.getItem(victoryKey)

  // kalo jawaban benar, status sesi game akan reset ke 0, tanpa nunggu re-open browser
  sessionStorage.setItem(sessionUserAttemptsKey, 0)
  jumlahSalah.innerText = sessionStorage.getItem(sessionUserAttemptsKey)
  
}

// bersihin game session status right before reload or close tab
window.addEventListener('beforeunload', function() {
  sessionStorage.setItem(sessionUserAttemptsKey, 0)
  jumlahSalah.innerText = sessionStorage.getItem(sessionUserAttemptsKey)
})

clearData.addEventListener('click', function() {
  localStorage.removeItem(victoryKey)
  localStorage.removeItem(maxLostKey)
  alert('MOHON REFRESH HALAMAN INI!')
})