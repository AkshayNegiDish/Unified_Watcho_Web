import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { String } from 'aws-sdk/clients/marketplacemetering';
import { AppUtilService } from '../services/app-util.service';
import { KalturaAppService } from '../services/kaltura-app.service';
import { PlatformIdentifierService } from '../services/platform-identifier.service';
import { SnackbarUtilService } from '../services/snackbar-util.service';
import { ParentalConstants } from '../typings/common-constants';

declare var $: any;

@Component({
  selector: 'app-parental-pin-validator',
  templateUrl: './parental-pin-validator.component.html',
  styleUrls: ['./parental-pin-validator.component.scss']
})
export class ParentalPinValidatorComponent implements OnInit, AfterViewInit {

  @Input()
  name: string;
  @Input()
  pinOptions: string;
  @Input()
  buttonName: string;
  @Input()
  playerValidation?: boolean = false;


  userPin: string;
  ruleId: number;
  loading: boolean;
  DMS: any;
  browserDetails: any;
  constructor(public activeModal: NgbActiveModal, public modalService: NgbModal, private kalturaAppService: KalturaAppService, private snackbarUtilService: SnackbarUtilService, private appUtilService: AppUtilService,
    private platformIdentifierService: PlatformIdentifierService) { }

  ngOnInit() {
    this.DMS = this.appUtilService.getDmsConfig();
    this.ruleId = this.DMS.params.ParentalRules['16+'];
    if (this.platformIdentifierService.isBrowser()) {
      $('#parentalModal').on('hide.bs.modal', () => {
      })
      this.browserDetails = this.appUtilService.getBrowserDetails();
      if (this.browserDetails.browser === "Safari" || this.browserDetails.browser === "UC-Browser") {
        //   $(document).ready(() => {

        //     $("#parental-pin").keyup(function () { if ($(this).val().length == 4) { setTimeout(function () { $("#pin").focus() }, 10) } })
        //   });
        // }
        // setTimeout(() => {
        //   $("#parental-pin").focus()
        // }, 10);
      }
      // $('input[type="text"]').on('touchstart', function() {
      //   $(this).attr('type', 'number');
      // });
    }
  }

  ngAfterViewInit() {
    if (this.platformIdentifierService.isBrowser()) {
      var x = window.scrollX || window.pageXOffset || document.documentElement.scrollTop,
        y = window.scrollY || window.pageYOffset || document.documentElement.scrollLeft;
      if (this.browserDetails.browser !== "Safari") {
        $("#codeBox1").focus();
      }
      window.scrollTo(x, y);

    }
  }

  enableDisableParental() {
    this.loading = true;
    if (this.pinOptions === "enable") {
      this.desableParentalRule()
    } else if (this.pinOptions === "disable") {
      this.enableParentalRule()
    } else if (this.pinOptions === "update") {
      this.updatePin()
    } else if (this.pinOptions === "validate") {
      this.validatePin()
    }
  }
  validateSetPin(): boolean {
    this.getPinValue();
    if (this.userPin && this.userPin.trim() != '') {
      if (this.userPin.match(/^[0-9]*$/)) {
        if (this.userPin.length < 4) {
          this.snackbarUtilService.showSnackbar('Invalid PIN, PIN must contain 4 digits');
          this.loading = false;
          return false
        } else {
          return true
        }
      } else {
        this.snackbarUtilService.showSnackbar('Invalid PIN, PIN must contain only numbers');
        this.loading = false;
        return false;
      }
    } else {
      this.snackbarUtilService.showSnackbar('PIN cannot be blank');
      this.loading = false;
      return false
    }

  }

  enableParentalRule() {
    if (!this.validateSetPin()) {
      return;
    }
    this.kalturaAppService.setParentalPin(this.userPin, this.ruleId).then((res: any) => {
      if (res) {
        this.kalturaAppService.enableParentalRule(this.ruleId).then((res: any) => {
          if (res) {
            this.kalturaAppService.activateDeactivateParentalRestrictions(ParentalConstants.Acivate).then((res: any) => {
              if (res) {
                this.snackbarUtilService.showSnackbar('Parental Restrictions applied');
                this.activeModal.close();
                this.loading = false;
              }
            }, reject => {
              this.loading = false;
              console.error(reject)
            })
          }
        }, reject => {
          this.loading = false;
          console.error(reject)
        })
      }
    }, reject => {
      this.loading = false;
      console.error(reject)
    })
  }

