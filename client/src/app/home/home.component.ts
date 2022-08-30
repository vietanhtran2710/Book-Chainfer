import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  bookModel: FormGroup
  file: File | undefined;
  userAddress = ''

  constructor(private authService: AuthService,
              private bookService: BookService,
              private fb: FormBuilder) {
    if (Object.keys(this.authService.currentUserValue).length === 0) {
      window.location.replace('')
    }
    this.bookModel = this.fb.group({
      name: '',
      author: '',
      file: '',
    })
  }

  ngOnInit(): void {
    this.userAddress = this.authService.currentUserValue.address
  }

  logOut() {
    this.authService.logout();
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
      formData.append('id', '1');
      this.bookService.uploadBook(formData).subscribe(
        (result: any) => {
          if (result.message == "Success") {
            Swal.fire({
              icon: 'success',
              title: 'Done',
              text: 'Book created successfully'
            })
          }
        }
      )
    }
  }
}
