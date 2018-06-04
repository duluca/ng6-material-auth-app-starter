import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterialModule } from './material.module'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { HomeComponent } from './home/home.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component'
import { SimpleDialogComponent, UiService } from './common/ui.service'
import { LoginComponent } from './login/login.component'
import { FlexLayoutModule } from '@angular/flex-layout'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AuthGuard } from './auth/auth-guard.service';
import { AuthService } from './auth/auth.service';
import { AuthHttpInterceptor } from './auth/auth-http-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    LoginComponent,
    NavigationMenuComponent,
    SimpleDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  providers: [AuthService,
    AuthGuard,
    UiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
