import { Component } from '@angular/core';
import { IonicPage,NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import {HomePage} from '../home/home';
import { UserProvider } from '../../providers/user-provider';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';



@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class Register {
  userPhoto = 'assets/img/profile.png';
  registerUser = {"name": '', "address": '', "email": '', "office": '', "password":'', "CPF": '', "photo": this.userPhoto };
  buttonProperty = {"register": true};
  options: CameraOptions = {
    quality: 60,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    targetWidth: 100,
    targetHeight: 100,
    mediaType: this.camera.MediaType.PICTURE,
    cameraDirection: this.camera.Direction.FRONT,
    correctOrientation: true
  };
  loading = this.loadingCtrl.create({
    content: 'Por favor espere...',
    dismissOnPageChange: true
  });
  dbOptions = {name: 'nwponto.db',location: 'default'};

   constructor(public navCtrl: NavController,
   public modalCtrl: ModalController,
   public userProv: UserProvider,
   private camera: Camera,
   private alertCtrl: AlertController,
   public loadingCtrl: LoadingController,
   private sqlite: SQLite) {
 }
 
  registerForm() {
    this.loading.present();
    var canGo = this.validateForm().canGo;
    //tenho que tirar isso, pois ele sempre valida, somente para teste!
    canGo = true;
    if(canGo == true){
        this.userProv.registerUser(this.registerUser).then(data => {
           if(this.userProv.response["430"] == undefined){
             this.userProv.userObj = this.userProv.response;
             this.sqlite.create(this.dbOptions)
                  .then((db: SQLiteObject) => {
                      db.executeSql('INSERT INTO user (id, name, email , CPF , address , password , photo , office) VALUES (?,?, ?, ?, ?, ?, ?, ?);', [this.userProv.userObj["id"],this.registerUser.name, this.registerUser.email,this.registerUser.CPF,this.registerUser.address, this.registerUser.password, this.userPhoto, this.registerUser.office])
                        .then(() => {
                          this.loading.dismiss();
                          this.navCtrl.pop();
                          let profileModal = this.modalCtrl.create(HomePage, { user: this.registerUser });
                            profileModal.present().then(data => {
                          });
                        })
                        .catch(e => {
                          this.loading.dismiss();
                          this.showAlert("Erro ao salvar usuário");
                        });
                    })
                    .catch(e => {
                      this.loading.dismiss();
                      this.showAlert("Erro na comunicação com o banco!");
                    });  
            }else{
              this.loading.dismiss();
              this.showAlert("Erro ao registrar usuário!");
            } 
        }).catch(err=>{
            this.loading.dismiss();
            this.showAlert("Erro ao registrar usuário!");
          });
    }else{
          this.loading.dismiss();
          this.showAlert(this.validateForm().subTitle);
      }
  }
  takePict(){
    this.buttonProperty.register = null;
    // this.camera.getPicture(this.options).then((imageData) => {
    //   let base64Image = 'data:image/jpeg;base64,' + imageData;
    //   this.userPhoto = base64Image;
    //   this.buttonProperty.register = null;
    // }, (err) => {
    //   console.log(err);
    // });
  }

  validateForm() : {canGo: Boolean, subTitle: String}{
    var canGo = true;
    var subTitle = "";
    for (var key in this.registerUser) {
        if(this.registerUser[key] == ""){
          canGo = false;
          subTitle = "Campo vazio!";
        }
    }
    if(this.registerUser.password != this.registerUser["passwordConfirm"]){
        canGo = false;
        subTitle = "Passwords diferentes";
    }
    if(this.validateCPF(this.registerUser.CPF) == false){
      canGo = false;
      subTitle = "CPF inválido";
    }
    if(this.validateEmail(this.registerUser.email) == false){
      canGo = false;
      subTitle = "Email inválido";
    }
    return {canGo: canGo, subTitle: subTitle}
  }
  validateCPF(strCPF) : Boolean {
    var Soma;
    var Resto;
    Soma = 0;
      if (strCPF == "00000000000") return false;
        
      for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
      Resto = (Soma * 10) % 11;
      
        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;
      
      Soma = 0;
        for (var i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;
      
        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
  }
  validateEmail(email){
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  showAlert(subTitle){
      let alert = this.alertCtrl.create({
        title: 'Erro ao registrar',
        subTitle: subTitle,
        buttons: ['Ok']
      });
      alert.present();
    }

    saveUser(){
      
    }
}