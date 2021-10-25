import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { FilterPage } from './filter';

@NgModule({
  declarations: [
    FilterPage,
  ],
  imports: [
    IonicPageModule.forChild(FilterPage),
    SelectSearchableModule
  ],
})
export class FilterPageModule {}
