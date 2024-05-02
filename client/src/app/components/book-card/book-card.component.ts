import { Component, EventEmitter } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  MatDialog
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule,MatButtonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {
  books:any
  dropdownStates: boolean[] = [];
  bookidmap: { [key: number]: string } = {}// for future search option
  totalItems: number = 0;
  numberofbooks:string ='';
  p:number = 1
  bookid:string=''
  bookName: string = '';
  bookAuthor: string = '';
  bookImage: string = '';
  bookPages: number = 0;
  bookPrice: number = 0;
  upadteform :FormGroup;
  submitted = false;
  currentPage: number = 1;

  constructor(private booksService: BooksService,public dialog: MatDialog,private toastr: ToastrService,private fb: FormBuilder){
    this.upadteform = fb.group({
      name:['', [Validators.required]],
      author:['', [Validators.required]],
      image:['', [Validators.required]],
      pages:['', [Validators.required]],
      price:['', [Validators.required]]
    })
  }

  ngOnInit(){
    this.loadBooks(this.currentPage)
  }
  get f(): { [key: string]: AbstractControl } {
    return this.upadteform.controls;
  }

  loadBooks(pgnumber :number,pageSize = 12){
    this.booksService.getAllBooks(pgnumber, pageSize).subscribe((res) => {
      console.log(res);
      this.books = res.data;
      this.totalItems = res.total;
      // this.books.sort((a: any, b: any) => {
      //   return b._id.localeCompare(a._id); })
      this.numberofbooks = this.books.length.toString()
      console.log(this.books);
      this.books.forEach((book: any, index: number) => {
        this.bookidmap[index] = book._id;
         
      });
      console.log(this.bookidmap);
      localStorage.setItem('numberofbooks',this.numberofbooks)
    })
    
  }
 
  


  saveid(id:string){
    this.bookid = id
    console.log(this.bookid)
    this.booksService.getBookById(this.bookid).subscribe((res) => {
      const book = res.data;

      this.upadteform.setValue({
        name: book.name,
        author:book.author,
        image:book.image,
        pages: book.pages,
        price:book.price
      })
    })
  }

  
 
  
  
  update(){
    this.submitted = true

    if (this.upadteform.invalid) {
      this.toastr.error('Invalid data.', 'Error');
      return;
    }
    const bookval = this.upadteform.value
    const book={
      name: bookval.name,
      author: bookval.author,
      image: bookval.image,
      pages: bookval.pages,
      price: bookval.price
    }
    console.log(book);
    this.booksService.updateBook(book,this.bookid).subscribe((res)=>{
      console.log(res)
      this.toastr.success('Successfully updated book','Success')
      this.bookid = ''
      this.loadBooks(this.currentPage)
    },(error)=>{
      this.toastr.error('Failed to update the book.', 'Error')
    })
    this.closeModal()
    
  }
  delete(){
    console.log(this.bookid);
    this.booksService.deleteBook(this.bookid).subscribe((res)=>{
      console.log(res);
      
    })
    this.bookid = ''
    this.loadBooks(this.currentPage)
    
  }
  toggleDropdown(index: number): void {
    this.dropdownStates[index] = !this.dropdownStates[index];
  }

closeModal(){
  const modal = document.getElementById('updateBookModal');
    if (modal) {
      const modalCloseButton = modal.querySelector('[data-bs-dismiss="modal"]');
      if (modalCloseButton) {
        modalCloseButton.dispatchEvent(new Event('click'));
      } else {
        console.warn('Close button not found. Cannot close modal programmatically.');
      }
    } else {
      console.warn('Modal element not found. Cannot close modal programmatically.');
    }
  }
}
  

