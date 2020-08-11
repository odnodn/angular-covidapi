import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { HttpClientModule } from "@angular/common/http";
import { Covid19ApiService } from './covid19-api.service';

import { GridModule } from '@syncfusion/ej2-angular-grids';
import { PageService, SortService, FilterService, GroupService, AggregateService, ResizeService, ColumnChooserService,
        ToolbarService, ExcelExportService  } from '@syncfusion/ej2-angular-grids';
import { ToolbarModule, TabModule } from '@syncfusion/ej2-angular-navigations';
import { DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpClientModule, GridModule, ToolbarModule, TabModule, DashboardLayoutModule ],
  declarations: [ AppComponent, HelloComponent ],
  bootstrap:    [ AppComponent ],
  providers: [Covid19ApiService, 
                PageService,
                ResizeService,
                SortService,
                FilterService,
                GroupService,
                AggregateService,
                ColumnChooserService,
                ToolbarService, ExcelExportService ]
})
export class AppModule { }
