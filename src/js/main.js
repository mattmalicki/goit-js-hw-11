import Notiflix from 'notiflix';
import { fetchImages } from './searcher-api';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadButton = document.querySelector('.load-more');
let page = 1;
let totalHits = 0;

formEl.addEventListener('submit', event => {
  loadButton.classList.add('is-hidden');
  event.preventDefault();
  page = 1;
  submitForm();
  loadButton.classList.remove('is-hidden');
});

loadButton.addEventListener('click', () => {
  fetchImages(formEl.firstElementChild.value, page)
    .then(function (response) {
      return response;
    })
    .then(function (images) {
      createGallery(images.hits);
      createSimpleLightbox();
      page++;
      if (totalHits === galleryEl.childNodes.length) {
        failMessage(true);
        loadButton.classList.add('is-hidden');
      }
    })
    .catch(function (e) {
      console.log(e);
    });
});

function createGallery(images) {
  if (images.length === 0) {
    failMessage(false);
    return;
  }
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

function submitForm() {
  galleryEl.innerHTML = '';
  fetchImages(formEl.firstElementChild.value, page)
    .then(function (response) {
      totalMessage(response.totalHits);
      totalHits = response.totalHits;
      return response;
    })
    .then(function (images) {
      createGallery(images.hits);
      page++;
      createSimpleLightbox();
    })
    .catch(function (e) {
      console.log(e);
    });
}

function failMessage(loadAll) {
  if (loadAll) {
    new Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    new Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function totalMessage(totalHits) {
  new Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function createSimpleLightbox() {
  const lightbox = new simpleLightbox('.gallery img', {
    sourceAttr: 'data-big-img',
  });
}
