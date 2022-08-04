import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    
  }

  registerInfo = {
    address: "",
    fullName: "",
    email: ""
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
      registerPopup.style.visibility = "hidden";
    }
  }

  register() {
    console.log(this.registerInfo);
    this.userService.createAccount(this.registerInfo).subscribe(
      (result) => {
        if (result) {
          Swal.fire({
            icon: 'success',
            title: 'Done',
            text: 'Account registered successfully'
          })
        }
      }
    )
  }

  linkToMetamask(){
    window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn", "_blank");
  }
}
