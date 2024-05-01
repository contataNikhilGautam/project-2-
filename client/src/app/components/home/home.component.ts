import { Component, EventEmitter, HostListener, ViewChild, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal'
import { NgxPaginationModule } from 'ngx-pagination';
import { BooksService } from '../../services/books.service';
import { BooksPageComponent } from '../books-page/books-page.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookCardComponent } from '../book-card/book-card.component';
import { ToastrService } from 'ngx-toastr';
import { NgxLoadingModule } from 'ngx-loading';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule,BooksPageComponent,RouterLink,RouterModule,FormsModule,ReactiveFormsModule,NgxLoadingModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  user:any
  bookName: string = '';
  bookAuthor: string = '';
  bookImage: string = '';
  bookPages: number = 0;
  bookPrice: number = 0;
  createform:FormGroup
  submitted=false
  public loading = false;
  
  constructor(private authService: AuthService,private bookservice:BooksService,private toastr: ToastrService,private fb: FormBuilder,private router:Router){
    this.createform = fb.group({
      name:['', [Validators.required]],
      author:['', [Validators.required]],
      image:['', [Validators.required]],
      pages:['', [Validators.required]],
      price:['', [Validators.required]]
    })
  }
  
  ngOnInit(){

    this.authService.getName().subscribe((res)=>{
      this.user = res
      console.log(this.user);
    })
    
  }
  get f(): { [key: string]: AbstractControl } {
    return this.createform.controls;
  }

  create(){
    console.log('hello');
    
    this.submitted = true

    if (this.createform.invalid) {
      this.toastr.error('Invalid data.', 'Error');
      return;
    }

    
    const bookval = this.createform.value
    const book={
      name: bookval.name,
      author: bookval.author,
      image: bookval.image,
      pages: bookval.pages,
      price: bookval.price
    }
    console.log(book);
    
    this.bookservice.createBook(book).subscribe((res)=>{
      console.log(res);
      this.loading = true;
      setTimeout(()=>{
        this.loading = false
        window.location.reload()
      },1650)
      
      this.toastr.success('Book created','Success')
      
      
    },(error)=>{
      this.loading = false;
      this.toastr.error('Failed to create the book.', 'Error');
    })
    this.closeModal()
    
  }
  
  closeModal(){
    const modal = document.getElementById('addBookModal');
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

  logout(){
    const modalBackdrop = document.querySelector('.modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.remove();
  }
    this.authService.logout()
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event:Event) {
      if(confirm('You want to logout')){
        this.logout()
      }
      else{
        event.preventDefault()
        history.go(1)
      }
  }
  
}
