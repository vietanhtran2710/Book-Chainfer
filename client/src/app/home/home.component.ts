import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { BookService } from '../services/book.service';
import { BlockchainService } from '../services/blockchain.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  bookModel: FormGroup
  authorizeModel: FormGroup
  file: File | undefined;
  userAddress = ''
  userBooks: Array<any> = [];
  toAddress: string = '';
  loaded = false;

  constructor(private authService: AuthService,
              private bookService: BookService,
              private blockchainService: BlockchainService,
              private fb: FormBuilder) {
    if (Object.keys(this.authService.currentUserValue).length === 0) {
      window.location.replace('')
    }
    else{
      let that = this;
      this.authService.verifyToken().pipe(catchError(err => {
        window.location.replace('')
        return throwError(err);
      })).subscribe((data: any) => {
        that.userAddress = data.address;
      })
    }
    this.bookModel = this.fb.group({
      name: '',
      author: '',
      file: '',
    })
    this.authorizeModel = this.fb.group({
      toAddress: '',
      tokenType: '',
      bookTitle: '',
      authorName: '',
      bookId: '',
    })
  }

  ngOnInit(): void {
    this.userAddress = this.authService.currentUserValue.address;
    this.bookService.getUserBook(this.userAddress).subscribe(
      (result: any) => {
        this.userBooks = result;
        console.log(this.userBooks);
        this.loaded = true;
      }
    )
  }

  fileChosen(event: any) {
    if (event.target.value) {
      this.file = <File>event.target.files[0];
    }
  }

  uploadBook() {
    var formData = new FormData();
    if (this.file) {
      formData.append('file', this.file, this.file.name);
      formData.append('name', this.bookModel.get('name')!.value);
      formData.append('author', this.bookModel.get('author')!.value);
      this.blockchainService.createBook(formData.get('name')!.toString(), this.authService.currentUserValue.address)
      .then((result: any) => {
        console.log(result);
        formData.append('id', result.events.Transfer.returnValues.tokenId);
        this.bookService.uploadBook(formData).subscribe(
          (result: any) => {
            if (result.message == "Success") {
              Swal.fire({
                icon: 'success',
                title: 'Done',
                text: 'Book created successfully'
              })
              .then(result => {
                location.reload();
              })
            }
          }
        )
      })
    }
  }

  authorizeToken() {
    let right;
    if (this.authorizeModel.get('tokenType')?.value == 'Publish') {
      right = 1;
    }
    else { right = 2; }
    this.blockchainService.authorizeToken(
      this.authorizeModel.get('toAddress')?.value,
      this.authorizeModel.get('bookId')?.value,
      right,
      this.userAddress
    ).then((result: any) => {
      if (result) {
        Swal.fire({
          icon: 'success',
          title: 'Done',
          text: `${this.authorizeModel.get('tokenType')?.value} token created successfully`
        })
      }
    })
  }

  updateModalInfo(type: number, bookInfo: any) {
    console.log(type, bookInfo)
    let right;
    if (type == 1) {
      right = 'Publish'
    }
    else { right = 'Read' }
    this.authorizeModel.setValue({
      tokenType: right, 
      bookTitle: bookInfo.name, 
      authorName: bookInfo.authorName, 
      toAddress: this.authorizeModel.get('toAddress')?.value,
      bookId: bookInfo.id
    })
  }
}
