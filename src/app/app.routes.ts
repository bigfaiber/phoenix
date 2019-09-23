import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

/* Landing Components */
import { HomeComponent } from './components/landing-components/home/home.component';
import { AboutUsComponent } from './components/landing-components/about-us/about-us.component';
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
import { UpdateInvestorFilesComponent } from './components/investor-profile-components/update-investor-files/update-investor-files.component';

/* Customer Profile Components */
import { ClientProfileComponent } from './components/customer-profile-components/client-profile/client-profile.component'
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
import { InvestorProfileEditionComponent } from './components/investor-profile-components/investor-profile-edition/investor-profile-edition.component';
import { InvestorProjectComponent } from './components/investor-profile-components/investor-project/investor-project.component';
import { InvestorProfileComponent } from './components/investor-profile-components/investor-profile/investor-profile.component';
import { InvestmentsComponent } from './components/investor-profile-components/investments/investments.component';
import { PaymentHistoryComponent } from './components/investor-profile-components/payment-history/payment-history.component';
import { InvestmentComponent } from './components/investor-profile-components/investment/investment.component';
import { InvestmentFileComponent } from './components/investor-profile-components/investment-file/investment-file.component';
import { InvestorHistoryComponent } from './components/investor-profile-components/investor-history/investor-history.component';
import { InvestorProfileWrapperComponent } from './components/investor-profile-components/investor-profile-wrapper/investor-profile-wrapper.component';
import { InvestorCustomerProfileComponent } from './components/investor-profile-components/client-profile-components/investor-customer-profile/investor-customer-profile.component';
import { InvestorBalanceComponent } from './components/investor-profile-components/investor-balance/investor-balance.component';

/* Admin Components */
import { ProgSettingsComponent } from './components/admin/testing/prog-settings/prog-settings.component';

/* Business Admin Components */
import { AdminProfileWrapperComponent } from './components/admin/admin-profile-wrapper/admin-profile-wrapper.component';
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

