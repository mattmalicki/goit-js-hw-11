import Notiflix from 'notiflix';
import { fetchImages } from './searcher-api';
import { scroll } from './scrolling';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const iconsPath = {
  likes:
    '<path d="M23.6 2c-3.36 0-6.26 2.74-7.6 5.6C14.66 4.73 11.76 2 8.4 2A8.4 8.4 0 0 0 0 10.4c0 9.43 9.52 11.9 16 21.23 6.13-9.27 16-12.1 16-21.23A8.4 8.4 0 0 0 23.6 2z"/>',
  views:
    '<path d="M16 6A17.92 17.92 0 0 0 0 16c2.97 5.94 9.02 10 16 10s13.03-4.06 16-10A17.92 17.92 0 0 0 16 6zm7.89 5.3c1.88 1.2 3.47 2.8 4.67 4.7-1.2 1.9-2.8 3.5-4.67 4.7a14.64 14.64 0 0 1-15.78 0A15.21 15.21 0 0 1 3.44 16a15.22 15.22 0 0 1 5.04-4.92A7.98 7.98 0 0 0 16 21.8a8 8 0 0 0 7.52-10.73l.37.22zM16 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>',
  comments:
    '<path d="M16 2c8.84 0 16 5.82 16 13s-7.16 13-16 13c-.85 0-1.68-.05-2.5-.16C10.07 31.28 5.97 31.9 2 32v-.85C4.14 30.1 6 28.18 6 26c0-.3-.02-.6-.07-.9C2.31 22.72 0 19.08 0 15 0 7.82 7.16 2 16 2z"/>',
  downloads: '<path d="m18 8-4-4H0v26h32V8H18zm-2 19-7-7h5v-8h4v8h5l-7 7z"/>',
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
  submitForm();
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
      `<svg viewBox="0 0 32 32" class="icon">${icon}</svg><p>${textInfo}</p>`
    );
    infoDiv.append(infoEl);
  });
  return infoDiv;
}

// button functions

async function submitForm() {
  try {
    windowScrollEnd(true); // remove scrollEnd from eventListener
    clearGallery();
    const images = await fetchImages(obj.formValue, obj.page);
    if (images.totalHits === 0) {
      failMessage(true); // no images
      throw new Error('No images!');
    }
    totalMessage(images.totalHits);
    obj.totalHits = images.totalHits;
    createGallery(images.hits);
    obj.page++;
    obj.galleryLength = galleryEl.childNodes.length;
    lightbox.refresh();
    windowScrollMore(false); // add scrollMore to eventListener
  } catch (e) {
    console.log(e);
  } finally {
    toggleLoader();
  }
}

async function loadMore() {
  try {
    toggleLoader();
    const images = await fetchImages(obj.formValue, obj.page);
    if (obj.totalHits === obj.galleryLength) {
      failMessage(false); // no more images to load
      windowScrollMore(true); // remove scrollMore from eventListner
      windowScrollEnd(false); // add scrollEnd to eventListener
      throw new Error('No more images!');
    }
    createGallery(images.hits);
    obj.galleryLength = galleryEl.childNodes.length;
    lightbox.refresh();
    obj.page++;
  } catch (e) {
    console.log(e);
  } finally {
    toggleLoader();
  }
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
    window.addEventListener('touchmove', scrollEnd);
  } else {
    window.removeEventListener('scroll', scrollEnd);
    window.removeEventListener('touchmove', scrollEnd);
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
