import { Injectable } from '@angular/core';
import { ScanData } from "../../models/scan-data.model";
import { InAppBrowser } from '@ionic-native/in-app-browser'; 
import {ModalController, Platform, ToastController} from "ionic-angular";
import {MapaPage} from "../../pages/mapa/mapa";
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';

import { EmailComposer } from '@ionic-native/email-composer';

@Injectable()
export class HistorialProvider {

	private _historial:ScanData[] = [];

  constructor(private emailComposer: EmailComposer,private toastCtrl: ToastController, private platform:Platform, private iab: InAppBrowser, private modalCtrl:ModalController, private contacts: Contacts) {

  }
  cargarHistorial(){
  	return this._historial;
  }
  agregarHistorial(texto:string){
  	let data = new ScanData(texto);
  	this._historial.unshift(data);
  	console.log(this._historial);
  	this.abrirURL(0);
  }

  abrirURL(index:number){
  	let scanData = this._historial[index];
  	console.log(scanData);

  	switch(scanData.tipo){
  		case "http":
  			this.iab.create(scanData.info, "_system");
  		break

      case "mapa":
        this.modalCtrl.create(MapaPage, {coords: scanData.info}).present();
        break;

      case "contacto":
        this.crearContacto(scanData.info);

        break;
      case "email":
        this.enviarEmail(scanData.info);
        break;

  		default:
  		console.log("No soportado");
  	}
  	


  }
  private enviarEmail(texto:string){
    let campos:string[] = texto.split("MATMSG:TO:")
    let campo1:string[] = campos[1].split(";SUB:");
    let campo2:string[] = campo1[1].split(";BODY:");
    let descripcion:string = campo2[1].replace(";","");

    campo2[1] = campo2[1].replace(/;/g,"");
    console.log("Email: "+campo1[0]);
    console.log("Asunto: "+campo2[0]);
    console.log("Descripcion: "+campo2[1]);

    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
          //Now we know we can send
        }
      });

      let email = {
        to: campo1[0],
        subject: campo2[0],
        body: campo2[1],
        isHtml: true
      };

// Send a text message using default options
this.emailComposer.open(email);
}
  private crearContacto(texto:string){
    let campos:any = this.parse_vcard(texto);
    console.log(campos);

    let nombre = campos.fn;
    let tel = campos.tel[0].value[0];


    if(!this.platform.is('cordova')){
      console.warn("Estoy en pc, no se puede crear");
      return;
    }

    let contact: Contact = this.contacts.create();
    contact.name =new ContactName(null, nombre);
    contact.phoneNumbers = [new ContactField('mobile', tel)];
    contact.save().then(
      ()=> this.crearToast("Contacto  " + nombre + " creado!"),
      (error)=> this.crearToast("Error: " + error )
  );


  }
  private crearToast(texto:string){
    this.toastCtrl.create({
      message: texto,
      duration: 2500
    }).present();
  }
  private parse_vcard( input:string ) {

    var Re1 = /^(version|fn|title|org):(.+)$/i;
    var Re2 = /^([^:;]+);([^:]+):(.+)$/;
    var ReKey = /item\d{1,2}\./;
    var fields = {};

    input.split(/\r\n|\r|\n/).forEach(function (line) {
        var results, key;

        if (Re1.test(line)) {
            results = line.match(Re1);
            key = results[1].toLowerCase();
            fields[key] = results[2];
        } else if (Re2.test(line)) {
            results = line.match(Re2);
            key = results[1].replace(ReKey, '').toLowerCase();

            var meta = {};
            results[2].split(';')
                .map(function (p, i) {
                var match = p.match(/([a-z]+)=(.*)/i);
                if (match) {
                    return [match[1], match[2]];
                } else {
                    return ["TYPE" + (i === 0 ? "" : i), p];
                }
            })
                .forEach(function (p) {
                meta[p[0]] = p[1];
            });

            if (!fields[key]) fields[key] = [];

            fields[key].push({
                meta: meta,
                value: results[3].split(';')
            })
        }
    });

    return fields;
};
}
