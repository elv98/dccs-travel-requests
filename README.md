# Travel requests project

## Technologies used

This project was done using [OpenUI5](https://openui5.org/) framework for frontend application.
For backend service [Firebase](https://firebase.google.com/) was used, mainly Firestore service for storing data and Authentication service for authenticating users. Also email sending was done with [Firebase Trigger Email](https://firebase.google.com/products/extensions/firebase-firestore-send-email) extension.

## Project description

This project can be used for creating and editing travel requests for company.
Users can create requests for trips they need to make. After the user creates travel request, it's up to the directors to approve or deny them. After the director's approval of the travel request, a travel planner receives an email that he needs to complete tasks for that request. After the travel planner completes tasks for a given travel request, the user receives a confirmation email with all details about their travel.

Video demo of how this project works can be found [here](https://mega.nz/file/iAcQGIRD#tHtDnYFV_qza6mFZMqwEkY1mj7F6LSo9LMq9D1wfkUM)

## Building project

To build this project first you need OpenUI5 installed on your machine. Tutorial for installing OpenUI5 can be found [here](https://sapui5.hana.ondemand.com/sdk/#/topic/ee8726adfdb34d748ed199f0275472f8.html).
After installing OpenUI5 project can be built and served with command

```bash
ui5 serve
```
