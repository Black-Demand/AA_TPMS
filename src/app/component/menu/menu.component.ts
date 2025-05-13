import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { HeaderComponent } from '../../header/header.component';
import { SidenavComponent } from "../sidenav/sidenav.component";
@Component({
  selector: 'app-menu',
  imports: [
    MatDividerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    SidenavComponent,
    HeaderComponent,
    RouterOutlet,
],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  ngOnInit(): void {
 
  }
  title = 'TPMS';

  sideBarOpen = true;

  sideBarToggle(){
    this.sideBarOpen = !this.sideBarOpen;
  }
}
