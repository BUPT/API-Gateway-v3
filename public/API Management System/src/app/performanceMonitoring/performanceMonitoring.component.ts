import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../dashboard/nav.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgClass} from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-performance',
  templateUrl: './performanceMonitoring.component.html',
})
export class performanceMonitoringComponent implements OnInit {



  constructor (
                 private parent: NavComponent,
                 private route: ActivatedRoute,
                 private router: Router
    ) {}

    para = '';
    public logCheckup = "";

    ngOnInit(){
        //this.parent.setActiveByPath(this.parent.performanceMonitoring,"");

        this.route.params.subscribe((params) => {
            console.log(params['id']);
            this.para=params['id'];
          });
    
          this.logCheckup = "/main/"+this.para+"/logCheckup";

    };
}