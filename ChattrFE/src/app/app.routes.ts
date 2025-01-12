import { Routes } from '@angular/router';
import { MessageComponent } from './components/message/message.component';
import { ChatGuard } from './shared/guards/chat.guard';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"

    },
    {
        path: "chat",
        loadComponent: () => import("./chat/chat.component")
            .then(c => c.ChatComponent),
        children: [
            {
                path: "conversation",
                component: MessageComponent,

            },
            {
                path: "**",
                redirectTo: "",
                pathMatch: "full"
            }
        ],
        canActivate: [ChatGuard]
    },
    {
        path: "login",
        loadComponent: () => import("./components/login-page/login-page.component")
            .then(c => c.LoginPageComponent),
        canActivate: [authGuard]
    },
    {
        path: "register",
        loadComponent: () => import("./components/register/register.component")
            .then(c => c.RegisterComponent),
        canActivate: [authGuard]
    },
    {
        path: "**",
        redirectTo: "/",
        pathMatch: "full"
    }
];

