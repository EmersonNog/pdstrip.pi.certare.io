import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImagensTrechoPage } from './imagens-trecho';
import { TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    ImagensTrechoPage,
  ],
  imports: [
    IonicPageModule.forChild(ImagensTrechoPage),
    TranslateModule.forChild(),
  ],
})
export class ImagensTrechoPageModule {}
