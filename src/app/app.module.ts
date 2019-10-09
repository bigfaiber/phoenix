import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NouisliderModule } from 'ng2-nouislider';
import { NgModule } from '@angular/core';
import { ChartModule } from 'angular-highcharts';
import { DecimalPipe } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MatDatepickerModule, MatNativeDateModule, MatFormFieldModule } from '@angular/material';

/* Routes */
import { APP_ROUTING } from './app.routes';

/* Components */
import { AppComponent } from './app.component';

/* Landing Components */
import { MenuComponent } from './components/landing-components/menu/menu.component';
import { HomeComponent } from './components/landing-components/home/home.component';
import { AboutUsComponent } from './components/landing-components/about-us/about-us.component';
import { FooterComponent } from './components/landing-components/footer/footer.component';
import { MenuDarkComponent } from './components/landing-components/menu-dark/menu-dark.component';
import { BecomeInversorComponent } from './components/landing-components/become-inversor/become-inversor.component';
import { SignInComponent } from './components/landing-components/sign-in/sign-in.component';
import { CustomerRegistrationComponent } from './components/landing-components/customer-registration/customer-registration.component';
import { InvestorRegistrationComponent } from './components/landing-components/investor-registration/investor-registration.component';
import { PasswordResetComponent } from './components/landing-components/password-reset/password-reset.component';
import { RequestNewPasswordComponent } from './components/landing-components/request-new-password/request-new-password.component';
import { AdminLoginComponent } from './components/landing-components/admin-login/admin-login.component';

/* Customer Registration Components */
import { CustomerRegistrationContainerComponent } from './components/customer-registration-components/customer-registration-container/customer-registration-container.component';
import { CustomerRegistrationStep1Component } from './components/customer-registration-components/customer-registration-step1/customer-registration-step1.component';
import { CustomerRegistrationStep2Component } from './components/customer-registration-components/customer-registration-step2/customer-registration-step2.component';
import { CustomerRegistrationStep3Component } from './components/customer-registration-components/customer-registration-step3/customer-registration-step3.component';
import { CustomerRegistrationStep4Component } from './components/customer-registration-components/customer-registration-step4/customer-registration-step4.component';
import { CustomerRegistrationStep5Component } from './components/customer-registration-components/customer-registration-step5/customer-registration-step5.component';


/* Investor Registration Components */
import { InvestorRegistrationContainerComponent } from './components/investor-registration-components/investor-registration-container/investor-registration-container.component';
import { InvestorRegistrationStep1Component } from './components/investor-registration-components/investor-registration-step1/investor-registration-step1.component';
import { InvestorRegistrationStep2Component } from './components/investor-registration-components/investor-registration-step2/investor-registration-step2.component';
import { InvestorRegistrationStep3Component } from './components/investor-registration-components/investor-registration-step3/investor-registration-step3.component';
import { InvestorRegistrationStep4Component } from './components/investor-registration-components/investor-registration-step4/investor-registration-step4.component';
import { InvestorRegistrationStep5Component } from './components/investor-registration-components/investor-registration-step5/investor-registration-step5.component';
import { InvestorRegistrationStep6Component } from './components/investor-registration-components/investor-registration-step6/investor-registration-step6.component';

/* Client Profile Components */
import { ClientProfileComponent } from './components/customer-profile-components/client-profile/client-profile.component';
import { MenuUserComponent } from './components/customer-profile-components/menu-user/menu-user.component';
import { CreateProjectComponent } from './components/customer-profile-components/create-project/create-project.component';
import { ProjectContainerComponent } from './components/customer-profile-components/project-container/project-container.component';
import { ClientReceiptsComponent } from './components/customer-profile-components/client-receipts/client-receipts.component';
import { ProfileEditionComponent } from './components/customer-profile-components/profile-edition/profile-edition.component';
import { UpdateCustomerFilesComponent } from './components/customer-profile-components/update-customer-files/update-customer-files.component';
import { CustomerProjectViewerComponent } from './components/customer-profile-components/customer-project-viewer/customer-project-viewer.component';
import { CustomerHistoryComponent } from './components/customer-profile-components/customer-history/customer-history.component';
import { CustomerProfileWrapperComponent } from './components/customer-profile-components/customer-profile-wrapper/customer-profile-wrapper.component';
import { ClientProsconsComponent } from './components/customer-profile-components/client-proscons/client-proscons.component';

