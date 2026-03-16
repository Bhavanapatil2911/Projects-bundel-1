import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/services/loader.service';
import { FinanceService } from '../../finance.service';

@Component({
  selector: 'app-update-approved-amount',
  templateUrl: './update-approved-amount.component.html',
  styleUrls: ['./update-approved-amount.component.css']
})
export class UpdateApprovedAmountComponent implements OnChanges   {
  approvalEditForm:FormGroup;
  @Input() pi_data:any;
  successalert = false;
	successMessage : string;
	errorMessage : string;
	erroralert = false;
  final_err_msg: string;
  error_msg: any;
  @Output() sendApprovedUpdatedAmountEvent : EventEmitter<any> = new EventEmitter();


  constructor( private formBuilder: FormBuilder,
    private financeService:FinanceService,
    private loaderService : LoaderService

    ) { 
      this.approvalEditForm = this.formBuilder.group({
        'approved_amount': ['', Validators.required]
      })
    }

  ngOnChanges(){
    this.approvalEditForm.controls['approved_amount'].setValue(this.pi_data.approved_amount? this.pi_data.approved_amount : this.pi_data.amount);
  }
  paymentEditApprove(){
    this.final_err_msg = '';
    this.loaderService.display(true);
    this.financeService.updateApprovedAmount(this.pi_data.id,this.approvalEditForm.value).subscribe(res=>{
      this.loaderService.display(false);
      this.sendApprovedUpdatedAmountEvent.emit('Approved Payment Updated Successfully !')
      
    },error=>{
      this.loaderService.display(false);
      this.error_msg = JSON.parse(error['_body']);

      this.error_msg.forEach(function(val,index){ 
     }) 
     this.error_msg.forEach((value, index) => {
      this.final_err_msg += `${index + 1}.${value}\n`;
  });
      this.errorMessageShow(this.final_err_msg);
     
    })
  }
  errorMessageShow(msg){
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(function() {
      this.erroralert = false;
    }.bind(this), 2000);
  }
  successMessageShow(msg){
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(function() {
      this.successalert = false;
    }.bind(this), 2000);
  }

}
