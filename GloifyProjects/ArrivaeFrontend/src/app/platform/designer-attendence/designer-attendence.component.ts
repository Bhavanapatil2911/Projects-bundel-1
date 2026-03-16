import { Component, OnInit } from '@angular/core';
import { LeadService } from '../lead/lead.service';
import { DatePipe } from '@angular/common';
import { LoaderService } from 'app/services/loader.service';
import { GeneralManagerService } from 'app/platform/general-manager/general-manager.service';

declare var $: any;


@Component({
  selector: 'app-designer-attendence',
  templateUrl: './designer-attendence.component.html',
  styleUrls: ['./designer-attendence.component.css'],
  providers:[LeadService,DatePipe]
})
export class DesignerAttendenceComponent implements OnInit {
  role:any;
  dmList =[];
  id:any;
  successalert = false;
  erroralert = false;
  errorMessage: string;
  successMessage : string;
  constructor(
    private leadService: LeadService,
    private datePipe: DatePipe,
    private loaderService: LoaderService,
    private generalManagerService: GeneralManagerService,


  ) { }

  ngOnInit() {
    this.role = localStorage.getItem("user");
    this.fetchDMList()
    this.getallusers();

  }

  ngAfterViewInit(): void {
    const toDateInput: HTMLInputElement | null = document.getElementById('end_date') as HTMLInputElement;
    const FromDateInput: HTMLInputElement | null = document.getElementById('start_date') as HTMLInputElement;

    if (toDateInput) {
      toDateInput.max = this.getMaxDate();
      FromDateInput.max = this.getMaxDate();


    }
  }  



  desPage;
  destotal;
  desPerPage;
  headers_res;
  send_file=false

  general_manager: any = [];
  community_manager: any = [];
  designer: any = [];
  gm: any = "";
  cm: any = "";
  de: any = "";
  designer_data: any = "";
  async getallusers() {
    return (
      await this.generalManagerService.getAllusers2(
        this.gm,
        this.cm )
    ).subscribe(
      (res) => {
        this.general_manager = res.gms;
        this.community_manager = res.cms;
        this.designer = res.designers;
      },
      (err) => {
        this.general_manager = [];
        this.community_manager = [];
        this.designer = [];
      }
    );
  }

  onItemSelect(e,filter){
    console.log(filter,this.gm,this.cm,this.de)
    if(filter=='gm'){
      this.cm=''
      this.de=''
      console.log(this.cm);

    }
    else if(filter=='cm'){
      this.de=''
    }
    console.log(this.gm,this.cm,this.de)
    this.getallusers()
    this.fetchDMList()

  }

  fetchDMList(page?){   
    page = page?page:1
    this.gm=this.gm==null || this.gm=='all'?'':this.gm
    this.cm=this.cm==null || this.cm=='all'?'':this.cm
    this.de=this.de==null || this.de=='all'?'':this.de

    this.leadService.getDMattendence(this.gm,this.cm,this.de,page).subscribe((res)=>{
      this.loaderService.display(true);

      this.headers_res= res.headers._headers;
      this.desPerPage = this.headers_res.get('x-per-page');
      this.destotal = this.headers_res.get('x-total');
      this.desPage = this.headers_res.get('x-page');
      res = res.json()
      this.dmList=res.users;
      this.loaderService.display(false);  
     
    })
  }
 
  

  start_date:any
  end_date:any


  EportDetail() {
    this.send_file = true;
    const startdate=this.start_date==undefined?'':this.start_date
    const enddate=this.end_date==undefined?'':this.end_date
    this.leadService.Export(this.send_file, startdate, enddate,this.gm,this.cm,this.de).subscribe(
      (res) => {
        res = res.json();
        if (res.message) {
          this.successalert = true;
          this.successMessage = res.message;
          setTimeout(() => {
            this.successalert = false;
          }, 5000);
        }
      },
      (error) => {
        console.log(error)
        this.erroralert = true;
        this.errorMessage= JSON.parse(error['_body']).message;;
        console.error(error); 
      }
    );
  }

  clearAllfilters(){
    this.gm=''
    this.cm=''
    this.de=''
    this.start_date=''
    this.end_date=''
    const toDateInput: HTMLInputElement | null = document.getElementById('end_date') as HTMLInputElement;
    toDateInput.min=''
    this.fetchDMList()

    }




  getMaxDate(): string {

    const today = new Date();
    const dd: number = today.getDate();
    const mm: number = today.getMonth() + 1; // January is 0!
    const yyyy: number = today.getFullYear();
    const formattedMonth: string = mm < 10 ? '0' + mm : '' + mm;
    const formattedDay: string = dd < 10 ? '0' + dd : '' + dd;

    return `${yyyy}-${formattedMonth}-${formattedDay}`;
  }
  setmin(){
    const today = new Date(this.start_date);

    const toDateInput: HTMLInputElement | null = document.getElementById('end_date') as HTMLInputElement;

    if (today) {
      const dd: number = today.getDate();
      const mm: number = today.getMonth() + 1; // January is 0!
      const yyyy: number = today.getFullYear();
      const formattedMonth: string = mm < 10 ? '0' + mm : '' + mm;
      const formattedDay: string = dd < 10 ? '0' + dd : '' + dd;
    
      toDateInput.min= `${yyyy}-${formattedMonth}-${formattedDay}`;
    }
  }

  openpopup(event, id) {
    var thisobj = this;
    $(event.target).popover({
      trigger: "hover",
    });

    $(function () {
      $(".pop").popover({
        trigger: "hover",
      });
    });
  }

  


}
