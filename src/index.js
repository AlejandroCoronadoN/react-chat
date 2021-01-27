import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Route, BrowserRouter as Router } from "react-router-dom";
import LoginComponent from "./login/login";
import SignupComponent from "./signup/signup"
import DashboardComponent from "./dashboard/dashboard"


const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
    apiKey: "AIzaSyAuJzs8x7g8e-2T9UaFIJqGv1pIoaA_03Q",
    authDomain: "im-tutorial-f472d.firebaseapp.com",
    projectId: "im-tutorial-f472d",
    storageBucket: "im-tutorial-f472d.appspot.com",
    messagingSenderId: "971131610715",
    appId: "1:971131610715:web:cd4961b969638a5b63817e",
    measurementId: "G-0TN2P7W3TY"
});

const routing = (
	<Router>
		<div id="routing-container">
			<Route path="/login" component={LoginComponent}></Route>
			<Route path="/signup" component={SignupComponent}></Route>
			<Route path="/dashboard" component={DashboardComponent}></Route>
			
		</div>
	</Router>

	);

ReactDOM.render(routing,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