/* Investor Profile Components */
import { InvestorDarkMenuComponent } from './components/investor-profile-components/investor-dark-menu/investor-dark-menu.component';
import { InvestorProfileEditionComponent } from './components/investor-profile-components/investor-profile-edition/investor-profile-edition.component';
import { InvestorProjectComponent } from './components/investor-profile-components/investor-project/investor-project.component';
import { InvestorProfileComponent } from './components/investor-profile-components/investor-profile/investor-profile.component';
import { InvestmentsComponent } from './components/investor-profile-components/investments/investments.component';
import { PaymentHistoryComponent } from './components/investor-profile-components/payment-history/payment-history.component';
import { InvestmentComponent } from './components/investor-profile-components/investment/investment.component';
import { InvestmentFileComponent } from './components/investor-profile-components/investment-file/investment-file.component';
import { UpdateInvestorFilesComponent } from './components/investor-profile-components/update-investor-files/update-investor-files.component';
import { InvestorHistoryComponent } from './components/investor-profile-components/investor-history/investor-history.component';
import { InvestorProfileWrapperComponent } from './components/investor-profile-components/investor-profile-wrapper/investor-profile-wrapper.component';
import { InvestorCustomerProfileComponent } from './components/investor-profile-components/client-profile-components/investor-customer-profile/investor-customer-profile.component';
import { InvestorBalanceComponent } from './components/investor-profile-components/investor-balance/investor-balance.component';
import { InvestorNavComponent } from './components/investor-profile-components/investor-nav/investor-nav.component';
import { MissingAccountComponent } from './components/investor-profile-components/missing-account/missing-account.component';

/* Admin Components */
import { MenuAdminComponent } from './components/admin/menu-admin/menu-admin.component';
import { AdminProfileWrapperComponent } from './components/admin/admin-profile-wrapper/admin-profile-wrapper.component';
import { ProgSettingsComponent } from './components/admin/testing/prog-settings/prog-settings.component';

/* Business Admin Components */
import { AdminMatchComponent } from './components/admin/admin-business-components/admin-match/admin-match.component';
import { AdminSingleMatchComponent } from './components/admin/admin-business-components/admin-single-match/admin-single-match.component';
import { AdminCustomerProfileComponent } from './components/admin/admin-business-components/admin-customer-profile/admin-customer-profile.component';
import { AdminInvestorProfileComponent } from './components/admin/admin-business-components/admin-investor-profile/admin-investor-profile.component';
import { AllProjectsComponent } from './components/admin/admin-business-components/all-projects/all-projects.component';
import { MatchVisualizerComponent } from './components/admin/admin-business-components/match-visualizer/match-visualizer.component';
import { ProjectsHistoryComponent } from './components/admin/admin-business-components/projects-history/projects-history.component';
import { AdminProfitabilitiesComponent } from './components/admin/admin-business-components/admin-profitabilities/admin-profitabilities.component';

/* Customer Admin Components */
import { AdminCustomersComponent } from './components/admin/admin-customer-components/admin-customers/admin-customers.component';
import { AdminCustomerDocsComponent } from './components/admin/admin-customer-components/admin-customer-docs/admin-customer-docs.component';
import { AdminCustomerDreamComponent } from './components/admin/admin-customer-components/admin-customer-dream/admin-customer-dream.component';
import { AdminCustomerFormComponent } from './components/admin/admin-customer-components/admin-customer-form/admin-customer-form.component';
import { AdminCustomerOpinionComponent } from './components/admin/admin-customer-components/admin-customer-opinion/admin-customer-opinion.component';
import { CreateCustomerDreamComponent } from './components/admin/admin-customer-components/create-customer-dream/create-customer-dream.component';

