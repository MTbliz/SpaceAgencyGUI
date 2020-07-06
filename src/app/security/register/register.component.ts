import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

export interface Role {
  value: string;
  viewValue: string;
  }

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  roles: Role[] = [
    {value: 'Administrator', viewValue: 'admin'},
    {value: 'Moderator', viewValue: 'mod'},
    {value: 'User', viewValue: 'user'},
  ];

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.authService.register(this.form).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
}
