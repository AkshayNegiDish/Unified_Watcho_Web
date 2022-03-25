import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordCommand } from '../typings/shared-typing';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  email: string;
  forgotPasswordCommand: ForgotPasswordCommand;
  emailSent: boolean;
  signInemailErrorMessage: string;
  hideSignInEmailError: boolean;
  loading: any;
  constructor(public activeModal: NgbActiveModal) {
    this.forgotPasswordCommand = {
      email: null
    }
  }

  ngOnInit() {
  }

  validateForm(): boolean {
    if (!this.forgotPasswordCommand.email) {
      this.hideSignInEmailError = true
      this.signInemailErrorMessage = "Please enter Email";
    } else if (this.forgotPasswordCommand.email.match(/^.+@[^\.].*\.[a-z]{2,}$/)) {
      this.hideSignInEmailError = false
    } else {
      this.signInemailErrorMessage = "Invalid Email";
      this.hideSignInEmailError = true
    }
    if (!this.hideSignInEmailError) {
      return true;
    } else {
      return false;
    }

  }

  forgotPassword() {

    if (!this.validateForm()) {
      return;
    }
    this.loading = true;
  }

}
