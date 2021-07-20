import { NgModule } from '@angular/core';
import { TabsPage } from './tabs.page';
import { AuthGuardService} from '../providers/auth-guard/auth-guard.service';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'home',  loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuardService]},
      {
        path: 'mining',
        children: [
          {
            path: '',
            loadChildren: () =>
            import('../pages/mining/mining.module').then(m => m.MiningPageModule)
          }
        ]
      },

      {
        path: 'login',
        loadChildren: () => import('../pages/login/login.module').then( m => m.LoginPageModule)
      },
      {
        path: 'signup',
        loadChildren: () => import('../pages/signup/signup.module').then( m => m.SignupPageModule)
      },
      {
        path: 'welcome',
        loadChildren: () => import('../pages/welcome/welcome.module').then( m => m.WelcomePageModule)
      },
      {
        path: 'forgotpwd',
        loadChildren: () => import('../pages/forgotpwd/forgotpwd.module').then( m => m.ForgotpwdPageModule)
      },
      {
        path: 'resetpwd',
        loadChildren: () => import('../pages/resetpwd/resetpwd.module').then( m => m.ResetpwdPageModule)
      },
      {
        path: 'verifyotp',
        loadChildren: () => import('../pages/verifyotp/verifyotp.module').then( m => m.VerifyotpPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../pages/profile/profile.module').then( m => m.ProfilePageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'settings',
        loadChildren: () => import('../pages/settings/settings.module').then( m => m.SettingsPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'wallet',
        loadChildren: () => import('../pages/wallet/wallet.module').then( m => m.WalletPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'faqs',
        loadChildren: () => import('../pages/faqs/faqs.module').then( m => m.FaqsPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'questions',
        loadChildren: () => import('../pages/questions/questions.module').then( m => m.QuestionsPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'bankaccounts',
        loadChildren: () => import('../pages/bankaccounts/bankaccounts.module').then( m => m.BankaccountsPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'notifications',
        loadChildren: () => import('../pages/notifications/notifications.module').then( m => m.NotificationsPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'upload-docs',
        loadChildren: () => import('../pages/upload-docs/upload-docs.module').then( m => m.UploadDocsPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'social-sharing',
        loadChildren: () => import('../pages/social-sharing/social-sharing.module').then( m => m.SocialSharingPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'refer',
        loadChildren: () => import('../pages/social-sharing/social-sharing.module').then( m => m.SocialSharingPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'rewards-offers',
        loadChildren: () => import('../pages/rewards-offers/rewards-offers.module').then( m => m.RewardsOffersPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'friends-list',
        loadChildren: () => import('../pages/friends-list/friends-list.module').then( m => m.FriendsListPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'payment-modal',
        loadChildren: () => import('../pages/payment-modal/payment-modal.module').then( m => m.PaymentModalPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'uer-info',
        loadChildren: () => import('../pages/uer-info/uer-info.module').then( m => m.UerInfoPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'suspend-account',
        loadChildren: () => import('../pages/suspend-account/suspend-account.module').then( m => m.SuspendAccountPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'offer-details/:id',
        loadChildren: () => import('../pages/offer-details/offer-details.module').then( m => m.OfferDetailsPageModule)
      },
      {
        path: 'transactions/:id',
        loadChildren: () => import('../pages/transactions/transactions.module').then( m => m.TransactionsPageModule)
      },
      {
        path: 'network-error',
        loadChildren: () => import('../pages/network-error/network-error.module').then( m => m.NetworkErrorPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'bonus',
        loadChildren: () => import('../pages/bonus/bonus.module').then( m => m.BonusPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'deposit',
        loadChildren: () => import('../pages/deposit-history/deposit-history.module').then( m => m.DepositHistoryPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'winning-amount',
        loadChildren: () => import('../pages/winning-amount/winning-amount.module').then( m => m.WinningAmountPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'affiliate-amount',
        loadChildren: () => import('../pages/affiliate-amount/affiliate-amount.module').then( m => m.AffiliateAmountPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'download-statement',
        loadChildren: () => import('../pages/download-statement/download-statement.module').then( m => m.DownloadStatementPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'edit-profile',
        loadChildren: () => import('../pages/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule),
            canActivate: [AuthGuardService]

      },


      {
    path: '',
    loadChildren: () => import('../pages/intro/intro.module').then( m => m.IntroPageModule)
  },
  // {
  //   path: '',
  //   loadChildren: () => import('../pages/tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  {
    path: 'intro',
    loadChildren: () => import('../pages/intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('../pages/home/home.module').then( m => m.HomePageModule)
  },
  // {
  //   path: 'expenses',
  //   loadChildren: () => import('../pages/expenses/expenses.module').then( m => m.ExpensesPageModule)
  // },

  {
    path: 'exchange',
    loadChildren: () => import('../pages/exchange/exchange.module').then( m => m.ExchangePageModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('../pages/wallet/wallet.module').then( m => m.WalletPageModule)
  },
  // {
  //   path: 'profile',
  //   loadChildren: () => import('../pages/profile/profile.module').then( m => m.ProfilePageModule)
  // },
 
  // {
  //   path: 'notifications',
  //   loadChildren: () => import('../pages/notifications/notifications.module').then( m => m.NotificationsPageModule)
  // },
  {
    path: 'addtransactions',
    loadChildren: () => import('../pages/modals/addtransactions/addtransactions.module').then( m => m.AddtransactionsPageModule)
  },
  {
    path: 'request',
    loadChildren: () => import('../pages/request/request.module').then( m => m.RequestPageModule)
  },
  {
    path: 'requestmoney',
    loadChildren: () => import('../pages/requestmoney/requestmoney.module').then( m => m.RequestmoneyPageModule)
  },
  {
    path: 'requestreview',
    loadChildren: () => import('../pages/requestreview/requestreview.module').then( m => m.RequestreviewPageModule)
  },
  {
    path: 'successmodal',
    loadChildren: () => import('../pages/modals/successmodal/successmodal.module').then( m => m.SuccessmodalPageModule)
  },
  {
    path: 'addincome',
    loadChildren: () => import('../pages/addincome/addincome.module').then( m => m.AddincomePageModule)
  },

      {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: 'enterpin',
    loadChildren: () => import('../pages/enterpin/enterpin.module').then( m => m.EnterpinPageModule)
  },
  {
    path: 'submitpin',
    loadChildren: () => import('../pages/submitpin/submitpin.module').then( m => m.SubmitpinPageModule)
  },
  {
    path: 'reenterpin',
    loadChildren: () => import('../pages/reenterpin/reenterpin.module').then( m => m.ReenterpinPageModule)
  },

  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () =>
            import('../pages/home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      // {
      //   path: 'tab2',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //       import('../pages/expenses/expenses.module').then(m => m.ExpensesPageModule)
      //     }
      //   ]
      // },
      {
        path: 'tab3',
      
      },
      {
        path: 'tab4',
        children: [
          {
            path: '',
            loadChildren: () =>
            import('../pages/wallet/wallet.module').then(m => m.WalletPageModule)
          }
        ]
      },
      {
        path: 'tab5',
        children: [
          {
            path: '',
            loadChildren: () =>
            import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
          }
        ]
       },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
     
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
