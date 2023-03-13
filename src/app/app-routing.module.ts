import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  /*{
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },*/
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'master-product',
    loadChildren: () => import('./master-product/master-product.module').then( m => m.MasterProductPageModule)
  },
  {
    path: 'master-product-modal',
    loadChildren: () => import('./master-product-modal/master-product-modal.module').then( m => m.MasterProductModalPageModule)
  },
  {
    path: 'receive-product-create',
    loadChildren: () => import('./receive-product-create/receive-product-create.module').then( m => m.ReceiveProductCreatePageModule)
  },
  {
    path: 'receive-product-create-modal',
    loadChildren: () => import('./receive-product-create-modal/receive-product-create-modal.module').then( m => m.ReceiveProductCreateModalPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'receive-list',
    loadChildren: () => import('./receive-list/receive-list.module').then( m => m.ReceiveListPageModule)
  },
  {
    path: 'master-product-group',
    loadChildren: () => import('./master-product-group/master-product-group.module').then( m => m.MasterProductGroupPageModule)
  },
  {
    path: 'master-product-subgroup',
    loadChildren: () => import('./master-product-subgroup/master-product-subgroup.module').then( m => m.MasterProductSubgroupPageModule)
  },
  {
    path: 'master-product-subgroup-modal',
    loadChildren: () => import('./master-product-subgroup-modal/master-product-subgroup-modal.module').then( m => m.MasterProductSubgroupModalPageModule)
  },
  {
    path: 'master-product-group-modal',
    loadChildren: () => import('./master-product-group-modal/master-product-group-modal.module').then( m => m.MasterProductGroupModalPageModule)
  },
  {
    path: 'master-vendor',
    loadChildren: () => import('./master-vendor/master-vendor.module').then( m => m.MasterVendorPageModule)
  },
  {
    path: 'master-vendor-modal',
    loadChildren: () => import('./master-vendor-modal/master-vendor-modal.module').then( m => m.MasterVendorModalPageModule)
  },
  {
    path: 'image-product-modal',
    loadChildren: () => import('./image-product-modal/image-product-modal.module').then( m => m.ImageProductModalPageModule)
  },
  {
    path: 'rpt-receive',
    loadChildren: () => import('./rpt-receive/rpt-receive.module').then( m => m.RptReceivePageModule)
  },
  {
    path: 'receive-product-attachment',
    loadChildren: () => import('./receive-product-attachment/receive-product-attachment.module').then( m => m.ReceiveProductAttachmentPageModule)
  },
  {
    path: 'rpt-receive-fines',
    loadChildren: () => import('./rpt-receive-fines/rpt-receive-fines.module').then( m => m.RptReceiveFinesPageModule)
  },
  {
    path: 'profile-modal',
    loadChildren: () => import('./profile-modal/profile-modal.module').then( m => m.ProfileModalPageModule)
  },
  {
    path: 'borrow-list',
    loadChildren: () => import('./borrow-list/borrow-list.module').then( m => m.BorrowListPageModule)
  },
  {
    path: 'borrow-create',
    loadChildren: () => import('./borrow-create/borrow-create.module').then( m => m.BorrowCreatePageModule)
  },
  {
    path: 'return-list',
    loadChildren: () => import('./return-list/return-list.module').then( m => m.ReturnListPageModule)
  },
  {
    path: 'return-create',
    loadChildren: () => import('./return-create/return-create.module').then( m => m.ReturnCreatePageModule)
  },
  {
    path: 'borrow-create-modal',
    loadChildren: () => import('./borrow-create-modal/borrow-create-modal.module').then( m => m.BorrowCreateModalPageModule)
  },
  {
    path: 'master-customer',
    loadChildren: () => import('./master-customer/master-customer.module').then( m => m.MasterCustomerPageModule)
  },
  {
    path: 'master-customer-modal',
    loadChildren: () => import('./master-customer-modal/master-customer-modal.module').then( m => m.MasterCustomerModalPageModule)
  },
  {
    path: 'return-create-modal',
    loadChildren: () => import('./return-create-modal/return-create-modal.module').then( m => m.ReturnCreateModalPageModule)
  },
  {
    path: 'borrow-form',
    loadChildren: () => import('./borrow-form/borrow-form.module').then( m => m.BorrowFormPageModule)
  },
  {
    path: 'rpt-borrow',
    loadChildren: () => import('./rpt-borrow/rpt-borrow.module').then( m => m.RptBorrowPageModule)
  },
  {
    path: 'rpt-stock-remain',
    loadChildren: () => import('./rpt-stock-remain/rpt-stock-remain.module').then( m => m.RptStockRemainPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true, })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
