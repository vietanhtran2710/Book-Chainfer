import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  pdfSrc!: Uint8Array;

  constructor(private bookService: BookService,
              private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      let bookId = params.get('bookId')!;
      this.bookService.getBookFile(bookId).subscribe(
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
     })
  }

  ngOnInit(): void {
  }

}