/* Investor Admin Components */
import { AdminInvestorsComponent } from './components/admin/admin-investor-components/admin-investors/admin-investors.component';
import { AdminInvestorDocsComponent } from './components/admin/admin-investor-components/admin-investor-docs/admin-investor-docs.component';
import { AdminInvestorFormComponent } from './components/admin/admin-investor-components/admin-investor-form/admin-investor-form.component';
import { AdminInvestorProjectComponent } from './components/admin/admin-investor-components/admin-investor-project/admin-investor-project.component';
import { AdminInvestorPaymentHistoryComponent } from './components/admin/admin-investor-components/admin-investor-payment-history/admin-investor-payment-history.component';
import { AdminInvestorFileManagementComponent } from './components/admin/admin-investor-components/admin-investor-file-management/admin-investor-file-management.component';
import { AdminInvestorAccountsComponent } from './components/admin/admin-investor-components/admin-investor-accounts/admin-investor-accounts.component';

/* Utilities Components */
import { BirdComponent } from './components/utilities-components/bird/bird.component';

/* Pipes */
import { MyCurrencyPipe } from './pipes/currency/my-currency.pipe';

/* Directives */
import { MyCurrencyFormatterDirective } from './directives/currency/my-currency-formatter.directive';

/* Services */
import { AuthService } from './auth.service';
import { DataService } from './services/data-service/data.service';
import { CustomerRegistrationService } from './services/customer-registration/customer-registration.service';
import { InvestorRegistrationService } from './services/investor-registration/investor-registration.service';
import { SessionService } from './services/session/session.service';
import { CustomerManagementService } from './services/customerManagement/customer-management.service';
import { InvestorManagementService } from './services/investor-management/investor-management.service';
import { AdminManagementService } from './services/admin-management/admin-management.service';
import { UtilitiesService } from './services/utilities-service/utilities.service';
import { ProfileChangeNotifierService } from './services/profile-change-notifier/profile-change-notifier.service';

/* Guards */
import { IsLoggedInGuard } from './guards/auth/is-logged-in.guard';

/* Customer Guards */
import { CustomerGuard } from './guards/customer/customer.guard';
import { AvoidCustomerRegistrationGuard } from './guards/customer/avoid-customer-registration.guard';
import { CustomerProfileGuard } from './guards/customer/customer-profile.guard';

/* Investor Guards */
import { InvestorGuard } from './guards/investor/investor.guard';
import { AvoidInvestorRegistrationGuard } from './guards/investor/avoid-investor-registration.guard';
import { InvestorProfileGuard } from './guards/investor/investor-profile.guard';

/* Admin Guards */
import { AdminGuard } from './guards/admin/admin.guard';

