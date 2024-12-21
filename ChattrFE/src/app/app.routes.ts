import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

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
        canActivate: [authGuard],
        loadComponent: () => import("../app/login-page/login-page.component")
            .then(c => c.LoginPageComponent)
    }
];
