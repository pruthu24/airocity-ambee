# Airocity - Air Quality Index Calculator

### A Porject by Ambee

The Airocity Project used to calculate the AQI - Air Quality Index. Which is helpful to fight against air pollution.



## Getting started:-

* Install the Node.js dependencies via npm: `npm install`

* Start MySql server locally and create a database,with **Database Name**:- user-login and **Table Name**:- user
  As shown in figure below.
  
  ![sql](https://user-images.githubusercontent.com/47686521/97576350-12158380-1a14-11eb-8456-172ba6457f8d.png)
  
  
* now start the server
`npm start`


* `http://localhost:8081/` - Enter the localhost url after start



## Organization:-

### Components live in `controllers` and are organized as follows:

* `auth.js` --> Code that controls the interactions and logic


### Components live in `routes` and are organized as follows:

* `auth.js` --> Contains all the routes for authenticated user

* `routes.js` --> Basic request to direct to specific page 


### Components live in `views` and are organized as follows:

* It contains all the templating file. Used for dynamic rendring of the website


### Components live in `public` and are organized as follows:

* `style.css` --> File for styling the touch and feel of the website


### `index.js` :-

* Typically index contains and handles the app startup and other functions

### `value.json` "-

* This contains the concentration and the AQI value of all the recieved data.

![value](https://user-images.githubusercontent.com/47686521/97576575-57d24c00-1a14-11eb-971a-c7395dff65e8.png)

# Overview

* There was an error while Dockerizing the application.

![docker](https://user-images.githubusercontent.com/47686521/97576138-c662da00-1a13-11eb-9762-c22fab553753.png)

* **Simple, Dynamic and SEO friendly website.**
