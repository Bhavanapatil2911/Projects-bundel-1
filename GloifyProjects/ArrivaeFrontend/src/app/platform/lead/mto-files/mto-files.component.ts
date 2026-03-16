import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FloorplanService } from 'app/platform/floorplans/floorplan/floorplan.service';
import { LoaderService } from 'app/services/loader.service';
import { LeadService } from '../lead.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from "@angular/router";
import { Observable } from "rxjs";
declare var $: any;

@Component({
  selector: "app-mto-files",
  templateUrl: "./mto-files.component.html",
  styleUrls: ["./mto-files.component.css"],
  providers: [LeadService, LoaderService, FloorplanService],
})
export class MtoFilesComponent implements OnInit {
  @Input() mtofiles: any = [];
  @Output() dataToParent: EventEmitter<any> = new EventEmitter<any>();

  lead_id: any;
  role: any;
  lead_details: any;
  project_id: any;
  floorplan;
  attachment_file: any;
  attachment_name: string;
  basefile: any;
  errorMessage: string;
  erroralert = false;
  successalert = false;
  successMessage: string;
  submitted = false;
  lead_status;
  id: any;
  name: any;
  customerDetails;
  createMTOForm: FormGroup;

  constructor(
    public leadService: LeadService,
    public loaderService: LoaderService,
    public floorplanService: FloorplanService,
    private formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    private route: ActivatedRoute
  ) {}
  some: any;
  ngOnInit() {
    this.dataToParent.emit(true)
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lead_id = params["leadId"];
      this.name = params["name"];
      this.id = params["id"];
    });
    this.fetchBasicDetails();
    this.createMTOForm = this.formBuilder.group({
      name: new FormControl("", Validators.required),
      details: new FormControl("", Validators.required),
      attachment_file: new FormControl(""),
    });
    this.route.queryParams.subscribe((params) => {
      this.lead_status = params["lead_status"];
    });
    this.role = localStorage.getItem("user");
   
  }

  file_name: any = "";

  onChange(event) {
    this.file_name = event.target.files[0].name;
    this.attachment_file = event.target.files[0];

    var fileReader = new FileReader();
    var base64;
    fileReader.onload = (fileLoadedEvent) => {
      base64 = fileLoadedEvent.target;
      this.basefile = base64.result;
    };
    fileReader.readAsDataURL(this.attachment_file);
  }
  client_name;
  fetchBasicDetails() {
    console.log(this.lead_id);
    this.leadService.getLeadLogs(this.lead_id).subscribe(
      (res) => {
        this.lead_details = res['lead']
        this.project_id = this.lead_details.project_details.id;
        this.client_name = this.lead_details.project_details.name;
        this.fetchlistofmto();

      })
   
  }
  openpopup(event, id) {
    var thisobj = this;
    $(event.target).popover({
      trigger: "hover",
    });

    //$(this).popover();
    $(function () {
      $(".pop").popover({
        trigger: "hover",
      });
    });
  }

  onSubmit(data) {
    
    this.submitted = true;

    // let postData = {
    //   "mto_uploads[name]": data.name,
    //   "mto_uploads[details]": data.details,
    //   "mto_uploads[project_id]": this.project_id,
    //   "mto_uploads[attachment_file]": this.attachment_file,
    // };
    this.dataToParent.emit(true)
    this.loaderService.display(true);
    this.floorplanService
      .postWithFileMTO(
        this.project_id,
        data.name,
        data.details,
        this.attachment_file
      )
      .subscribe(
        (mto) => {
          this.dataToParent.emit(false)
          mto = mto;
          Object.keys(mto).map((key) => {
            mto = mto[key];
          });
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = "MTO created successfully !!";
          this.fetchlistofmto();
          setTimeout(
            function () {
              $("#MTOModal").modal("hide");
              this.createMTOForm.reset();

              this.successalert = false;
            }.bind(this),
            800
          );
          return mto;
        },
        (error) => {
          this.erroralert = true;
          this.dataToParent.emit(false)
          this.errorMessage = JSON.parse(error["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            10000
          );

          this.loaderService.display(false);
          return Observable.throw(error);
        }
      );
  }

  fetchlistofmto() {
    this.loaderService.display(true);
    this.dataToParent.emit(true)
    this.leadService.fetchmtolist(this.project_id).subscribe(
      (res) => {
      
        this.mtofiles = res["mto_uploads"];
        this.dataToParent.emit(false)
      },
      (err) => {
        this.dataToParent.emit(false)
      }
    );
  }
  deleteObject(obj_id) {
    if (confirm("Are You Sure you want to delete this MTO File?") == true) {
      this.loaderService.display(true);
      this.floorplanService.deletemto(this.project_id, obj_id).subscribe(
        (res) => {
          this.loaderService.display(false);
          this.successalert = true;
          this.successMessage = "MTO deleted successfully !!";
          this.fetchlistofmto();
          setTimeout(
            function () {
              this.successalert = false;
            }.bind(this),
            800
          );
        },
        (err) => {
          this.erroralert = true;
          this.errorMessage = JSON.parse(err["_body"]).message;
          setTimeout(
            function () {
              this.erroralert = false;
            }.bind(this),
            10000
          );

          this.loaderService.display(false);
        }
      );
    }
  }
}
