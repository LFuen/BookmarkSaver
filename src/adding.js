import $ from 'jquery';
import store from './store';
import api from './api';
import deleteIt from './images/delete.png';
import no from './images/no.png';
import checked from './images/yes.png';
import pen from './images/pen.png';
import rating from './images/rating.png';
import visit from './images/visit.png';
import plus from './images/plus.png';


/*
=====================================================================
TEMPLATES
=====================================================================
*/

function startUpPage(){
  return $('main').html(`    
  <h1>Save 'Em</h1>

  <section id="beginning" class="beginning"> 
    
    <h2 id="adding" class="initialAdd">ADD</h2>
    <section class="bookmarkNum">
      <select id="filter" class="bookmark-select" id="filter">
        <option value="" >RATING</option>
        <option value="5">5</option>
        <option value="4">4+</option>
        <option value="3">3+</option>
        <option value="2">2+</option>
        <option value="1" >1+</option>
      </select>
    </section>  
  </section>  
    <section id="formContainer" class="formContainer">
        
      </section>


      <section id="listContainer" class="listContainer">
          <section id="bookmarkList" class="listDisplay" tabindex="0">
            
            <section class="listItems" id="filler">
                
                  <p class="emptyMarks"><b>Nothing saved yet......</b></p>
  
              <section>

          </section>
      </section>`);
}


function generateForm(){
  return `<h2 class="newBm">New Bookmark</h2>
  <section id="formUp">
    <section id="listContainer" class="listContainer listDisplay">
      <section>
        <form class="addingNew">
          <fieldset class='deviceScaling'>
            <legend>New Bookmark</legend>
            <label for="siteName">Site Name:</label>
            <input id="siteName" class="newBox" type="text" name="site" placeholder="Name" required><br>

            <label for="siteURL">Site:</label>
            <input id="siteURL" class="newBox" type="url" name="siteURL" pattern="https://.*" required placeholder="https://"><br>

            <label for="description">Description:</label><br>
            <textarea name="description" class="newBox" id="description" cols="30" rows="10" placeholder="Site Description"></textarea><br><br>
            <section id="rating" class="rating">
              <label ><input type="radio" name="rating" id="str1" value="1" checked="checked" required><span for="str1" class="number">1</span></label>
              <label ><input type="radio" name="rating" id="str2" value="2" checked="checked"><span for="str2" class="number">2</span></label>
              <label ><input type="radio" name="rating" id="str3" value="3" checked="checked"><span for="str3" class="number">3</span></label>
              <label ><input type="radio" name="rating" id="str4" value="4" checked="checked"><span for="str4" class="number">4</span></label>
              <label ><input type="radio" name="rating" id="str5" value="5" checked="checked"><span for="str5" class="number">5</span></label>
            </section>
          </fieldset>
          
          <section class="linkRemove"> 
            <img src=${no} id="cancel" alt="cancel" />
            <input type="image" src=${plus} border="0" alt="Submit" id="addBookmark"></input>
          </section>
        </form>

  </section>`;
}


function addToList(){
  let list = store.store.bookmarks;
  for(let i = 0; i < list.length; i++){  
    $('#bookmarkList').append(`
    <section id="${list[i].id}" class="listItems" tabindex="0">
      <span class="nameTitle collapse" contenteditable="false"><b>${list[i].title}</b></span>
      <span class="stars" contenteditable="false"><img src=${rating} alt="rating" /><b>${list[i].rating}</b></span>
      <section class="moveRight">
        <img src=${pen} class="edit" alt="edit"/>
        <img src=${deleteIt} class="delButton" alt="delete"/>
        <input type="image" src=${checked} border="0" alt="Submit" class="hidden save" alt="save"></input>
      </section>
      <section class="editing">
        <p class="hidden description" contenteditable="false">${list[i].desc}<br>
        <a href=${list[i].url} target="_blank"><img src=${visit} alt="visit"/></a></p>
      </section>
    </section>`)};
}


/*
=====================================================================
EVENT LISTENERS
=====================================================================
*/

function newBookmarkEvent(){
  $('body').on('click', '#adding', function (){
    store.store.adding = true;
    $('.listContainer').toggleClass('hidden');
    $('.formContainer').toggleClass('hidden');
    $('#beginning').toggleClass('hidden');
    render();
  });
}

function bookmarkFormSubmit(){
  $('body').on('submit','.addingNew', function(event){
    event.preventDefault();
    $('#formContainer').toggleClass('hidden');
    api.saveBookmark()
    .then(function (){
      $('#beginning').toggleClass('hidden');
      store.store.adding = false;
      render()
    })
  });
}

