import Notiflix from 'notiflix';
import { fetchImages } from './searcher-api';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

fetchImages('sheep')
  .then(function (response) {
    return response;
  })
  .then(function (images) {
    return images.hits;
  })
  .catch(function (e) {
    console.log(e);
  });

formEl.addEventListener('submit', buttonClicked);

function createGallery(images) {
  if (images.length === 0) {
    failMessage();
    return;
  }
  totalMessage(1000);
  console.log(images);
  const cardsArray = createCards(images);
  galleryEl.append(...cardsArray);
}

function createCards(images) {
  const photoCards = [];
  images.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('photo-card');
    const imageEl = document.createElement('img');
    imageEl.src = image.webformatURL;
    imageEl.dataset.bigImg = image.largeImageURL;
    imageEl.alt = image.tags;
    card.append(imageEl);
    card.append(createCardsInfo(image));
    photoCards.push(card);
  });
  return photoCards;
}

function createCardsInfo(image) {
  const infoDiv = document.createElement('div');
  infoDiv.classList.add('info');
  const infoArray = ['likes', 'views', 'comments', 'downloads'];
  infoArray.forEach(info => {
    const infoEl = document.createElement('p');
    infoEl.classList.add('info-item');
    const textInfo = image[`${info}`];
    infoEl.insertAdjacentHTML('beforeend', `<b>${info}</b>${textInfo}`);
    infoDiv.append(infoEl);
  });
  return infoDiv;
}

function buttonClicked(event) {
  event.preventDefault();
  galleryEl.innerHTML = '';
  fetchImages(formEl.firstElementChild.value)
    .then(function (response) {
      return response;
    })
    .then(function (images) {
      createGallery(images.hits);
    })
    .catch(function (e) {
      console.log(e);
    });
}

function failMessage() {
  new Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function totalMessage(totalHits) {
  new Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}
