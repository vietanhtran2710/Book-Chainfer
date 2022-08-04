import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
  }

  //when login button on navbar is clicked
  loginPopupOnClick() {
    const loginPopup = document.getElementById("login-popup");
    const overlay = document.getElementById("black-bg");
    const registerPopup = document.getElementById("register-popup");
    if (loginPopup != null && overlay!=null && registerPopup!=null){
      overlay.style.visibility = "visible";
      //loginPopup.style.visibility = "visible";
      registerPopup.style.visibility = "visible";
    }
  }

  closePopup() {
    const loginPopup = document.getElementById("login-popup");
    const overlay = document.getElementById("black-bg");
    const registerPopup = document.getElementById("register-popup");
    if (loginPopup != null && overlay!=null && registerPopup!=null){
      overlay.style.visibility = "hidden";
      //loginPopup.style.visibility = "hidden";
      registerPopup.style.visibility = "hidden";
    }
  }



  linkToMetamask(){
    window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn", "_blank");
  }
}
