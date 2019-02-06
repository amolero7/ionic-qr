import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AgmCoreModule } from '@agm/core';
import { Contacts} from '@ionic-native/contacts';
import { EmailComposer } from '@ionic-native/email-composer';



import { MyApp } from './app.component';
import { HomePage, TabsPage, GuardadosPage, MapaPage } from '../pages/index.paginas';
import { HistorialProvider } from '../providers/historial/historial';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage, GuardadosPage, MapaPage
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCU7xUV_1BdPs9l2bxVErDPQpd0oe8Tbuw'
    }),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage, GuardadosPage, MapaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HistorialProvider, 
    Contacts,
    EmailComposer

  ]
})
export class AppModule {}
