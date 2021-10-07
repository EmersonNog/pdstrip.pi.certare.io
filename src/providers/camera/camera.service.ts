import { Injectable } from "@angular/core";
import { ActionSheetController } from "ionic-angular";
import { Camera } from "@ionic-native/camera";

@Injectable()
export class CameraService {

  constructor(public camera: Camera) {}

  openMedia(title: string, actionSheetCtrl: ActionSheetController, sucessCallback, showCamera:boolean=true, cameraOptions:any=undefined){
    let buttonsArr = [];

    if(!cameraOptions){
      cameraOptions = {
        quality: 50,
        allowEdit: true,
        targetWidth: 350,
        targetHeight: 350
      };
    }

    if(showCamera)
      buttonsArr.push({ text: 'Da Câmera', handler: () => this.getMediaBase64('camera', sucessCallback, cameraOptions) });

    buttonsArr.push({ text: 'Da Galeria', handler: () => this.getMediaBase64('galeria', sucessCallback, cameraOptions) });
    buttonsArr.push({ text: 'Cancelar', role: 'cancel', handler: () => console.log('Cancel clicked') });

    let action = actionSheetCtrl.create({ title: title, buttons: buttonsArr });
    action.present();

    return action;
  }

  /**
   * media: camera, foto (galeria), video (galeria), arquivo (galeria)
   */
  getMediaBase64(media, sucessCallback, cameraOptions) {
    this.getMedia(media, cameraOptions).then((imageData) => {
      let base64 = 'data:image/jpeg;base64,' + imageData;
      sucessCallback(base64);
    }, (erro) => {
      console.log(erro);
    });
  }

  private getMedia(media, cameraOptionsDef) {
    let cameraOptions = {};

    switch (media) {
      case 'camera':
        cameraOptions = {
          sourceType: this.camera.PictureSourceType.CAMERA,
          saveToPhotoAlbum: true,
          cameraDirection: this.camera.Direction.FRONT,
          correctOrientation: true
        }
        break;
      case 'galeria':
        cameraOptions = {
          mediaType: this.camera.MediaType.PICTURE,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          correctOrientation: true
        }
        break;
      case 'video':
        cameraOptions = {
          mediaType: this.camera.MediaType.VIDEO,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        }
        break;
      case 'arquivo':
        cameraOptions = {
          mediaType: this.camera.MediaType.ALLMEDIA,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        }
        break;
    }

    cameraOptions['quality'] = cameraOptionsDef['quality'];
    cameraOptions['destinationType'] = this.camera.DestinationType.DATA_URL;
    //cameraOptions['destinationType'] = Camera.DestinationType.FILE_URI;
    cameraOptions['encodingType'] = this.camera.EncodingType.JPEG;
    cameraOptions['allowEdit'] = cameraOptionsDef['allowEdit'];
    cameraOptions['targetWidth'] = cameraOptionsDef['targetWidth'];
    cameraOptions['targetHeight'] = cameraOptionsDef['targetHeight'];

    return this.camera.getPicture(cameraOptions);
  }

  processWebImage(event, sucessCallback) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;

      let image = new Image();
      image.src = imageData;
      image.onload = (data) => {
        const w = data['path'][0].naturalWidth;
        const h = data['path'][0].naturalHeight;

        sucessCallback(imageData, w, h);
      }
    };

    reader.readAsDataURL(event.target.files[0]);
  }
}
