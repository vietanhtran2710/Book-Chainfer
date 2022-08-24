import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  bookModel: FormGroup
  bookData: any

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
    
  }

  logOut() {
    this.authService.logout();
  }

  loadBook(file: any) {
    console.log(file)
    var reader = new FileReader();
    this.bookData = file[0]
    reader.readAsDataURL(file[0]); // read file as data url

    reader.onload = (event) => { // called once readAsDataURL is completed
      this.bookModel.patchValue({
        file: event.target!.result // thêm ảnh vào model để tạo FormData
      })
    }
  }

  uploadBook() {
    var formData = new FormData();
    formData.append('name', this.bookModel.get('name')!.value);
    formData.append('author', this.bookModel.get('author')!.value);
    formData.append('file', this.bookModel.get('file')!.value);
    formData.append('id', '1');
    // console.log(formData.get('name'))
    // console.log(formData.get('author'))
    // console.log(formData.get('file'))
    this.bookService.uploadForm(formData).subscribe(
      result => { console.log(result) }
    )
  }

}
