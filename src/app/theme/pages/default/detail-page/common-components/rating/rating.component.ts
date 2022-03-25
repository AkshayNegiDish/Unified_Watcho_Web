import { Component, OnInit, Input } from '@angular/core';
import { KalturaAppService } from '../../../../../shared/services/kaltura-app.service';
import { PlatformIdentifierService } from '../../../../../shared/services/platform-identifier.service';
import { AppUtilService } from '../../../../../shared/services/app-util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignInSignUpModalComponent } from '../../../../../shared/entry-component/signIn-signUp-modal.component';

declare var  $;

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {


 @Input()
 assetDetails: any;

  rating:any;
  rateText:boolean = false;
  rateCount: number = 0;
  totalRating: any;
  assetSocialActionId: any;
  selectedUserRate: any;
  selectedRating: boolean = false;
  hideRatingBox: boolean = false;
  totalRatingValue: any;

  constructor(private kalturaAppService: KalturaAppService, private platformIdentifierService: PlatformIdentifierService, 
    private appUtilService:AppUtilService, private modalService: NgbModal ) { }

  ngOnInit() {

    if (this.platformIdentifierService.isBrowser()) {
      $('.remove-icon').click(()=>{
        $('.select-star').hide();
      })
  
        $('#nah').mouseover(()=>{
          $('#nah .rating-single,#nah,.rating-show').addClass('active');
          this.rating = 1;
          this.rateText = true;
        })
      $('#nah').mouseout(()=>{
        $('#nah .rating-single,#nah,.rating-show').removeClass('active');
        this.rateText = false;
      })
  
      $('#meh').mouseover(()=>{
        $('#nah .rating-single,#meh .rating-single,#meh,#nah,.rating-show').addClass('active');
        this.rating = 2;
        this.rateText = true;
      })
      $('#meh').mouseout(()=>{
        $('#nah .rating-single,#meh .rating-single,#meh,#nah,.rating-show').removeClass('active');
        this.rateText = false;
      })
  
      $('#nice').mouseover(()=>{
        $('#nah .rating-single,#meh .rating-single,#nice .rating-single,#nice,#meh,#nah,.rating-show').addClass('active');
        this.rating = 3;
        this.rateText = true;
      })
      $('#nice').mouseout(()=>{
        $('#nah .rating-single,#meh .rating-single,#nice .rating-single,#nice,#meh,#nah,.rating-show').removeClass('active');
        this.rateText = false;
      })
  
      $('#cool').mouseover(()=>{
        $('#nah .rating-single,#meh .rating-single,#nice .rating-single,#cool .rating-single,#cool,#nice,#meh,#nah,.rating-show').addClass('active');
        this.rating = 4;
        this.rateText = true;
      })
      $('#cool').mouseout(()=>{
        $('#nah .rating-single,#meh .rating-single,#nice .rating-single,#cool .rating-single,#cool,#nice,#meh,#nah,.rating-show').removeClass('active');
        this.rateText = false;
      })
  
      $('#awesome').mouseover(()=>{
        $('#nah .rating-single,#meh .rating-single,#nice .rating-single,#cool .rating-single,#awesome .rating-single,#awesome,#cool,#nice,#meh,#nah,.rating-show').addClass('active');
        this.rating = 5;
        this.rateText = true;
      })
      $('#awesome').mouseout(()=>{
        $('#nah .rating-single,#meh .rating-single,#nice .rating-single,#cool .rating-single,#awesome .rating-single,#awesome,#cool,#nice,#meh,#nah,.rating-show').removeClass('active');
        this.rateText = false;
      })
  
        $("#awesome,#cool,#nice,#meh,#nah").on("click", (e) => {
          if (this.appUtilService.isUserLoggedIn() ){
            $('#awesome,#cool,#nice,#meh,#nah').mouseout(()=>{
              $('#nah .rating-single,#meh .rating-single,#nice .rating-single,#cool .rating-single,#awesome .rating-single,#awesome,#cool,#nice,#meh,#nah,.rating-show').removeClass('active');
              $('.rating-show').addClass('active');
              this.rateText = true;
            })
            $('.select-star').hide();
             this.ratedAsset(this.rating);
            }else{
              this.modalService.open(SignInSignUpModalComponent);
              }
         })
   
    }
      this.getAssetLike();
      this.isAssetRatedByUser();
  }

   getAssetLike() {
       this.kalturaAppService.getAssetStatistics(this.assetDetails.id, null, null).then((res: any) => {
         if (res && res.objects && res.objects.length > 0) {
           this.rateCount = res.objects[0].ratingCount;
           this.totalRating = res.objects[0].rating;
           let totalValue: string[] = this.totalRating.toString().split('.');
           if (totalValue.length > 1) {
             if (totalValue[1].substr(0, 1) === "0") {
               this.totalRatingValue =  (totalValue[0]) ;
             } else {
               this.totalRatingValue = (totalValue[0] + '.' + totalValue[1].substr(0, 1) );
             }
           } else {
             this.totalRatingValue = (totalValue[0]) ;
           }
         }
       }).catch((err: any) => {
         console.error(err);
       });
     }

    isAssetRatedByUser() {
      this.kalturaAppService.getIsAssetRatingByUser(this.assetDetails.id,"RATE").then((res: any) => {
  
        if (res && res.objects && res.objects.length > 0) {
          if(res.objects[0].actionType === "RATE"){
            this.assetSocialActionId = res.objects[0].id;
            this.selectedUserRate = res.objects[0].rate;
            this.rateText = true;
            this.selectedRating = true;
            $('.rating-show').addClass('active');
            if(this.selectedRating === true){
              $('.select-star').hide();
            }

          }else{
            this.rateText = false;
            this.selectedRating = false;
            if(this.selectedRating){
              $('.select-star').hide();
            }
          }
        }
   
      }).catch((err: any) => {
        console.error(err);
      });
    }

   ratedAsset(rating : any){
       this.kalturaAppService.socialActionAddRatingByUser(this.assetDetails.id,"RATE",rating).then((res:any)=>{
         if(res && res.socialAction){
           this.assetSocialActionId = res.socialAction.id;
           this.selectedUserRate= res.objects[0].rate;
           this.selectedRating = true;
           $('.rating-show').addClass('active');
           if(this.selectedRating === true){
            $('.select-star').hide();
          }

         }

       }).catch((err: any) => {
         console.error(err);
       });
     }

}
