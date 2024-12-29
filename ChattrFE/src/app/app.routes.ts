import { Routes } from '@angular/router';
import { isLoggedInGuard } from './guards/is-logged-in.guard';
import { ConversationComponent } from './conversation/conversation.component';
import { RegisterComponent } from '../app/register/register.component';
import { ChatComponent } from './chat/chat.component';

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
                redirectTo: ""
            }
        ]
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

