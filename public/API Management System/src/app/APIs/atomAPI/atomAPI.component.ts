import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../../dashboard/nav.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgClass} from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-apis',
  templateUrl: './atomAPI.component.html',
})
export class atomAPIComponent implements OnInit {



  constructor (
                 private parent: NavComponent,
                 private route: ActivatedRoute,
                 private router: Router
    ) {}

    para = '';
    public versionManagement = "";
    public performanceMonitoring = "";
    public routeManagement = "";


    ngOnInit(){
        this.parent.setActiveByPath("APIs",this.parent.atomAPI);


        $("#btn").click(function () {
          alert("123");
        });

        this.route.params.subscribe((params) => {
          console.log(params['id']);
          this.para=params['id'];
        });

        this.versionManagement = "/main/"+this.para+"/versionManagement";
        this.performanceMonitoring = "/main/"+this.para+"/performanceMonitoring";
        this.routeManagement = "/main/"+this.para+"/routeManagement";
    };
}