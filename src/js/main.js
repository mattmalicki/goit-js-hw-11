import Notiflix from 'notiflix';
import { fetchImages } from './searcher-api';
import { scroll } from './scrolling';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import '../img/icons.svg';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const iconsPath = {
  likes: './images/icons.svg#icon-likes',
  views: './images/icons.svg#icon-eye',
  comments: './images/icons.svg#icon-comment',
  downloads: './images/icons.svg#icon-download',
};
const obj = {
  page: 1,
  totalHits: 0,
  formValue: '',
  galleryLength: 0,
};
const lightbox = new simpleLightbox('.gallery img', {
  sourceAttr: 'data-big-img',
});

const scrollMore = () => {
  scroll(loadMore);
};

const scrollEnd = () => {
  scroll(failMessage);
};

formEl.addEventListener('submit', event => {
  event.preventDefault();
  loader.classList.remove('is-hidden');
  obj.formValue = formEl.firstElementChild.value;
  obj.page = 1;
  submitForm(obj.formValue, obj.page);
});

// generating images

function createGallery(images) {
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
      `<svg width="30" height="30" class="icon"><use href="${icon}"></use></svg><p>${textInfo}</p>`
    );
    infoDiv.append(infoEl);
  });
  return infoDiv;
}

// button functions

function submitForm(value, page) {
  windowScrollEnd(true);
  clearGallery();
  fetchImages(value, page)
    .then(function (response) {
      if (response.totalHits === 0) {
        failMessage(true);
        throw new Error('No images!');
      }
      totalMessage(response.totalHits);
      obj.totalHits = response.totalHits;
      return response;
    })
    .then(function (images) {
      createGallery(images.hits);
      obj.page++;
      obj.galleryLength = galleryEl.childNodes.length;
      lightbox.refresh();
      windowScrollMore(false);
    })
    .catch(function (e) {
      console.log(e);
    })
    .finally(function () {
      toggleLoader();
    });
}

function loadMore() {
  toggleLoader();

  fetchImages(obj.formValue, obj.page)
    .then(function (response) {
      return response;
    })
    .then(function (images) {
      if (obj.totalHits === obj.galleryLength) {
        failMessage(false);
        windowScrollMore(true);
        windowScrollEnd(false);
        throw new Error('No more images!');
      }
      createGallery(images.hits);
      obj.galleryLength = galleryEl.childNodes.length;
      lightbox.refresh();
      obj.page++;
    })
    .catch(function (e) {
      console.log(e);
    })
    .finally(function () {
      toggleLoader();
    });
}

// Notiflix messages

function failMessage(needMore) {
  if (needMore) {
    new Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      {
        clickToClose: true,
        pauseOnHover: false,
      }
    );
  } else {
    new Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results.",
      {
        clickToClose: true,
        pauseOnHover: false,
      }
    );
  }
}

function totalMessage(totalHits) {
  new Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function toggleLoader() {
  loader.classList.toggle('is-hidden');
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function windowScrollEnd(remove) {
  if (!remove) {
    window.addEventListener('scroll', scrollEnd);
  } else {
    window.removeEventListener('scroll', scrollEnd);
  }
}

function windowScrollMore(remove) {
  if (!remove) {
    window.addEventListener('scroll', scrollMore);
    window.addEventListener('touchmove', scrollMore);
  } else {
    window.removeEventListener('scroll', scrollMore);
    window.removeEventListener('touchmove', scrollMore);
  }
}
