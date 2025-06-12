import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { MenuComponent } from './component/menu/menu.component';
import { NavMenuComponent } from './component/nav-menu/nav-menu.component';
import { TemporaryRegistraionComponent } from './driver/temporary-registraion/temporary-registraion.component';
import { PenaltyDriverComponent } from './service/penalty-driver/penalty-driver.component';
import { PenalityComponent } from './service/penality/penality.component';
import { PenaltyDifComponent } from './service/penalty-dif/penalty-dif.component';
import { DriverInfoComponent } from './driver/driver-info/driver-info.component';
import { SuspensionComponent } from './service/suspension/suspension.component';
import { SuspensionSearchComponent } from './service/suspension-search/suspension-search.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DriverInformationComponent } from './driver/driver-information/driver-information.component';
import { TrafficComponent } from './driver/traffic/traffic.component';
import { TrafficSearchComponent } from './driver/traffic-search/traffic-search.component';
import { PenalityGridComponent } from './service/penality-grid/penality-grid.component';
import { DatedemoComponent } from './component/datedemo/datedemo.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    
    {path: 'menu', component: MenuComponent},
    {
        path: '',
        component: MenuComponent,
        children:[
            {
                path: 'nav-menu',
                component: NavMenuComponent,
                title: 'AATPMS'
            }, 
            {path: 'penalty-driver', component: PenaltyDriverComponent},
            {path: 'temporary-registration', component: TemporaryRegistraionComponent},
            {path: 'penality', component: PenalityComponent},
            {path: 'dashboard' , component: DashboardComponent},
            {path: 'penality-driver', component: PenaltyDriverComponent},
            {path: 'penalty-dif', component: PenaltyDifComponent},
            {path: 'driver-info', component: DriverInfoComponent},
            {path: 'suspension', component: SuspensionComponent},
            {path: 'suspension-search', component: SuspensionSearchComponent},
            {path: 'drivers', component: DriverInformationComponent},
            {path: 'traffic', component: TrafficComponent},
            {path: 'traffic-search', component: TrafficSearchComponent},
            {path: 'grid' , component: PenalityGridComponent},
            {path: 'demo' , component: DatedemoComponent}
            // { path: 'suspension', redirectTo: 'suspension-search', pathMatch: 'full' },
            // { path: 'suspension-search', component: PenaltyDriverComponent },
            // { path: 'suspension-form/:id', component: SuspensionComponent }

        ]
    }
];
