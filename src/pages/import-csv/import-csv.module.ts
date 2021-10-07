import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportCsvPage } from './import-csv';

@NgModule({
  declarations: [
    ImportCsvPage,
  ],
  imports: [
    IonicPageModule.forChild(ImportCsvPage),
  ],
})
export class ImportCsvPageModule {}
