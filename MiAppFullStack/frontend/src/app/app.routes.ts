import { Routes } from '@angular/router';
import { UserComponent } from '../user/user.component';
import { ProfileComponent } from '../user/profile/profile.component';
import { SettingsComponent } from '../user/settings/settings.component';
import { StorePage } from '../pages/store/store.page';
import { ProductListComponent } from '../components/products/product.list.component';
import { ProductFormComponent } from '../components/forms/product-form.component';


import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
{
   path : 'user',
   component : UserComponent,
   children : [
	{ path : 'profile' , component : ProfileComponent },
    { path : 'settings' , component : SettingsComponent }

   ]
},
 {
   path : "store",
   component : StorePage
 },
  {
   path : "product",
   component : ProductListComponent
  },
  
  {
   path : "admin/new-product",
   component : ProductFormComponent,
   canActivate : [adminGuard]
  }
 
];
