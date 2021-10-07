import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoadingSpinnerComponentModule } from '../../components/loading-spinner/loading-spinner.module';
import { AuthExtPage } from './auth-ext';

@NgModule({
  declarations: [
    AuthExtPage,
  ],
  imports: [
    IonicPageModule.forChild(AuthExtPage),
    LoadingSpinnerComponentModule,
  ],
})
export class AuthExtPageModule {}
