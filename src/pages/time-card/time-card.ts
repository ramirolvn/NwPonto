import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera, CameraOptions } from '@ionic-native/camera';


/**
 * Generated class for the TimeCard page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-time-card',
  templateUrl: 'time-card.html',
})
export class TimeCard {

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE
  };
  record = {"image": ""};

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  private statusBar: StatusBar,
  private camera: Camera) {
    // let status bar overlay webview
    this.statusBar.overlaysWebView(true);

    // set status bar to white
    this.statusBar.backgroundColorByHexString('#C22F2F');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimeCard');
  }

  registerCard(){
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
        let base64Image = 'data:image/png;base64,' + imageData;
        this.record.image = base64Image;
      }, (err) => {
        console.log(err);
      });
  }

}
