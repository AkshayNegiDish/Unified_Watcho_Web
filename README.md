This is Angular 6 web app


To run the application execute the following commands

1. npm install
2. ng serve --configuration=dev   ( local envirnoment )
   ng serve --configuration=qa    ( qa envirnoment )
   ng serve --configuration=uat   ( uat envirnoment )
   ng serve --configuration=prod  ( prod envirnoment )

After execution of second command goto http://localhost:4200

To make Universal Build for various envirnoment

1. Production

To make build : npm run build:ssr-prod
To start server : npm run serve:ssr

2. QA

To make build : npm run build:ssr-qa
To start server : npm run serve:ssr

3. UAT

To make build : npm run build:ssr-uat
To start server : npm run serve:ssr

4. Dev

To make build : npm run build:ssr-dev
To start server : npm run serve:ssr

After execution of second command goto http://localhost:4000
