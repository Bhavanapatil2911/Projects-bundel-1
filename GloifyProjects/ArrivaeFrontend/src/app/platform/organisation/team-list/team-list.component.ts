import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { LeadService } from '../../lead/lead.service';
import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css'],
  providers:[LeadService]
})
export class TeamListComponent implements OnInit {

  role: string;
  userid;
  dmList =[];
  cmList=[];successalert: boolean;
  successMessage: string;
  erroralert: boolean;
  errorMessage: string;
;
  smList;
  gmList=[];

  
  constructor(
  public activatedRoute: ActivatedRoute,
  private route:ActivatedRoute,
  private leadService: LeadService,
  private loaderService: LoaderService,

  ) { }

  searchValue:any;
  searchList(searchValue){
    if(this.role == 'deputy_general_manager' || this.role == 'city_gm' || this.role == 'sales_manager'){ 
      this.getCMLists(this.userid,searchValue)
    }
    if(this.role == 'area_sales_manager'){
      this.getSMLists(searchValue)
    
    } 
    if(this.role == 'business_head'){
      console.log("need GM LIST")
      this.getGMLists(searchValue)

    }

  }
  
  ngOnInit() {
    this.userid = localStorage.getItem('userId')
    this.role=localStorage.getItem('user')
    console.log(this.userid,this.role)
    if(this.role == 'deputy_general_manager' || this.role == 'city_gm' || this.role == 'sales_manager'){ 
      console.log("need CM LIST")
      this.getCMLists(this.userid)
    }
    if(this.role == 'area_sales_manager'){
      console.log("need SM LIST")
      this.getSMLists()
    
    } 
    if(this.role == 'business_head'){
      console.log("need GM LIST")
      this.getGMLists()

    }
  }
  
collapsetables=[]
IDforGM;
isDmcolpase =[];
Gm_id
Cm_id
IDfOrDes;
gmPage;
gmtotal;
gmPerPage;
cmPage;
cmtotal;
cmPerPage;
desPage;
destotal;
desPerPage;
headers_res;
headers_res2;
headers_res3;
smPage;
smtotal;
smPerPage;

fetchCMforGM(id,search,internal?,page?){
 this.IDforGM = id;
  if(!page){
    if(this.collapsetables[0] != id || internal==true){
      this.collapsetables[0] = (id)
    }
    else{
       this.collapsetables[0] =''
    }
  }
 
page = page?page:1
  this.loaderService.display(true)
  this.leadService.getCMLists(id,'',page).subscribe((res)=>{
    this.headers_res2= res.headers._headers;
    this.cmPerPage = this.headers_res2.get('x-per-page');
    this.cmtotal = this.headers_res2.get('x-total');
    this.cmPage = this.headers_res2.get('x-page');
   res = res.json();
    this.cmList=res;
    this.cmList = res.user?[]:res; 
    this.loaderService.display(false)

  },
  (err)=>{
    this.loaderService.display(false)
      this.cmList=[]
  }
  )
}


fetchDM(gmid,cmid,id,page?){
  this.Gm_id = gmid;
  this.Cm_id = cmid
  this.IDfOrDes = id
  if(!page){
    if(this.isDmcolpase[0] != id){
      this.isDmcolpase[0] = (id)
    }
    else{
       this.isDmcolpase[0] =''
  }
}
   
  page = page?page:1
  this.leadService.getDMLists(id,'',page).subscribe((res)=>{
    this.headers_res3= res.headers._headers;
    this.desPerPage = this.headers_res3.get('x-per-page');
    this.destotal = this.headers_res3.get('x-total');
    this.desPage = this.headers_res3.get('x-page');
    res = res.json()
    this.dmList=res;
    this.dmList = res.user?[]:res;
   
  })
}


getGMLists(search?,page?){
  search=search==undefined?'':search;
  page = page?page:1;
  this.loaderService.display(true)
  this.leadService.getGMLists(search,page).subscribe((res)=>{
    this.headers_res= res.headers._headers;
    this.gmPerPage = this.headers_res.get('x-per-page');
    this.gmtotal = this.headers_res.get('x-total');
    this.gmPage = this.headers_res.get('x-page');
    res = res.json()
    this.gmList=res
    this.gmList = res.user?[]:res;
    this.loaderService.display(false)
  },
  (err)=>{
    this.loaderService.display(false)
    console.log("HII")
    this.gmList=[]
  })

}
getSMLists(search?,page?){
  search=search==undefined?'':search
  page = page?page:1;
  this.loaderService.display(true)
  this.leadService.getSMListss(this.userid,search,page).subscribe((res)=>{
    this.headers_res= res.headers._headers;
    this.smPerPage = this.headers_res.get('x-per-page');
    this.smtotal = this.headers_res.get('x-total');
    this.smPage = this.headers_res.get('x-page');
    res = res.json()
    this.smList=res
    this.smList = res.user?[]:res; 
    this.loaderService.display(false)

   },
   (err)=>{
    this.loaderService.display(false)
    console.log("HII")
    this.smList=[]
  });

}
getCMLists(id,search?,page?){
  search=search==undefined?'':search;
  page = page?page:1;
  this.loaderService.display(true)
  this.leadService.getCMLists(id,search,page).subscribe((res)=>{
    this.headers_res= res.headers._headers;
    this.cmPerPage = this.headers_res.get('x-per-page');
    this.cmtotal = this.headers_res.get('x-total');
    this.cmPage = this.headers_res.get('x-page');
    res = res.json()
    console.log(res.status)
    this.cmList=res
    this.cmList = res.user?[]:res;
    this.loaderService.display(false)},
    (err)=>{
      this.loaderService.display(false)
      console.log("HII")
      this.cmList=[]
    }
  );

}
getDMLists(id,search?){
  search=search==undefined?'':search
  this.leadService.getDMLists(id,search).subscribe((res)=>{
    this.loaderService.display(true)
    this.dmList=res
    this.dmList = res.user?[]:res; 
    this.loaderService.display(false)

  })

}
details:any;
openLeaddetailsmodal(id){

    this.DetailedInfo(id)
    $("#ModalforCMdetails").modal("show");

}

details2

data={};
Store:any;
DetailedInfo(id){
this.data={}
  this.loaderService.display(true)
  this.leadService.getdetailedinfo(id).subscribe((res) => {
    this.details = res;
    this.details = Object.entries(res);
    for(let det of this.details){
      const key=det[0]
      console.log(this.data)
      console.log(key)
      if(det[1] != null && key != 'community_manager' && key != this.role ){
        if(key == 'operational_manager' ){
          if( det[1].length > 0){
            this.data[key]=det[1]
          }
        }
        else if(key == 'general_manager'){
          if((this.role != 'business_head') && (this.role != 'city_gm') ){
            this.data[key]=[det[1]] 
          }  
        }
        else if(key=='sales_manager'){
          if(this.role != 'area_sales_manager'){
            this.data[key]=[det[1]]
          }
        }
        else if(key == 'store_details'){
          if(det[1].store_managers != null && det[1].store_managers.length >0){
            this.data['Stores_and_Store_Managers']=det[1].store_managers
            this.Store=det[1].store.name
            console.log(this.Store)
          }
        }
        else{
          this.data[key]=[det[1]]
        }
      }

    }
    if(Object.keys(this.data).length == 0){
      this.data=false
    }
    else{
      this.data=Object.entries(this.data)
    }
    this.loaderService.display(false)
  },
  (err)=>{
    this.loaderService.display(false)
  });
}


changeContactStatus(index,id,status){
  this.loaderService.display(true);
  this.leadService.changecustomStatus(id,!status).subscribe(
    res=>{
      this.cmList[index].custom_element_access=!status
      if(this.cmList[index].custom_element_access){
        this.successMessage="Custom element access is marked as active successfully"
      }
      else{
        this.successMessage="Custom element access is marked as inactive successfully"
      }
      this.loaderService.display(false); 
      this.successalert = true;
      setTimeout(function() {
        this.successalert = false;
      }.bind(this), 2000);
    },
    err=>{
      
      this.loaderService.display(false);
      this.erroralert = true;
      this.errorMessage = "Unauthorized user";
      setTimeout(function() {
        this.erroralert = false;
      }.bind(this), 5000);    
  });
}
   
}