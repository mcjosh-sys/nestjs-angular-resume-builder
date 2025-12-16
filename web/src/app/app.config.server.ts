import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withAppShell, withRoutes } from '@angular/ssr';
import { AppShellComponent } from './app-shell/app-shell.component';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes), withAppShell(AppShellComponent))],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
