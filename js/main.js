import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.esm.browser.min.js'

const openTrashBtn = document.querySelector('[data-modal-open]')
const closeTrashBtn = document.querySelector('[data-modal-close]')
const trashModal = document.querySelector('[data-modal]')
const trashCancleBtn = document.querySelector('[cancle-btn]')
const trashModalList = document.querySelector('.modal__body')
const trashModalTotalPrice = document.querySelector('.pricetag')

const loginButton = document.querySelector('.header__login_bnt')
const logoutButton = document.querySelector('.header__out_bnt')
const userName = document.querySelector('.user-name')
const closeModalBtn = document.querySelector('[login-modal-close]')
const modal = document.querySelector('[login-data-modal]')
const loginForm = document.querySelector('.login-form')

const promoContainer = document.querySelector('.swiper-container')
const restaurants = document.querySelector('.restaurants')
const cardsRestaurants = document.querySelector('.cards__list')
const menu = document.querySelector('.menu')
const menuCards = document.querySelector('.menu-cards-list')
const menuHeader = document.querySelector('.restaurant__heading')
const logo = document.querySelectorAll('.logo')

const searchInput = document.querySelector('.restaurants__input')

openTrashBtn.addEventListener('click', toggleTrashModal)
closeTrashBtn.addEventListener('click', toggleTrashModal)
window.addEventListener('keydown', closeTrashModalByEsc)
trashCancleBtn.addEventListener('click', clearTrashMenu)
trashModal.addEventListener('click', onTrashModalClick)
loginButton.addEventListener('click', toggleModal)
closeModalBtn.addEventListener('click', toggleModal)
window.addEventListener('keydown', closeModalByEsc)
loginForm.addEventListener('submit', onFormSubmit)
modal.addEventListener('click', onModalClick)
logoutButton.addEventListener('click', onLogoutButtonClick)
cardsRestaurants.addEventListener('click', openGoods)
searchInput.addEventListener('keypress', searchDish)
menuCards.addEventListener('click', addToTrash)
trashModalList.addEventListener('click', chageCount)

logo.forEach((logo) => {
  logo.addEventListener('click', onLogoClick)
})

let login = localStorage.getItem('login')
let password = ''
let priceAtAll = null

let trash = []
if (JSON.parse(localStorage.getItem('cart'))) {
  trash = JSON.parse(localStorage.getItem('cart'))
  countTotalPrice(trash)
  trash.forEach(createrTrashRow)
}

menu.style.display = 'none'
openTrashBtn.style.display = 'none'

