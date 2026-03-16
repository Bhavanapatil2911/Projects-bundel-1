import { Component, OnInit } from '@angular/core';
import { LeadService } from 'app/platform/lead/lead.service';

@Component({
  selector: 'app-noc-screen',
  templateUrl: './noc-screen.component.html',
  styleUrls: ['./noc-screen.component.css'],
  providers: [LeadService]
})
export class NocScreenComponent implements OnInit {

  constructor(
    private leadService: LeadService
  ) { }
  selectedTab = 'zero_to_forty';
  activeTab = "0-50%";
  ngOnInit() {
  }

  message;
  projectForty;
  receiveMessage($event) {
    
    this.message = $event
    if (this.fortymessage === undefined) {
      this.projectForty = this.message.name2;
    }
  }

  amount;
  fortyone;
  fortytwo;
  reciveAmount($event) {
    
    this.amount = $event;
    if (this.modal === undefined) {
      this.fortyone = this.amount.name4;
      this.fortytwo = this.amount.name5;
    }
  }
  fortymessage;
  receivefortyMessage($event) {
    
    this.fortymessage = $event;
    if (this.fortymessage !== undefined) {
      this.projectForty = this.fortymessage;
    }
  }

  modal;
  recivefortyAmount($event) {
    
    this.modal = $event;
    if (this.modal !== undefined) {
      this.fortyone = this.modal.name1;
      this.fortytwo = this.modal.name2;
    }
  }

  activateTab(tab){
    this.selectedTab = tab;
    switch(tab){
      case "zero_to_forty":
        this.activeTab = "0-50%";
        break;
      case "forty_to_hundred":
        this.activeTab = "40-100%";
        break;
    }

  }

}