function cancelForm() {
  $('body').on('click', '#cancel', function() {
    $('.listContainer').toggleClass('hidden');
    $('#formContainer').toggleClass('hidden');
    $('.beginning').show();
    store.store.adding = false;
    render();
  })
}

function deleteBookmark() {
  $('body').on('click', '.delButton', function(event) {
    let id = $(event.target).closest('.listItems').attr('id');
    api.deleteBookmarks(id)
    .then(function () {
      api.showBookmarks()
        .then(function () {
          render()
        })
    })
  })
}

function showDescription(){
  $('body').on('click', '.nameTitle', function (event) {
    let item = $(event.target).closest('.listItems').find('p');
    item.toggleClass('hidden');
  })
}

function editBookmark() {
  $('body').on('click', '.edit', function() {
    $(this).siblings('.save').show();
    $(this).parent().siblings('.nameTitle').attr('contenteditable', 'true').toggleClass('boxed');
    $(this).parent().siblings('.stars').attr('contenteditable', 'true').toggleClass('boxed');
    $(this).parent().siblings('.editing').find('.description').attr('contenteditable', 'true').toggleClass('boxed');

  })
}

function saveEditBookmark() {
  $('body').on('click', '.save', function() {
    $(this).hide();

    let name = $(this).parent().siblings('.nameTitle').toggleClass('boxed');
    let rating = $(this).parent().siblings('.stars').toggleClass('boxed');
    let description = $(this).parent().siblings('.editing').find('.description').toggleClass('boxed');
    let id = $(this).parents('.listItems').attr('id');

    name.attr('contenteditable', 'false');
    rating.attr('contenteditable', 'false');
    description.attr('contenteditable', 'false');

  api.editBookmarks(id, name.text(), rating.text(), description.text());
  })
}

function sortBy(){
  $('body').on('change', '.bookmark-select', function() {
    let rating = $(this).val();
    let sorted = store.store.bookmarks.filter( function (item) {
      return item.rating >= rating;
    })
    displaySorted(sorted);
  })
}

/*
=====================================================================
BOOKMARK DISPLAY
=====================================================================
*/

function displaySorted(store){
  let list = store;
  let html = '';
  for(let i = 0; i < list.length; i++){  
    html += `
    <section id="${list[i].id}" class="listItems">
      <span class="nameTitle collapse" contenteditable="false"><b>${list[i].title}</b></span>
      <span class="stars" contenteditable="false"><img src=${rating} alt="rating"/><b>${list[i].rating}</b></span>
      <section class="moveRight">
        <img src=${pen} class="edit" alt="edit"/>
        <img src=${deleteIt} class="delButton" alt="delete"/>
        <button class="hidden save">SAVE</button>
      </section>
      <section class="editing">
        <p class="hidden description" contenteditable="false">${list[i].desc}<br>
        <a href=${list[i].url} target="_blank"><img src=${visit} alt="visit"/></a></p>
      </section>
    </section>`};

    $('#bookmarkList').html(html);
}

function bookmarkList(){
  api.showBookmarks()
  .then(function () {
    render();
  })
  }

/*
=====================================================================
BOOKMARK RATINGS
=====================================================================
*/

function ratings(){
  $(".rating input:radio").attr("checked", false);
  $('.rating input').on('click', function () {
      $(".rating span").removeClass('checked');
      $(this).parent().addClass('checked');
  });
};

/*
=====================================================================
RENDER
=====================================================================
*/

function render(){

  if(store.store.adding) {
    $('#formContainer').html(generateForm());
    $('#formContainer').toggleClass('hidden');
  }
  else{
    startUpPage();
    addToList();
    $('#filter').prop('selectedIndex',0);
  }

  $('#listContainer').addClass('testing')

  if(store.store.bookmarks.length > 0) {
    $('.listContainer .emptyMarks').addClass('hidden')
  } 
  else {
    $('.listContainer .emptyMarks').removeClass('hidden')
  }
}

/*
=====================================================================
EVENT LISTENERS BINDING
=====================================================================
*/

function bindEventListeners(){ 
  newBookmarkEvent();
  bookmarkFormSubmit();
  deleteBookmark();
  ratings();
  showDescription();
  editBookmark();
  saveEditBookmark();
  sortBy();
  cancelForm();
}

/*
=====================================================================
EXPORT DEFAULT
=====================================================================
*/

export default { 
  generateForm, 
  bindEventListeners,
  bookmarkList,
  startUpPage
}