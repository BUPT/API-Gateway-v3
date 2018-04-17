import { Component, OnInit, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { PaginationModule } from 'ng2-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FileUploadModule } from 'ng2-file-upload';


import { NavComponent } from './nav.component';
import { DashboardComponent } from './dashboard.component';
import { lineChartsComponent } from '../charts/lineCharts/lineCharts.component';
import { pieChartsComponent } from '../charts/pieCharts/pieCharts.component';
import { DatatableComponent } from '../tables/datatable/datatable.component';
import { BootstrapComponent } from '../bootstraps/static/bootstrap.component';
import { PluginComponent } from '../bootstraps/plugin/plugin.component';

import { atomAPIComponent } from '../APIs/atomAPI/atomAPI.component';
import { combineAPIComponent } from '../APIs/combineAPI/combineAPI.component';
import { routeManagementComponent } from '../routeManagement/routeManagement.component';
import { versionManagementComponent } from '../versionManagement/versionManagement.component';
import { healthCheckupComponent } from '../healthCheckup/healthCheckup.component';
import { performanceMonitoringAllComponent } from '../performanceMonitoringAll/performanceMonitoringAll.component';
import { logCheckupComponent } from '../logCheckup/logCheckup.component';
import { performanceMonitoringComponent } from '../performanceMonitoring/performanceMonitoring.component';
import { flowControlComponent } from 'app/flowControl/flowControl.component';

const tablesRoutes: Routes = [
    {
        path: 'main/:id',
        component: NavComponent,
        children: [
            { path: '', component: DashboardComponent },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'lineCharts', component: lineChartsComponent },
            { path: 'pieCharts', component: pieChartsComponent },
            { path: 'datatable', component: DatatableComponent },
            { path: 'bootstrap-static', component: BootstrapComponent },
            { path: 'bootstrap-plugin', component: PluginComponent },

            { path: 'atomAPI', component: atomAPIComponent },
            { path: 'combineAPI', component: combineAPIComponent },
            { path: 'routeManagement', component: routeManagementComponent },
            { path: 'atomAPI/versionManagement', component: versionManagementComponent },
            { path: 'combineAPI/versionManagement', component: versionManagementComponent },
            { path: 'healthCheckup', component: healthCheckupComponent },
            { path: 'performanceMonitoringAll', component: performanceMonitoringAllComponent },
            { path: 'performanceMonitoringAll/logCheckup', component: logCheckupComponent },
            { path: 'atomAPI/performanceMonitoring', component: performanceMonitoringComponent },
            { path: 'atomAPI/performanceMonitoring/logCheckup', component: logCheckupComponent },
            { path: 'atomAPI/routeManagement', component: routeManagementComponent },
            { path: 'combineAPI/performanceMonitoring', component: performanceMonitoringComponent },
            { path: 'combineAPI/performanceMonitoring/logCheckup', component: logCheckupComponent },
            { path: 'combineAPI/routeManagement', component: routeManagementComponent },
            { path: 'flowControl', component: flowControlComponent }
        ]
    }
]


@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        RouterModule.forChild(tablesRoutes),
        ChartsModule,
        PaginationModule.forRoot(),
        Ng2SmartTableModule,
        FileUploadModule

    ],
    declarations: [
        NavComponent,
        DashboardComponent,
        lineChartsComponent,
        pieChartsComponent,
        DatatableComponent,
        BootstrapComponent,
        PluginComponent,

        atomAPIComponent,
        combineAPIComponent,
        routeManagementComponent,
        versionManagementComponent,
        healthCheckupComponent,
        performanceMonitoringAllComponent,
        logCheckupComponent,
        performanceMonitoringComponent,
        flowControlComponent
    ],
    providers: []
})
export class DashboardModule { }
