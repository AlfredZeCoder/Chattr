import { Routes } from '@angular/router';
import { isLoggedInGuard } from './guards/is-logged-in.guard';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"

    },
    {
        path: "chat",
        // GUARD
        loadComponent: () => import("./conversation/conversation.component")
            .then(c => c.ConversationComponent),
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

