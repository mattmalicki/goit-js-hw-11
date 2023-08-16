import axios from 'axios';

const API_KEY = '38855458-8cac518777b782fa6e9540f58';
const DEFAULT_URL = 'https://pixabay.com/api/';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFESEARCH = 'true';
const PER_PAGE = '40';

export async function fetchImages(word, page) {
  try {
    const response = await axios.get(
      `${DEFAULT_URL}/?key=${API_KEY}&q=${word}&image-type=${IMAGE_TYPE}&orientation=${ORIENTATION}&safesearch=${SAFESEARCH}&page=${page}`
    );
    const obj = await response.data;
    return obj;
  } catch (e) {
    return e;
  }
}
