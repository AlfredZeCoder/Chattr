import { Routes } from '@angular/router';
import { ConversationComponent } from './conversation/conversation.component';
import { ChatGuard } from './auth/guards/chat.guard';
import { IsLoggedInGuard } from './auth/guards/is-logged-in.guard';

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
                component: ConversationComponent,

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
        loadComponent: () => import("../app/login-page/login-page.component")
            .then(c => c.LoginPageComponent),
        canActivate: [IsLoggedInGuard]
    },
    {
        path: "register",
        loadComponent: () => import("../app/register/register.component")
            .then(c => c.RegisterComponent),
        canActivate: [IsLoggedInGuard]
    },
    {
        path: "**",
        redirectTo: "/",
        pathMatch: "full"
    }
];

