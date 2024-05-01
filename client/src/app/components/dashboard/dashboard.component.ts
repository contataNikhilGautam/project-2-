import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet,RouterLink,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user:any
  noOfBooks:any
  constructor(private authService:AuthService,private router:Router){}
  ngOnInit(){
    this.authService.getName().subscribe((res)=>{
      this.user = res
  })
  this.noOfBooks = localStorage.getItem('numberofbooks')
}
goback(){
  this.router.navigate(['/home'])
}
}
