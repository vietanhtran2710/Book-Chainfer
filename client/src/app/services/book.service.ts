import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  uploadBook(form: FormData) {
    return this.http.post(baseUrl, form)
  }

  getUserBook(user: string) {
    return this.http.get(`${baseUrl}/user/${user}`)
  }

  getBookFile(bookId: string) {
    return this.http.get(`${baseUrl}/download/${bookId}`, {responseType:`blob`})
  }

  getOneBook(bookId: string) {
    return this.http.get(`${baseUrl}/single/${bookId}`)
  }
}
