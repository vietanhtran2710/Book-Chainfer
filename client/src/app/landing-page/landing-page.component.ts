import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    //get button HTML elements
    const loginBtn = document.getElementById("login-btn");
    const closeBtn = document.getElementById("close-btn");
  }

  //when login button on navbar is clicked
  loginPopupOnClick() {
    const loginPopup = document.getElementById("login-popup");
    const overlay = document.getElementById("black");
    if (loginPopup != null && overlay!=null){
      overlay.style.visibility = "visible";
      loginPopup.style.visibility = "visible";
    }
  }

  closePopup() {
    const loginPopup = document.getElementById("login-popup");
    const overlay = document.getElementById("black");
    if (loginPopup != null && overlay!=null){
      overlay.style.visibility = "hidden";
      loginPopup.style.visibility = "hidden";
    }
  }
}
