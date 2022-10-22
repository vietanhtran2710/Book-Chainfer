import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private http: HttpClient) { }

  createToken(data: any) {
    console.log(data.tokenId, data.bookId);
    return this.http.post(baseUrl, data)
  }

  getAll() {
    return this.http.get(`${baseUrl}/`)
  }

  delete(id: number) {
    return this.http.delete(`${baseUrl}/${id}`)
  }
}