  desableParentalRule() {
    if (!this.validateSetPin()) {
      return;
    }
    this.kalturaAppService.validateParentalPin(this.userPin, this.ruleId).then((res: any) => {
      if (res === true) {
        this.kalturaAppService.disableParentalRule(this.ruleId).then((res: any) => {
          if (res) {
            this.kalturaAppService.activateDeactivateParentalRestrictions(ParentalConstants.Deactivate).then((res: any) => {
              if (res) {
                this.snackbarUtilService.showSnackbar('Parental Restrictions removed');
                this.activeModal.close();
                this.loading = false;
              }
            }, reject => {
              this.loading = false;
              console.error(reject)
            })
          }
        }, reject => {
          this.loading = false;
          console.error(reject)
        })
      } else {
        if (res.error.code === '5002') {
          this.snackbarUtilService.showSnackbar('Incorrect Pin, Please enter PIN again');
          this.loading = false;
        } else {
          this.loading = false;
        }
      }
    }, (reject: any) => {
      if (reject.code === '5002') {
        this.snackbarUtilService.showSnackbar('Incorrect Pin, Please enter PIN again');
        this.loading = false;
      } else {
        this.loading = false;
        console.error(reject)
      }
    })

  }

  validatePin() {
    if (!this.validateSetPin()) {
      return;
    }
    this.kalturaAppService.validateParentalPin(this.userPin, this.ruleId).then((res: any) => {
      if (res === true) {
        if (this.playerValidation) {
          this.activeModal.close();
        } else {
          this.resetPinValue();
          this.name = "Set PIN";
          this.pinOptions = 'update';
          this.userPin = null;
          this.buttonName = "Set"
          this.loading = false;
        }
      }
      else {
        if (res.error.code === '5002') {
          this.snackbarUtilService.showSnackbar('Incorrect Pin, Please enter PIN again');
          this.loading = false;
        } else {
          this.loading = false;
        }
      }
    }, (reject: any) => {
      this.loading = false;
      if (reject.code === '5002') {
        this.loading = false;
        this.snackbarUtilService.showSnackbar('Incorrect Pin, Please enter PIN again');
      }
    })

  }

  updatePin() {
    if (!this.validateSetPin()) {
      return;
    }
    this.kalturaAppService.setParentalPin(this.userPin, this.ruleId).then((res: any) => {
      if (res) {
        this.snackbarUtilService.showSnackbar('Parental PIN changed successfully');
        this.appUtilService.moEngageEventTrackingWithNoAttribute("UPDATE_PARENTAL_SETTING_PIN");
        this.activeModal.close();
        this.loading = false;
      }
    }, reject => {
      this.loading = false;
      console.error(reject)
    })
  }

  getCodeBoxElement(index: number): any {
    return document.getElementById('codeBox' + index);
  }
  onKeyUpEvent(index: number, event: any) {
    const eventCode = event.which || event.keyCode;
    if (this.getCodeBoxElement(index).value.length === 1) {
      if (index !== 5) {
        this.getCodeBoxElement(index + 1).focus();
      } else {
        this.getCodeBoxElement(index).blur();
        this.getPinValue();
      }
    }
    if (eventCode === 8 && index !== 1) {
      this.getCodeBoxElement(index - 1).focus();
    }
  }
  onFocusEvent(index) {
    for (let item = 1; item < index; item++) {
      const currentElement = this.getCodeBoxElement(item);
      if (!currentElement.value) {
        currentElement.focus();
        break;
      }
    }
  }

  getPinValue() {
    let val = $("#codeBox1").val() + $("#codeBox2").val() + $("#codeBox3").val() + $("#codeBox4").val();
    this.userPin = val;
  }

  resetPinValue() {
    $("#codeBox1").val('');
    $("#codeBox2").val('');
    $("#codeBox3").val('');
    $("#codeBox4").val('');
  }

  onKeyDownEvent(id: String, e: any) {
    setTimeout(() => {
      if (isNaN(e.target.value)) {
        $(id).val('');
        $(id).focus();
      }
      if (e.keyCode === 8) {
        this.resetPinValue();
        $("#codeBox1").focus();
      }
    })

  }

}
