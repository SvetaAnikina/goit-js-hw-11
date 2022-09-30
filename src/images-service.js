const axios = require('axios');
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '29310891-e344a11b8695986423724ef53';

export default class ImageServiceApi {
  constructor() {
    this.searchQuery = ' ';
    this.page = 1;
    this.totalHits = 0;
  }
  async getImages() {
    try {
      const params = {
        key: API_KEY,
        q: this.searchQuery,
        page: this.page,
        per_page: 40,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      };
      const response = await axios.get(BASE_URL, { params });
      this.totalHits += 40;
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  pageIncrement() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
