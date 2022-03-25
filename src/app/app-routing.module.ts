import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { ThemeComponent } from './theme/theme.component';
import { AuthGuard } from './auth/guard/auth.guard';
import { NotFoundComponent } from './theme/shared/not-found/not-found/not-found.component';
import { SitemapComponent } from './theme/shared/sitemap/sitemap.component';
import { HelpComponent } from './theme/shared/help/help.component';
import { FaqComponent } from './theme/shared/help/faq/faq.component';
import { ArticlesComponent } from './theme/shared/help/faq/articles/articles.component';
import { CreateTicketComponent } from './theme/shared/help/create-ticket/create-ticket.component';
import { TicketListComponent } from './theme/shared/help/ticket-list/ticket-list.component';
import { TicketDetailsComponent } from './theme/shared/help/ticket-list/ticket-details/ticket-details.component';
import { UgcVideoMobileComponent } from './theme/shared/ugc-video-mobile/ugc-video-mobile.component';
import { RegisterGrievanceComponent } from './theme/shared/register-grievance/register-grievance.component';
import { GrievanceOttComponent } from './theme/shared/register-grievance/grievance-ott/grievance-ott.component';
import { GrievanceSocialMediaComponent } from './theme/shared/register-grievance/grievance-social-media/grievance-social-media.component';

const routes: Routes = [
  {
    path: "mobile/registergrievance",
    canActivate: [
      AuthGuard
    ],
    component: RegisterGrievanceComponent
  },
  {
    path: "mobile/registergrievance/grievance-ott",
    canActivate: [
      AuthGuard
    ],
    component: GrievanceOttComponent
  },
  {
    path: "mobile/registergrievance/grievance-social-media",
    canActivate: [
      AuthGuard
    ],
    component: GrievanceSocialMediaComponent
  },
  {
    path: '',
    canActivate: [
      AuthGuard
    ],
    component: ThemeComponent,
    children: [
      {
        path: '',
        loadChildren: '.\/theme\/pages\/default\/index\/index.module#IndexModule'
      },
      {
        path: 'search',
        loadChildren: '.\/theme\/pages\/default\/search\/search.module#SearchModule'
      },
      {
        path: 'user',
        loadChildren: '.\/theme\/pages\/default\/user-management\/user-management.module#UserManagementModule'
      },
      {
        path: 'watch',
        loadChildren: '.\/theme\/pages\/default\/detail-page\/detail-page.module#DetailPageModule'
      },
      {
        path: 'ugc',
        loadChildren: '.\/theme\/pages\/default\/ugc\/ugc.module#UgcModule'
      },
      {
        path: 'user/mydishtvspace',
        loadChildren: '.\/theme\/pages\/default\/my-dish-tv-space\/my-dish-tv-space.module#MyDishTvSpaceModule'
      },
      {
        path: 'user/myd2hspace',
        loadChildren: '.\/theme\/pages\/default\/my-dish-tv-space\/my-dish-tv-space.module#MyDishTvSpaceModule'
      },
      {
        path: 'user/quiz',
        loadChildren: '.\/theme\/pages\/default\/quiz\/quiz.module#QuizModule'
      },
      {
        path: 'siteMap',
        component: SitemapComponent
      },
      {
        path: 'help',
        component: HelpComponent
      },
      {
        path: 'help/faq',
        component: FaqComponent
      },
      {
        path: 'help/faq/:sectionId',
        component: ArticlesComponent
      },
      {
        path: 'help/createTicket',
        component: CreateTicketComponent
      },
      {
        path: 'help/ticketList',
        component: TicketListComponent
      },
      {
        path: 'help/ticketDetails/:ticketId/:title/:requesterId',
        component: TicketDetailsComponent
      },
      {
        path: "mobile-ugc-listing/:name/:id",
        component: UgcVideoMobileComponent
      },
      {
        path: "registergrievance",
        component: RegisterGrievanceComponent
      },
      {
        path: "registergrievance/grievance-ott",
        component: GrievanceOttComponent
      },
      {
        path: "registergrievance/grievance-social-media",
        component: GrievanceSocialMediaComponent
      },
      {
        path: '404',
        component: NotFoundComponent
      },
      {
        path: "**",
        redirectTo: '/404'
      }

    ],
    runGuardsAndResolvers: 'always'
  },

]

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollOffset: [0, 0], scrollPositionRestoration: 'top', initialNavigation: 'enabled', preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