const APP_ROUTES: Routes = [

    {
      path: 'inicio',
      component: HomeComponent
    },
    {
      path: 'quienes-somos',
      component: AboutUsComponent
    },
    {
      path: 'conviertete-en-inversionista',
      component: BecomeInversorComponent
    },
    {
      path: 'new-password',
      component: PasswordResetComponent,
      canActivate: [ IsLoggedInGuard ]
    },
    {
      path: 'password-request',
      component: RequestNewPasswordComponent,
      canActivate: [ IsLoggedInGuard ]
    },
    {
      path: 'iniciar-sesion',
      component: SignInComponent,
      canActivate: [ IsLoggedInGuard ]
    },
    {
      path: 'admin-login',
      component: AdminLoginComponent,
      canActivate: [ IsLoggedInGuard ]
    },
    {
      path: 'formulario-cliente',
      component: CustomerRegistrationContainerComponent,
      children: [
        {
          path: 'paso-1',
          component: CustomerRegistrationStep1Component,
          canActivate: [ AvoidCustomerRegistrationGuard ]
        },
        {
          path: 'paso-2',
          component: CustomerRegistrationStep2Component,
          canActivate: [ CustomerGuard ]
        },
        {
          path: 'paso-3',
          component: CustomerRegistrationStep3Component,
          canActivate: [ CustomerGuard ]
        },
        {
          path: 'paso-4',
          component: CustomerRegistrationStep5Component,
          canActivate: [ CustomerGuard ]
        }
      ]
    },
    {
      path: 'formulario-inversionista',
      component: InvestorRegistrationContainerComponent,
      children: [
        {
          path: 'paso-1',
          component: InvestorRegistrationStep1Component,
          canActivate: [ AvoidInvestorRegistrationGuard ]
        },
        {
          path: 'paso-2',
          component: InvestorRegistrationStep2Component,
          canActivate: [ InvestorGuard ]
        },
        {
          path: 'paso-3',
          component: InvestorRegistrationStep3Component,
          canActivate: [ InvestorGuard ]
        },
        {
          path: 'paso-4',
          component: InvestorRegistrationStep6Component,
          canActivate: [ InvestorGuard ]
        }
      ]
    },
    {
      path: 'registro-cliente',
      component: CustomerRegistrationComponent,
      canActivate: [ AvoidCustomerRegistrationGuard ]
    },
    {
      path: 'registro-inversionista',
      component: InvestorRegistrationComponent,
      canActivate: [ AvoidInvestorRegistrationGuard ]
    },
    /* Customer profile routes */
    {
        path: 'cliente',
        component: CustomerProfileWrapperComponent,
        canActivate: [ CustomerProfileGuard ],
        children: [
            {
                path: '',
                component: ClientProfileComponent,
                canActivate: [ CustomerProfileGuard ]
            },
            {
                path: 'perfil',
                component: ClientProfileComponent,
                canActivate: [ CustomerProfileGuard ]
            },
            {
                path: 'crear-proyecto',
                component: CreateProjectComponent,
                canActivate: [ CustomerProfileGuard ]
            },
            {
                path: 'proyecto',
                component: ProjectContainerComponent,
                canActivate: [ CustomerProfileGuard ]
            },
            {
                path: 'recibos-proyecto',
                component: ClientReceiptsComponent,
                canActivate: [ CustomerProfileGuard ]
            },
            {
                path: 'editar-perfil',
                component: ProfileEditionComponent,
                canActivate: [ CustomerProfileGuard ]
            },
            {
                path: 'subir-archivos',
                component: UpdateCustomerFilesComponent,
                canActivate: [ CustomerProfileGuard ]
            },
            {
                path: 'ver-proyecto',
                component: CustomerProjectViewerComponent,
                canActivate: [ CustomerProfileGuard ]
            },
            {
                path: 'historial',
                component: CustomerHistoryComponent,
                canActivate: [ CustomerProfileGuard ]
            },
            {
                path: 'proscons',
                component: ClientProsconsComponent,
                canActivate: [ CustomerProfileGuard ]
            }
        ]
    },
    /* Investor profile routes */
    {
        path: 'inversionista',
        component: InvestorProfileWrapperComponent,
        canActivate: [ InvestorProfileGuard ],
        children: [
            {
                path: '',
                component: InvestorProfileComponent,
                canActivate: [ InvestorProfileGuard ]
            },
            {
                path: 'editar-perfil',
                component: InvestorProfileEditionComponent,
                canActivate: [ InvestorProfileGuard ]
            },
            {
                path: 'proyecto',
                component: InvestorProjectComponent,
                canActivate: [ InvestorProfileGuard ]
            },
            {
                path: 'perfil',
                component: InvestorProfileComponent,
                canActivate: [ InvestorProfileGuard ]
            },
            {
                path: 'mis-inversiones',
                component: InvestmentsComponent,
                canActivate: [ InvestorProfileGuard ]
            },
            {
                path: 'historial-pagos',
                component: PaymentHistoryComponent,
                canActivate: [ InvestorProfileGuard ]
            },
            {
                path: 'inversion',
                component: InvestmentComponent,
                canActivate: [ InvestorProfileGuard ]
            },
            {
                path: 'archivo-inversion',
                component: InvestmentFileComponent,
                canActivate: [ InvestorProfileGuard ]
            },
            {
                path: 'subir-archivos',
                component: UpdateInvestorFilesComponent,
                canActivate: [ InvestorProfileGuard ]
            },
            {
                path: 'historial',
                component: InvestorHistoryComponent,
                canActivate: [ InvestorProfileGuard ]
            },
            {
                path: 'perfil-cliente',
                component: InvestorCustomerProfileComponent,
                canActivate: [ InvestorProfileGuard ]
            },
            {
                path: 'balance',
                component: InvestorBalanceComponent,
                canActivate: [ InvestorProfileGuard ]
            }
        ]
    },
    /* Admin routes */
    {
        path: 'admin',
        component: AdminProfileWrapperComponent,
        children: [
            {
                path: '',
                component: AdminMatchComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'proyectos',
                component: AllProjectsComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'historial',
                component: ProjectsHistoryComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'proyecto',
                component: MatchVisualizerComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'crear-proyecto',
                component: CreateCustomerDreamComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'match',
                component: AdminMatchComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'datos-match',
                component: AdminSingleMatchComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'perfil-cliente',
                component: AdminCustomerProfileComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'perfil-inversionista',
                component: AdminInvestorProfileComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'cuentas-inversionista',
                component: AdminInvestorAccountsComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'clientes',
                component: AdminCustomersComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'documentos-cliente',
                component: AdminCustomerDocsComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'sueno-cliente',
                component: AdminCustomerDreamComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'formulario-cliente',
                component: AdminCustomerFormComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'inversionistas',
                component: AdminInvestorsComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'documentos-inversionista',
                component: AdminInvestorDocsComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'formulario-inversionista',
                component: AdminInvestorFormComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'proyecto-inversionista',
                component: AdminInvestorProjectComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'historial-pagos-inversionista',
                component: AdminInvestorPaymentHistoryComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'archivos-inversionista',
                component: AdminInvestorFileManagementComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'cliente-proscons',
                component: AdminCustomerOpinionComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'inversionista-proscons',
                component: AdminCustomerOpinionComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'rentabilidad',
                component: AdminProfitabilitiesComponent,
                canActivate: [ AdminGuard ]
            },
            {
                path: 'prog-settings',
                component: ProgSettingsComponent,
                canActivate: [ AdminGuard ]
            }
        ]
    },
    {
      path: '**',
      pathMatch:'full',
      redirectTo: 'inicio'
    }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: false });
