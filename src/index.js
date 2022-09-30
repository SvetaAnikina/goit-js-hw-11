const axios = require('axios');
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImageServiceApi from './images-service';
import Notiflix from 'notiflix';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
};

const imageServiceApi = new ImageServiceApi();

refs.searchForm.addEventListener('submit', OnSearch);
refs.loadMoreButton.addEventListener('click', onClick);

function onClick() {

  imageServiceApi.pageIncrement();
  imageServiceApi.getImages().then(response => {
    if (imageServiceApi.totalHits >= response.data.totalHits) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      refs.loadMoreButton.style.opacity = 0;
    }
    addGalleryMarkUp(response.data.hits);
  });
}

function OnSearch(e) {
  
  
  e.preventDefault();
  if (e.currentTarget.elements.searchQuery.value.trim() === "") {
    Notify.warning("Please enter valid search request");
    return
  }
  imageServiceApi.query = e.currentTarget.elements.searchQuery.value;
  imageServiceApi.resetPage();
  resetMarkup();
  imageServiceApi.getImages().then(response => {
    if (response.data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (response.data.hits.length !== 0 && response.data.hits.length >= 40) {
      refs.loadMoreButton.style.opacity = 1;
    }
    if (response.data.hits.length !== 0) {
      Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
    }

    addGalleryMarkUp(response.data.hits);
  });
  refs.loadMoreButton.style.opacity = 0;
}

function addGalleryMarkUp(pictures) {
  let galleryMarkUp = pictures
    .map(picture => {
      return `<div class="photo-card">
  <a class="gallery-item" href ="${picture.largeImageURL}"><img src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${picture.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${picture.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${picture.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${picture.downloads}
    </p>
  </div>
</div>`;
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', galleryMarkUp);
  let gallery = new SimpleLightbox('.gallery a');
  gallery.refresh();
  if (imageServiceApi.page != 1) {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    gallery.refresh();
  }
}

function resetMarkup() {
  refs.gallery.innerHTML = '';
}
