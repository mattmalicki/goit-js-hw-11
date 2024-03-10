import axios from 'axios';
import 'dotenv/config';

const API_KEY = process.env.API_KEY;
const DEFAULT_URL = process.env.DEFAULT_URL;
const IMAGE_TYPE = process.env.IMAGE_TYPE;
const ORIENTATION = process.env.ORIENTATION;
const SAFESEARCH = process.env.SAFESEARCH;
const PER_PAGE = process.env.PER_PAGE;

export async function fetchImages(q, page) {
  try {
    const response = await axios.get(
      `${DEFAULT_URL}/?key=${API_KEY}&q=${q}&image-type=${IMAGE_TYPE}&orientation=${ORIENTATION}&safesearch=${SAFESEARCH}&page=${page}&per_page=${PER_PAGE}`
    );
    const obj = await response.data;
    return obj;
  } catch (e) {
    return e;
  }
}
