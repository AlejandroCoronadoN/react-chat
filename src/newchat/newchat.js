import React from "react";
import {
  FromControl,
  InputLabel,
  Input,
  Button,
  Paper,
  withStyles,
  CssBaseline,
  Typography,
  FormControl,
} from "@material-ui/core";
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
userISender
newChat
userClickedInput
messageValid
 */


const firebase = require("firebase");

class NewChatComponent extends React.Component {
  constructor(){
    super();
    this.state ={
      username: null,
      message: null
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline/>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Send message!
          </Typography>
            <form className={classes.form} onSubmit={(e) => this.submitNewChat(e)} >
              
              <FormControl fullWidth>
                <InputLabel htmlFor ="new-chat-username">
                  Enter your friend's Email...
                </InputLabel>
                <Input
                  required
                  className={classes.input}
                  autoFocus
                  onChange={(e) => this.userTyping("username",e)}
                  id="new-chat-username">
                </Input>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel htmlFor="new-chat-message">
                  Enter your Message
                </InputLabel>
                <Input 
                 required
                 className={classes.input}
                 onChange={(e) => this.userTyping("message", e)}
                 id="new-chat-message">
                </Input>
              </FormControl>

              <Button 
                fullWidth 
                variant ="contained"
                className ={classes.submit}
                color ="primary" 
                type="submit">
                  Send
              </Button>
            
            </form>
        </Paper>
      </main>
    );
  }

  userTyping =(type,e)=>{
    switch (type){
      case "username":
        this.setState({username: e.target.value});
        break;
      case "message":
        this.setState({message: e.target.value});
        break;
      default:
        break;
    }
  }

  submitNewChat = async(e) => {
    e.preventDefault();
    const userExist = await this.userExist();
    if(userExist){
      const chatExists = await this.chatExists();
      chatExists ? this.goToChat(): this.createChat();
    }
  }

  createChat = () =>{
    this.props.newChatSubmitFn(
      { // Object with the properties to create a chat
      sendTo: this.state.username,
      message: this.state.message
      }
    );
  }

  goToChat = () => this.props.goToChatFn(this.buildDocKey(), this.state.message)

  buildDocKey = ()=>{
    return [firebase.auth().currentUser.email, this.state.username].sort().join(":");
  }
  chatExists = async() =>{
    const docKey = this.buildDocKey();
    const chat = await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .get();
    console.log(chat.exists);
    return chat.exists;  
  }

  userExist = async()=>{
    const usersSnapshot = await firebase
      .firestore()
      .collection("users")
      .get();
    const exist = usersSnapshot.docs
      .map(_doc => _doc.data().email)
      .includes(this.state.username);
    //this.setState({serverError: !exists});
    return exist;
  }
}

export default withStyles(styles)(NewChatComponent);
