import { Routes } from '@angular/router';
import { isLoggedInGuard } from './guards/is-logged-in.guard';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"

    },
    {
        path: "text",
        // GUARD
        loadComponent: () => import("../app/text/text.component")
            .then(c => c.TextComponent),
        // canActivate: [!isLoggedInGuard]
    },
    {
        path: "login",
        loadComponent: () => import("../app/login-page/login-page.component")
            .then(c => c.LoginPageComponent),
        canActivate: [isLoggedInGuard]
    },
    {
        path: "register",
        loadComponent: () => import("../app/register/register.component")
            .then(c => c.RegisterComponent),
        canActivate: [isLoggedInGuard]
    }
];

