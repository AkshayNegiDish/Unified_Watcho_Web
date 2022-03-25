
export class UpdateUserCommand {
    name: string;
    status: string;
    profilePicURL: string;
    gender: string;
    dateOfBirth: number;
    verified: string;
    verificationDate: number;
    phoneNumber: string;
    profileStep: string;
}

export class ChangePasswordCommand {
    newPassword: string;
    confirmPassword: string;
}

export class UserDetailsCommand {
    name: string;
    email: string;
    dateOfBirth: Date;
    gender: string;
    mobileNo: string;
    emailVerified: boolean;
}

export class UpdateUserProfileCommand {
    OTTSubscriberID: string;
    UserID: string;
    UserType: string;
    Name: string;
    DateOfBirth: string;
    Gender: string;
    ProfileImagePath: string;
}