/* Share Components */
import { ProjectDataComponent } from './components/share/project-data/project-data.component';
import { ProfitabilitiesChartComponent } from './components/share/profitabilities-chart/profitabilities-chart.component';
import { MissingDocsComponent } from './components/share/missing-docs/missing-docs.component';
import { CustomerNavComponent } from './components/customer-profile-components/customer-nav/customer-nav.component';
import { CoolProjectLinkComponent } from './components/share/cool-project-link/cool-project-link.component';
import { DataProjectLinkComponent } from './components/share/data-project-link/data-project-link.component';
import { NewProjectLinkComponent } from './components/share/new-project-link/new-project-link.component';
import { ActivePortfolioComponent } from './components/share/active-portfolio/active-portfolio.component';
import { StepOneComponent } from './components/share/registration/step-one/step-one.component';
import { StepTwoComponent } from './components/share/registration/step-two/step-two.component';
import { FilesUploadComponent } from './components/share/files-upload/files-upload.component';
import { UploadFilesComponent } from './components/share/registration/upload-files/upload-files.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    AboutUsComponent,
    FooterComponent,
    MenuDarkComponent,
    BecomeInversorComponent,
    SignInComponent,
    CustomerRegistrationComponent,
    InvestorRegistrationComponent,
    ClientProfileComponent,
    MenuUserComponent,
    CreateProjectComponent,
    CustomerRegistrationStep1Component,
    CustomerRegistrationStep2Component,
    CustomerRegistrationStep3Component,
    CustomerRegistrationStep4Component,
    CustomerRegistrationStep5Component,
    InvestorRegistrationContainerComponent,
    InvestorRegistrationStep1Component,
    InvestorRegistrationStep2Component,
    InvestorRegistrationStep3Component,
    InvestorRegistrationStep4Component,
    InvestorRegistrationStep5Component,
    InvestorRegistrationStep6Component,
    ProjectContainerComponent,
    ClientReceiptsComponent,
    ProfileEditionComponent,
    InvestorDarkMenuComponent,
    InvestorProfileEditionComponent,
    InvestorProjectComponent,
    InvestorProfileComponent,
    InvestmentsComponent,
    PaymentHistoryComponent,
    InvestmentComponent,
    InvestmentFileComponent,
    CustomerRegistrationContainerComponent,
    AdminMatchComponent,
    MenuAdminComponent,
    AdminSingleMatchComponent,
    AdminCustomerProfileComponent,
    AdminInvestorProfileComponent,
    AdminCustomersComponent,
    AdminCustomerDocsComponent,
    AdminCustomerDreamComponent,
    AdminCustomerFormComponent,
    AdminInvestorsComponent,
    AdminInvestorDocsComponent,
    AdminInvestorFormComponent,
    AdminInvestorProjectComponent,
    AdminInvestorPaymentHistoryComponent,
    AdminInvestorFileManagementComponent,
    MyCurrencyPipe,
    MyCurrencyFormatterDirective,
    UpdateCustomerFilesComponent,
    UpdateInvestorFilesComponent,
    CustomerProfileWrapperComponent,
    InvestorProfileWrapperComponent,
    AdminProfileWrapperComponent,
    PasswordResetComponent,
    RequestNewPasswordComponent,
    CustomerProjectViewerComponent,
    AdminLoginComponent,
    AllProjectsComponent,
    MatchVisualizerComponent,
    ProjectsHistoryComponent,
    CustomerHistoryComponent,
    InvestorHistoryComponent,
    InvestorCustomerProfileComponent,
    BirdComponent,
    InvestorBalanceComponent,
    AdminCustomerOpinionComponent,
    ClientProsconsComponent,
    CreateCustomerDreamComponent,
    AdminInvestorAccountsComponent,
    AdminProfitabilitiesComponent,
    ProjectDataComponent,
    ProfitabilitiesChartComponent,
    InvestorNavComponent,
    MissingDocsComponent,
    CustomerNavComponent,
    CoolProjectLinkComponent,
    DataProjectLinkComponent,
    NewProjectLinkComponent,
    MissingAccountComponent,
    ProgSettingsComponent,
    ActivePortfolioComponent,
    StepOneComponent,
    StepTwoComponent,
    FilesUploadComponent,
    UploadFilesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    InfiniteScrollModule,
    NouisliderModule,
    ChartModule,
    InputSwitchModule,
    DialogModule,
    ButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    APP_ROUTING
  ],
  providers: [
    MyCurrencyPipe,
    DataService,
    CustomerRegistrationService,
    InvestorRegistrationService,
    SessionService,
    IsLoggedInGuard,
    CustomerGuard,
    AvoidCustomerRegistrationGuard,
    CustomerManagementService,
    InvestorGuard,
    AvoidInvestorRegistrationGuard,
    CustomerProfileGuard,
    InvestorProfileGuard,
    InvestorManagementService,
    AdminGuard,
    AdminManagementService,
    ProfileChangeNotifierService,
    UtilitiesService,
    DecimalPipe,
    MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
