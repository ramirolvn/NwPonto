import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import 'rxjs/add/operator/map';
import CryptoJS from 'crypto-js';

@Injectable()
export class UserProvider {
  urlAPI = 'https://des.gpm.srv.br/NWPontoTest/api.php';
  headers = new Headers();
  userObj = {};
  response = {};

  constructor(public http: HTTP) {
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Authorization', 'a68f681e49e3a22df36d49f95be512e8');
    this.http.setHeader("Authorization","a68f681e49e3a22df36d49f95be512e8");
  }

  registerUser(user){
        user.password = CryptoJS.MD5(user.password).toString();
        try{
          user = JSON.stringify(user);
        }
        catch(e){
          console.error("Erro ao criar JSON");
      }
        return this.http.post(this.urlAPI,{"registerUser": user},this.headers).then(data => {
          try {
              this.response = JSON.parse(data.data);
            } catch(e) {
                console.error("Erro pegar JSON");
            }
          // console.log(data.headers);
      })
      .catch(error => {
          console.log(error.status);
          console.log(this.headers);
          console.log(error.error); // error message as string
          console.log(error.headers);
      });   
  }

    login(cpf,password){
      var token = CryptoJS.MD5(cpf+password);
        return this.http.get(this.urlAPI, {"login":token +"c="+cpf}, this.headers)
        .then(data => {
            try {
              this.response = JSON.parse(data.data);
              console.log(data.headers);
              console.log(data.data.message);
            } catch(e) {
                console.error("Erro pegar JSON");
            }
        })
        .catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });
  }


}
