import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UserProvider } from '../../providers/user-provider';
import { Geolocation } from '@ionic-native/geolocation';


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
  record = {"photo": "", "userID": "", "actionID":"", "latitude": "", "longitude": ""};
  actions = [{"id": "","title": "", "image": "", "disable":Boolean(null)}];
  loading = this.loadingCtrl.create({
    content: 'Por favor espere...'
  });

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  private statusBar: StatusBar,
  private camera: Camera,
  public userProv: UserProvider,
  private geolocation: Geolocation,
  private alertCtrl: AlertController,
  public loadingCtrl: LoadingController) {
    this.populateActions();
    this.actions.splice(0,1);
    // let status bar overlay webview
    this.statusBar.overlaysWebView(true);
    // set status bar to white
    this.statusBar.backgroundColorByHexString('#C22F2F');
    this.geolocation.getCurrentPosition().then((resp) => {
      this.record.latitude = resp.coords.latitude.toString();
      this.record.longitude = resp.coords.longitude.toString();
      }).catch((error) => {
        console.log('Error getting location', error);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimeCard');
  }

  registerCard(a){
    this.loading.present().then(() => {
      this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
        let base64Image = 'data:image/png;base64,' + imageData;
        this.record.photo= base64Image;
        this.record.userID = this.userProv.userObj["id"];
        this.record.actionID = a.id;
        this.registerCardHTTP(a);
      }, (err) => {
        console.log(err);
        
      });
    });
  }
  populateActions(){
    this.actions.push({"id": "1","title": "Início de Turno", "image": "ios-sunny","disable":null});
    this.actions.push({"id": "2","title": "Início de Tarefa", "image": "ios-clipboard","disable":true});
    this.actions.push({"id": "3","title": "Finalizar uma tarefa", "image": "ios-checkmark","disable":true});
    this.actions.push({"id": "4","title": "Almoço", "image": "ios-restaurant","disable":true});
    this.actions.push({"id": "5","title": "Volta à atividade", "image": "ios-create","disable":true});
    this.actions.push({"id": "6","title": "Pausa para o café", "image": "ios-cafe","disable":true});
    this.actions.push({"id": "7","title": "Fim do espediente", "image": "ios-moon","disable":true});
  }

  registerCardHTTP(a){
      this.userProv.registerCard(this.record).then(data => {
          if(this.userProv.response["210"] != undefined){
            //alerta de sucesso
              this.showAlert('Sucesso ao cadastrar ação!').then(data => {this.disableActions(a)}).then(e=> {});
          }else{
              this.showAlert('Erro ao registrar ação').then(data => {}).then(e=> {});
            
            // alerta de erro
          }
      }).catch(e => {
              this.showAlert('Erro ao registrar ação').then(data => {}).then(e=> {});

      })
      this.loading.dismissAll();
  }

  showAlert(title){
      let alert = this.alertCtrl.create({
        title: title,
        buttons: ['Ok']
      });
      return alert.present().then(data => {}).catch(e => {});
    }

    disableActions(a){
      switch(a.id) {
            case '1':
                this.actions[0].disable = true;
                for(var i = 1; i<7 ; i++){
                  this.actions[i].disable = null;
                }
                break;
            case '2':
              this.actions[1].disable = true;
                break;
            case '3':
              this.actions[1].disable = null;
                break;
            case '4':
              this.actions[3].disable = true;
                break;
            case '5':
            this.actions[4].disable = true;
                break;
            case '6':
            this.actions[5].disable = true;
                break;  
            case '7':
              this.actions[0].disable = null;
                for(var i = 1; i<7 ; i++){
                  this.actions[i].disable = true;
                }
                break; 
            default:
      }
    }
}
