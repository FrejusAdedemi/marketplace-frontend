import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { Notifications } from './components/notifications/notifications';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Notifications],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