const getData = async function (url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`)
  }
  const data = await response.json()
  return data
}

getData('./db/partners.json')
  .then((data) => {
    data.forEach((card) => {
      creatRestaurantCard(card)
    })
  })
  .catch((error) => {
    console.log(error)
  })

function onTrashModalClick(event) {
  if (event.target.classList.contains('backdrop')) {
    event.target.classList.add('is-hidden')
    enableScroll()
  }
}

function closeTrashModalByEsc(event) {
  if (event.code === 'Escape') {
    trashModal.classList.add('is-hidden')
    enableScroll()
  }
}

function toggleTrashModal() {
  if (!JSON.parse(localStorage.getItem('cart'))) {
    trashModalTotalPrice.textContent = '0 ₽'
    trashModalList.innerHTML = ''
  }
  trashModal.classList.toggle('is-hidden')
  if (trashModal.classList.contains('is-hidden')) {
    enableScroll()
  } else {
    disableScroll()
  }
}

function checkAuth() {
  if (login) {
    autorized()
  } else {
    notAutorized()
  }
}

function autorized() {
  console.log('Авторизован')

  loginButton.style.display = 'none'
  logoutButton.style.display = 'flex'
  openTrashBtn.style.display = ''
  userName.textContent = login
}

function notAutorized() {
  console.log('Не авторизован')
}

function onFormSubmit(event) {
  event.preventDefault()

  login = event.target.elements.email.value.trim()
  password = event.target.elements.password.value.trim()

  event.target.elements.email.style.borderColor = ''
  event.target.elements.password.style.borderColor = ''
  if (login === '') {
    event.target.elements.email.value = ''
    event.target.elements.email.style.borderColor = 'red'
    return
  }
  if (password === '') {
    event.target.elements.password.value = ''
    event.target.elements.password.style.borderColor = 'red'
    return
  }

  localStorage.setItem('login', login)
  event.target.reset()
  toggleModal()
  checkAuth()
}

function onLogoutButtonClick() {
  login = ''
  localStorage.removeItem('login')
  checkAuth()

  loginButton.style.display = 'flex'
  logoutButton.style.display = 'none'
  openTrashBtn.style.display = 'none'
  userName.textContent = ''

  promoContainer.style.display = ''
  restaurants.style.display = ''
  menu.style.display = 'none'

  localStorage.removeItem('cart')
  trash = []
}

function onModalClick(event) {
  if (event.target.classList.contains('backdrop')) {
    event.target.classList.add('is-hidden')
    enableScroll()
  }
}

function closeModalByEsc(event) {
  if (event.code === 'Escape') {
    modal.classList.add('is-hidden')
  }
  enableScroll()
}

function toggleModal() {
  loginForm.elements.email.style.borderColor = ''
  loginForm.elements.password.style.borderColor = ''

  modal.classList.toggle('is-hidden')
  if (modal.classList.contains('is-hidden')) {
    enableScroll()
  } else {
    disableScroll()
  }
}

function creatRestaurantCard(restaurant) {
  const {
    image,
    kitchen,
    name,
    price,
    stars,
    products,
    time_of_delivery: timeOfDelivery,
  } = restaurant
  const card = `
     <li class="cards__item" data-products="${products}">
              <a class="cards__link link">
                <img src="${image}" alt="${name}" class="cards__image" />
                <div class="cards__text">
                  <div class="cards__heading">
                    <h3 class="cards__title">${name}</h3>
                    <div class="cards__time">${timeOfDelivery} мин</div>
                  </div>
                </div>
                <div class="cards__info">
                  <p class="cards__rating">
                    <img class="cards__rating_star" src="./img/icon/rating.svg" alt="star" /> ${stars}
                  </p>
                  <p class="cards__price">От ${price} ₽</p>
                  <p class="cards__product">${kitchen}</p>
                </div>
              </a>
            </li>
    `

  cardsRestaurants.insertAdjacentHTML('beforeend', card)
}

function createMenuCard(menuCard) {
  const { name, description, price, image, id } = menuCard
  const card = `
        <li class="cards__item menu-item">
                <img src="${image}" alt="${name}" class="cards__image" />
                <div class="cards__text">
                  <div class="cards__heading_rest">
                    <h3 class="cards__title cards__title_reg">${name}</h3>
                    <p class="cards__descr">
                     ${description}
                    </p>
                  </div>
                </div>
                <div class="cards__info">
                  <button type="button" class="cards__btn" id="${id}">
                    В корзину &nbsp<img src="./img/icon/shopping-cart-white.svg" alt="cart" />
                  </button>
                  <p class="cards__price_rest">${price} ₽</p>
                </div>
              </li>
    `

  menuCards.insertAdjacentHTML('beforeend', card)
}

function createMenuHead(menuHead) {
  const { kitchen, name, price, stars } = menuHead
  const head = `
  <h2>${name}</h2>
            <div class="restourant_cards__info">
              <p class="cards__rating">
                <img class="cards__rating_star" src="./img/icon/rating.svg" alt="star" /> ${stars}
              </p>
              <p class="cards__price">От ${price} ₽</p>
              <p class="cards__product">${kitchen}</p>
            </div>
  `
  menuHeader.insertAdjacentHTML('afterbegin', head)
}

function createrTrashRow(item) {
  const { title, price, count, id } = item
  const totalPrice = parseInt(price) * count

  trashModalTotalPrice.textContent = `${priceAtAll} ₽`

  const row = `
       <div class="food-row">
            <span class="food-name">${title}</span>
            <strong class="food-price">${totalPrice} ₽</strong>
            <div class="food-counter">
              <button type="button" class="counter-button decrement" data-id="${id}">-</button>
              <span class="counter">${count}</span>
              <button type="button" class="counter-button increment" data-id="${id}">+</button>
            </div>
          </div>
    `

  trashModalList.insertAdjacentHTML('afterbegin', row)
}

function openGoods(event) {
  const restaurantList = event.target.classList.contains('cards__list')
  const restaurantCard = event.target.closest('.cards__item')
  console.log(restaurantCard)

  if (!restaurantList) {
    if (!login) {
      toggleModal()
      return
    }
    menuHeader.innerHTML = ''
    menuCards.innerHTML = ''

    promoContainer.style.display = 'none'
    restaurants.style.display = 'none'
    menu.style.display = ''

    getData('./db/partners.json')
      .then((data) => {
        data.forEach((card) => {
          if (card.products === restaurantCard.dataset.products) {
            createMenuHead(card)
          }
        })
      })
      .catch((error) => {
        console.log(error)
      })

    getData(`./db/${restaurantCard.dataset.products}`)
      .then((data) => {
        data.forEach((card) => {
          createMenuCard(card)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

function onLogoClick() {
  promoContainer.style.display = ''
  restaurants.style.display = ''
  menu.style.display = 'none'
}

function searchDish(event) {
  if (event.charCode === 13) {
    if (event.target.value.trim() === '') {
      event.target.value = ''
      return
    }
    const value = event.target.value.trim()
    getData('./db/partners.json')
      .then((data) => {
        return data.map((restaurant) => {
          return restaurant.products
        })
      })
      .then((linkProducts) => {
        menuCards.innerHTML = ''

        linkProducts.forEach((link) => {
          getData(`./db/${link}`).then((data) => {
            const resultSearch = data.filter((item) => {
              const name = item.name.toLowerCase()
              return name.includes(value.toLowerCase())
            })

            menuHeader.innerHTML = ''
            promoContainer.style.display = 'none'
            restaurants.style.display = 'none'
            menu.style.display = ''
            event.target.value = ''

            resultSearch.forEach(createMenuCard)
          })
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

function addToTrash(event) {
  if (event.target.classList.contains('cards__btn')) {
    trashModalList.innerHTML = ''

    const card = event.target.closest('.cards__item')
    const title = card.querySelector('.cards__title').textContent
    const price = card.querySelector('.cards__price_rest').textContent
    const id = event.target.id
    const food = trash.find((item) => item.id === id)
    if (food) {
      food.count += 1
      localStorage.setItem('cart', JSON.stringify(trash))
    } else {
      trash.push({ title, price, id, count: 1 })
      localStorage.setItem('cart', JSON.stringify(trash))
    }
    const cart = JSON.parse(localStorage.getItem('cart'))
    countTotalPrice(cart)
    cart.forEach(createrTrashRow)
  }
}

function chageCount(event) {
  const target = event.target

  if (target.classList.contains('counter-button')) {
    const food = trash.find((item) => item.id === target.dataset.id)

    if (target.classList.contains('decrement')) {
      food.count -= 1
      if (food.count === 0) {
        trash.splice(trash.indexOf(food), 1)
      }
    }
    if (target.classList.contains('increment')) food.count += 1

    if (trash.length === 0) {
      trashModalTotalPrice.textContent = '0 ₽'
    }
    trashModalList.innerHTML = ''
    localStorage.setItem('cart', JSON.stringify(trash))
    const cart = JSON.parse(localStorage.getItem('cart'))
    countTotalPrice(cart)
    cart.forEach(createrTrashRow)
  }
}

function countTotalPrice(cart) {
  priceAtAll = null
  cart.forEach((item) => {
    priceAtAll += parseInt(item.price) * item.count
  })
}

function clearTrashMenu() {
  trash.length = 0
  localStorage.removeItem('cart')
  trashModalTotalPrice.textContent = '0 ₽'
  trashModalList.innerHTML = ''
}

checkAuth()

// Swiper
new Swiper('.swiper-container', {
  sliderPerView: 1,
  loop: true,
  autoplay: true,
  effect: 'cube',
  grabCursor: true,
  cubeEffect: {
    shadow: false,
  },
})
