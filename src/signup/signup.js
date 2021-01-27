import React from "react";
import FormControl from "@material-ui/core/FormControl";
import {Link} from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import styles from "./styles";

/*
goToChat
newChatSubmit
signOut
newChatBtnClicked
selectChat
submitMessage
buildDocKey
messageRead
clickedChatWhereNotSender
componentDidMount
formisValid
submitSignup
userTyping
submitLogin
 */

const firebase = require("firebase");



class SignupComponent extends React.Component {


	constructor() {// Add state
		super();
		this.state = {
			email: null,
			password:null,
			passwordConfirmation:null,
			signupError:""
		};


	};
	render(){
		const {classes} = this.props;  //Now we have classes property from withStyles which is linked to styles.css

		return(
			<main className ={classes.main}>
				<CssBaseline></CssBaseline>
				<Paper className ={classes.paper}>
					<Typography component="h1" variant="h5">
						 Sign Up!
					</Typography>			
					<form onSubmit={(e) => this.submitSignup(e)} className ={classes.form}>

						<FormControl required fullWidth margin ="normal" >
							<InputLabel  htmlFor= "signup-email-input">Enter your Email </InputLabel> 
							<Input 
								autoComplete="email" 
								onChange={(e) => this.userTyping("email", e)} 
								autoFocus id="signup-email-input">
							</Input>
						</FormControl>

						<FormControl required fullWidth margin ="normal">
							<InputLabel htmlFor="signup-password-input">Create Password</InputLabel>
							<Input 
								type ="password" 
								onChange={(e)=> this.userTyping("password",e)} 
								id ="signup-password-input">
							</Input>
						</FormControl>

						<FormControl required fullWidth margin ="normal">
							<InputLabel htmlFor="signup-confirmation-password-input">Confirm Password</InputLabel>
							<Input 
								type ="password" 
								onChange={(e)=> this.userTyping("passwordConfirmation",e)} 
								id ="signup-password-confirmation-input"></Input>
						</FormControl> 

						<Button type="submit" fullWidth variant="contained" color="primary" className ="classes.submit"> Submit</Button>
					</form>
					{//JavaScript
						this.state.signupError ?
						<Typography className={classes.errorText} component="h5" variant="h6" >
							{this.state.signupError}
						</Typography> : null
					}
					<Typography component="h5" variant="h6" className={classes.hasAccountHeader}> Already have an account?</Typography>
					<Link className ={classes.logInLink} to="/login">Log In! </Link>
				</Paper>
				
			</main>
		);
	}  

	formisValid = () => this.state.password === this.state.passwordConfirmation;

	submitSignup =(e) =>{
			e.preventDefault(); //When clicking submit the default function is refresh form
			if(!this.formisValid()){
				this.setState({signupError: "Password do not match!"});
			}else{
			console.log("Submiting!!!!", this.state);
			}

		firebase // Note that we are using two components from firebase. First we are using the data base and secod the Authenticator
			.auth()
			.createUserWithEmailAndPassword(this.state.email, this.state.password)
			.then(
				authRes => {
					const userObj = {
					email: authRes.user.email
				};
				firebase
					.firestore()
					.collection("users")
					.doc(this.state.email)
					.set(userObj)
					.then(()=> {
						this.props.history.push("/dashboard")
					}, dbError => {
						console.log(dbError);
						this.setState({signupError: "Failed to add user DB"});
					})
			}, authError => {
				console.log(authError);
				this.setState({signupError: "Failed to add user Authenticator"}); 
			})
	}	

	userTyping = (type, e) => {
		switch(type) {
			case "email":
				this.setState({email: e.target.value });
				break;
			case "password":
				this.setState({password: e.target.value});
			case "passwordConfirmation":
				this.setState({passwordConfirmation: e.target.value});

			default:
				break;

		}
		console.log(type, e);
	}

}

export default withStyles(styles)(SignupComponent); 
//withStyles returns a fucntion that use styles as input
//The function called by withStyles uses SignupComponent as input
//Now all the styles in ./styles are passed as a property