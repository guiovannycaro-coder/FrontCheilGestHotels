
import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { serverRoutes } from './app.routes.server';

@NgModule({
  imports: [
    AppModule,
    ServerModule
  ],
  providers: [
    provideHttpClient(withFetch()),
    provideServerRouting(serverRoutes)
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
