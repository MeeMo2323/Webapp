import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { AppComponent } from '../app.component';

import { Storage } from '@ionic/storage';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public sUser = "";
  public sPass="";

  public appProfile = {
    U_ID: "",
    U_ROLE: "",
    U_NAME: "",
    token:""
  };

  public oUser = {
    U_NAME: "",
    U_PASS: ""
  }

  public loading = this.loadingCtrl.create({ cssClass: 'my-custom-class', message: 'Loading...', duration: 5000 });

  constructor(private loadingCtrl: LoadingController,private storage: Storage,private myAppComp : AppComponent,private http:HttpClient,public toastController: ToastController) { }

  ngOnInit() {
    //console.log("API is :"+this.myAppComp.strAPIURL);
  }

  ngAfterViewInit() {
    this.myAppComp.LoggedIn = false;
  }
  
  showToast( strMsg , strColor) {
    this.toastController.create({
      message: strMsg,
      duration: 3000,
      position: 'top',
      color:strColor ,
      buttons: [
         {
          side: 'end',
          text: 'Close',
          role: 'cancel',
          handler: () => {
            console.log('Close clicked');
          }
        }
      ]
    }).then((obj) => {
      obj.present();
    });
  }


 /* validLogin() 
  {
    this.presentLoading();
    let postData = {U_NAME : this.sUser ,U_PASS :this.sPass};
    this.http.post(this.myAppComp.strAPIURL+'/logIn2',postData,{responseType: 'text'})
    .subscribe(data=> {
      console.log('user : '+JSON.stringify(data));
      this.myAppComp.appProfile = JSON.parse(data);
     
      if(Number(this.myAppComp.appProfile.U_ID)!=-1)
      {
        //this.storage.remove('appProfile');
        this.storage.set('appProfile', this.myAppComp.appProfile);
        this.showToast("Log in completed!","success");
        console.log('redirect to log in page');
        //this.myAppComp.navigateTo('/dara-list');
      }
      else
      {
        this.storage.remove('appProfile');
        this.showToast("Please check you username or password","danger");
      }
  
      // Load from storage
      //this.storage.get('appProfile').then((value) => {
        //alert('value for my_key:' + value);
      //});


      //if()
        //router.navigate(['/role']);
      //var decoded = jwt.verify(this.arrVal.token, 'shhhhh');
      //alert(decoded);
      //console.log(decoded.foo) // bar
     
    });
    
   
    
  }*/

  validLogin2 () 
  {
    this.showLoading();
    let formData: FormData = new FormData();
    formData.append('User', JSON.stringify(this.oUser));

    let postData = {U_NAME : this.sUser ,U_PASS :this.sPass};
    this.http.post(this.myAppComp.strAPIURL+'/logIn',formData,{responseType: 'text'})
    .subscribe(data=> {
      this.hideLoading();
      //console.log('user : '+JSON.stringify(data));
      this.myAppComp.appProfile = JSON.parse(data);
     
      if(Number(this.myAppComp.appProfile.U_ID)!=-1)
      {
        this.myAppComp.LoggedIn = true;
        //this.storage.remove('appProfile');
        this.storage.set('appProfile', this.myAppComp.appProfile).then(res => {
          this.showToast("Log in completed!","success");
          //console.log('redirect to log in page');        
          this.myAppComp.navigateTo('/receive-list');
        });
     
      }else{
        this.storage.remove('appProfile');
        this.showToast("Please check you username or password","danger");
      }
  
      //var decoded = jwt.verify(this.arrVal.token, 'shhhhh');
      //console.log(decoded.foo) // bar
     
    },
    err=>{
      console.log("status code--->"+err.status)
    });
    
   
    
  }

  async showLoading() { (await this.loading).present(); }
  async hideLoading() { (await this.loading).dismiss(); }

}
