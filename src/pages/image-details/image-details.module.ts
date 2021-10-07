import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageDetailsPage } from './image-details';
import { TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    ImageDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageDetailsPage),
    TranslateModule.forChild(),
  ],
})
export class ImageDetailsPageModule {}
