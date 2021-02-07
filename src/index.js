import $ from 'jquery';
import './main.css';
import adding from './adding';


function main(){
   adding.bindEventListeners();
   adding.bookmarkList();
}

$(main);