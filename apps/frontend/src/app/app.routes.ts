import { Route } from '@angular/router';
import { Client } from "@cornerstone/client";

export const appRoutes: Route[] = [
    {
        path: 'home',
        component: Client,
        pathMatch: 'full'
    }
];
