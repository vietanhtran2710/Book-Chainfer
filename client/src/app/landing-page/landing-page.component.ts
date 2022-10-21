import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
const Web3 = require('web3')

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router) {
      if (Object.keys(this.authService.currentUserValue).length !== 0) {
        let that = this;
        this.authService.verifyToken().pipe(catchError(err => {
          // window.location.replace('')
          return throwError(err);
        })).subscribe((data: any) => {
          this.router.navigate([`/home`])
        })
      }
  }

  ngOnInit(): void {
    
  }

  registerInfo = {
    address: "",
    fullName: "",
    email: ""
  }
  web3: any;
  loginMessage!: string;

  handleSignMessage = ({ publicAddress, nonce }: {publicAddress: string; nonce: string}) => {
    return new Promise((resolve, reject) =>
      this.web3.eth.personal.sign(
        `You are signing your one-time nonce to login: ${nonce}`,
        publicAddress,
        (err: any, signature: any) => {
          if (err) return reject(err);
          return resolve({ publicAddress, signature });
        }
      )
    );
  };

  async login() {
    if (!(window as any).ethereum) {
			window.alert('Please install MetaMask first.');
			return;
		}

		if (!this.web3) {
			try {
				await (window as any).ethereum.enable();

				this.web3 = new Web3((window as any).ethereum);
			} catch (error) {
				window.alert('You need to allow MetaMask.' + error);
				return;
			}
		}

		const coinbase = await this.web3.eth.getCoinbase();
    console.log(coinbase);
    let that = this;
    this.userService.getNonce(coinbase).subscribe((data: any) => {
      if (data == null) {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Không thể đăng nhập',
          text: "Địa chỉ ví chưa đăng ký",
          footer: '<a href>Need help?</a>',
          width: "400px",
        })
      }
      else {
        console.log((data as any).nonce);
        this.handleSignMessage({publicAddress: coinbase, nonce: (data as any).nonce})
        .then(function(data) {
          that.authService.authenticate(data).pipe(catchError(err => {
            that.loginMessage = err.error.message
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Không thể đăng nhập',
              text: that.loginMessage,
              footer: '<a href>Need help?</a>',
              width: "400px",
            })
            return throwError(err);
          })).subscribe((data: any) => {
            console.log((data as any).token)
            that.router.navigate([`/home`])
          })
        })
      }
    })
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
