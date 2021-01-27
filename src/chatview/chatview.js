import React from "react";
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


class ChatViewComponent extends React.Component{

	componentDidUpdate=()=>{
		//Feature to scroll the chat to the end whenever we click a particular chat
		const container = document.getElementById("chatview-conatiner");
		if(container)
			container.scrollTo(0, container.scrollHeight);
	}

	render(){

		const {classes, chat, user} =this.props;
		if(chat === undefined){
			return(
				<div>
					<main className ={classes.content} id= "chatview-conatiner">
					</main>
				</div>
			);
		}else{
			return(
				<div>
					<div className={classes.chatHeader}>
					Your conversation with {chat.users.filter(_usr => _usr !== user)[0]}
					</div>
					<main className={classes.content} id="chatview-conatiner ">
						{
							chat.messages.map((_msg, _index)=>{
								return(
									<div key={_index} className={_msg.sender === user ? classes.userSent: classes.friendSent}>
										{_msg.message}
									</div>
									)
							})
						}
					</main>

				</div>
			)
		}
	}

}

export default withStyles(styles)(ChatViewComponent);