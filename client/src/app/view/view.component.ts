import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  pdfSrc!: Uint8Array;

  constructor(private bookService: BookService) { 
    this.bookService.getBookFile("").subscribe(
      (retFileData: any) => {
        let tempBlob = new Blob([retFileData]);
        const fileReader = new FileReader();
        fileReader.onload = () => {
            this.pdfSrc = new Uint8Array(fileReader.result as ArrayBuffer);
        };
        fileReader.readAsArrayBuffer(tempBlob);                                    
      },
      (err: Error) => {
          
      }
    )
  }

  ngOnInit(): void {
  }

}
