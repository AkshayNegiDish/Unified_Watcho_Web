import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordCommand } from '../typings/shared-typing';


@Component({
    selector: "change-password",
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent implements OnInit {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    hideCurrentPasswordValidation: boolean;
    hideNewPasswordValidation: boolean;
    hideConfirmPasswordValidation: boolean;
    hideConfirmPasswordMatchValidation: boolean;
    currentpasswordErrorMessage: string;
    newpasswordErrorMessage: string;
    confirmpasswordErrorMessage: string;

    public loading = false;

    constructor(public activeModal: NgbActiveModal) {
        this.newPassword = null;
        this.confirmNewPassword = null;
        this.hideCurrentPasswordValidation = true;
        this.hideNewPasswordValidation = true;
        this.hideConfirmPasswordValidation = true;
        this.hideConfirmPasswordMatchValidation = true;
    }
    ngOnInit() {
    }
    changePasswordvalidate() {
        if (!this.newPassword) {
            this.newpasswordErrorMessage = "Current Password is required";
            this.hideNewPasswordValidation = false;
        } else if (this.newPassword.match(/^(?=[^\d_].*?\d)\w(\w|[!@#$%]){5}/)) {
            this.hideNewPasswordValidation = true;
        }
        else if (this.newPassword.trim() === '') {
            this.newpasswordErrorMessage = "Password cant be only space";
            this.hideNewPasswordValidation = false;
        } else {
            this.currentpasswordErrorMessage = "Minimum 6 characters having atleast 1 number";
            this.hideCurrentPasswordValidation = false;
        }

        if (!this.confirmNewPassword) {
            this.confirmpasswordErrorMessage = 'Confirm Password is required';
            this.hideConfirmPasswordValidation = false;
            this.hideConfirmPasswordMatchValidation = true;
        } else if (this.confirmNewPassword.match(/^(?=[^\d_].*?\d)\w(\w|[!@#$%]){5}/)) {
            this.hideConfirmPasswordValidation = true;
        } else {
            this.confirmpasswordErrorMessage = "Confirm can't start or end with a blankspace";
            this.hideConfirmPasswordValidation = false;
            this.hideConfirmPasswordMatchValidation = true;
        }
    }
    changePassword() {
        this.loading = true;

        let command = new ChangePasswordCommand();
        command.newPassword = this.newPassword;
    }


}
