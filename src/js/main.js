import Notiflix from 'notiflix';
import { fetchImages } from './searcher-api';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadButton = document.querySelector('.load-more');
const iconsPath = {
  likes: './img/icons.svg#icon-likes',
  views: './img/icons.svg#icon-eye',
  comments: './img/icons.svg#icon-comment',
  downloads: './img/icons.svg#icon-download',
};
const obj = {
  page: 1,
  totalHits: 0,
  formValue: '',
};
const lightbox = new simpleLightbox('.gallery img', {
  sourceAttr: 'data-big-img',
});

formEl.addEventListener('submit', event => {
  loadButton.classList.add('is-hidden');
  obj.formValue = formEl.firstElementChild.value;
  event.preventDefault();
  page = 1;
  submitForm(obj.formValue, obj.page);
});

loadButton.addEventListener('click', () => {
  loadMore(obj.formValue, obj.page);
});

// generating images

function createGallery(images) {
  if (images.length === 0) {
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
    const icon = iconsPath[`${info}`];
    infoEl.insertAdjacentHTML(
      'beforeend',
      `<svg width="15" height="15" class="icon"><use href="${icon}"></use></svg><p>${textInfo}</p>`
    );
    infoDiv.append(infoEl);
  });
  return infoDiv;
}

// button functions

function submitForm(value, page) {
  galleryEl.innerHTML = '';
  fetchImages(value, page)
    .then(function (response) {
      response.totalHits === 0
        ? failMessage(false)
        : totalMessage(response.totalHits);
      obj.totalHits = response.totalHits;
      return response;
    })
    .then(function (images) {
      createGallery(images.hits);
      obj.page++;
      lightbox.refresh();
    })
    .catch(function (e) {
      console.log(e);
    });
}

function loadMore(value, page) {
  fetchImages(value, page)
    .then(function (response) {
      return response;
    })
    .then(function (images) {
      createGallery(images.hits);
      lightbox.refresh();
      page++;
      if (obj.totalHits === galleryEl.childNodes.length) {
        failMessage(true);
        loadButton.classList.add('is-hidden');
      }
    })
    .catch(function (e) {
      console.log(e);
    });
}

// Notiflix messages

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
  loadButton.classList.remove('is-hidden');
  new Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}
