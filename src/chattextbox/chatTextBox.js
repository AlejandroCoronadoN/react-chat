import React from "react";
import Send from "@material-ui/icons/Send";
import TextField from "@material-ui/core/TextField";
import styles from "./styles";
import {withStyles} from "@material-ui/core/styles";


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
userISender
newChat
userClickedInput
messageValid
 */


class ChatTextBoxComponent extends React.Component {

	constructor(){
		super();
		this.state ={
			chatText:""
		}
	}
	render(){
		const {classes} = this.props;
			return(
				<div className ={classes.chatTextBoxContainer}>
					<TextField 
						placeholder ="Type your message ..."
						onKeyUp={(e) => this.userTyping(e)}
						id="chattextbox"
						className ={classes.chatTextBox}
						onFocus={this.userClickedInput}   >
					</TextField>

					<Send onClick={this.submitMessage} className ={classes.sendBtn}></Send>
				</div>);
	}

	userTyping=(e)=> e.keyCode ===13 ? this.submitMessage(): this.setState({chatText: e.target.value});

	messageValid =(txt)=> txt && txt.replace(/\s/g, "").length; //Replace all space characters
	
	userClickedInput=()=> console.log("userClickedInput");

	submitMessage=()=>{
		if(this.messageValid(this.state.chatText)){
			this.props.submitMessageFn(this.state.chatText);
			document.getElementById("chattextbox").value="";
		}
	}

	userClickedInput =()=> this.props.messageReadFn();
}

export default withStyles(styles)(ChatTextBoxComponent);