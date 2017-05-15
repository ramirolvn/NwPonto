import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Register } from '../register/register';
import { UserProvider } from '../../providers/user-provider';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@IonicPage()
@Component({
  selector: 'page-login-page',
  templateUrl: 'login-page.html',
})
export class LoginPage {
 loginUser = {"password":'', "CPF": ''};
  loading = this.loadingCtrl.create({
    content: 'Por favor espere...',
    dismissOnPageChange: true
  });
  dbOptions = {name: 'nwponto.db',location: 'default'};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userProv: UserProvider,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private sqlite: SQLite,
    public modalCtrl: ModalController) {
      
      this.sqlite.create(this.dbOptions)
        .then((db: SQLiteObject) => {
            db.executeSql('SELECT CPF,password FROM user ORDER BY id DESC LIMIT 1;', [])
                      .then(data =>{  
                        this.loading.present();
                          if (data.rows.length > 0) {
                              this.userProv.login(data.rows.item(0).CPF, data.rows.item(0).password).then(data=> {
                                    if(this.userProv.response["431"] == undefined){
                                        this.userProv.userObj = this.userProv.response;
                                        this.homePage();
                                      }else{
                                          this.loading.dismiss();
                                          this.showAlert("Erro no Login");
                                      } 
                              }).catch(err => {
                                this.showAlert("Erro no Login");
                              });
                            }
                    }).catch(e => {
                      this.showAlert("Erro no Login");
                      console.log(e);
                });
          })
          .catch(e => {
            this.showAlert("Erro na comunicação com o banco!");
          });  
  }

  registerForm() {
    this.loading.present();
    var canGo = this.validateForm().canGo;
    //preciso retirar isso depois
    canGo = true;
    if(canGo == true){
      this.userProv.login(this.loginUser.CPF, this.loginUser.password).then(data => {
        if(this.userProv.response["431"] == undefined){
          console.log(this.userProv.response);
          this.userProv.userObj = this.userProv.response;
          this.homePage();
        }else{
          this.loading.dismiss();
          this.showAlert("Erro no Login");
        } 
      })
      .catch(err => {
        this.loading.dismiss();
        this.showAlert(err.error);
      })
    }else{
          this.loading.dismiss();
          this.showAlert(this.validateForm().subTitle);
      }
  }
  
 validateForm() : {canGo: Boolean, subTitle: String}{
    var canGo = true;
    var subTitle = "";
    if(this.loginUser.password == ""){
      canGo = false;
      subTitle= "Senha vazia!";
    }

    if(this.validateCPF(this.loginUser.CPF) == false){
      canGo = false;
      subTitle = "CPF inválido";
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

  showAlert(subTitle){
      let alert = this.alertCtrl.create({
        title: 'Erro ao registrar',
        subTitle: subTitle,
        buttons: ['Ok']
      });
      alert.present();
    }

    registerScreen(){
      this.navCtrl.push(Register);
    }
    
    homePage(){
      let profileModal = this.modalCtrl.create(HomePage, { user: this.loginUser });
      profileModal.present();
    }

}
