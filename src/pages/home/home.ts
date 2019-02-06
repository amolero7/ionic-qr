import { Component } from '@angular/core';
import { NavController, ToastController, Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


import {HistorialProvider} from "../../providers/historial/historial"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private platform:Platform, public navCtrl: NavController, private barcodeScanner: BarcodeScanner, private toastCtrl: ToastController, private _historial: HistorialProvider) {

  }
	scan(){

		if(!this.platform.is('cordova')){
			//this._historial.agregarHistorial("http://google.com");
			//this._historial.agregarHistorial("geo:51.678418,7.809007");
			/*this._historial.agregarHistorial( `BEGIN:VCARD
VERSION:2.1
N:Kent;Clark
FN:Clark Kent
ORG:
TEL;HOME;VOICE:12345
TEL;TYPE=cell:67890
ADR;TYPE=work:;;;
EMAIL:clark@superman.com
END:VCARD` );*/
		//this._historial.agregarHistorial("MATMSG:TO:Enviar@email.a;SUB:Asunto del mail;BODY:Descripcion;");

			return;

		}

		this.barcodeScanner.scan().then((barcodeData)=>{
			console.log("Resultado: ", barcodeData.text);
			console.log("Formato: ", barcodeData.format);
			console.log("Cancelled: ", barcodeData.cancelled); 
			if(barcodeData.cancelled == false &&barcodeData.text != null){
				this._historial.agregarHistorial(barcodeData.text);
				
			}

		},(err)=>{
			console.log("Error: ", err);
			this.mostrarError("Error: "+err);
		});
}

    mostrarError(mensaje:string){
    	let toast = this.toastCtrl.create({
      		message: mensaje,
      		duration: 2500
    	});
    	toast.present();
    }
  
}
