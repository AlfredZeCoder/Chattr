import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/text",
        pathMatch: "full"

    },
    {
        path: "text",
        // GUARD
        loadComponent: () => import("../app/text/text.component")
            .then(c => c.TextComponent)
    },
    {
        path: "login",
        loadComponent: () => import("../app/login-page/login-page.component")
            .then(c => c.LoginPageComponent)
    }
];
