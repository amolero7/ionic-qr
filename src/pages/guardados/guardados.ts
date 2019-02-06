import { Component } from '@angular/core';
import { HistorialProvider } from '../../providers/historial/historial';
import {ScanData} from "../../models/scan-data.model";

@Component({
  selector: 'page-guardados',
  templateUrl: 'guardados.html',
})
export class GuardadosPage {

	historial: ScanData[] = [];

  constructor(private _historial:HistorialProvider) {
  }

  ionViewDidLoad() {

  	this.historial = this._historial.cargarHistorial();
  }
  abrirScan(index:number){
  	this._historial.abrirURL(index);

  }
}
