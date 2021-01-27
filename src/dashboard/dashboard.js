import React from "react";
import ChatListComponent from "../chatlist/chatlist";
import { Button, withStyles } from "@material-ui/core";
import styles from "./styles";
import ChatViewComponent from "../chatview/chatview";
import ChatTextBoxComponent from "../chattextbox/chatTextBox";
import NewChatComponent from "../newchat/newchat";
const firebase = require("firebase");

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

class DashboardComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedChat: null,
      newChatFormVisible: false,
      email: null,
      chats: [],
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <ChatListComponent
          history={this.props.history}
          newChatBtnFn={this.newChatBtnClicked}
          selectChatFn={this.selectChat}
          chats={this.state.chats}
          userEmail={this.state.email}
          selectedChatIndex={this.state.selectedChat}
        ></ChatListComponent>

        {this.state.newChatFormVisible ? null : (
          <ChatViewComponent
            user={this.state.email}
            chat={this.state.chats[this.state.selectedChat]}
          ></ChatViewComponent>
        )}
        {this.state.selectedChat !== null && !this.state.newChatFormVisible ? (
          <ChatTextBoxComponent
            submitMessageFn={this.submitMessage}
            messageReadFn={this.messageRead}
          ></ChatTextBoxComponent>
        ) : null}
        {
          this.state.newChatFormVisible ? 
            <NewChatComponent 
              goToChatFn ={this.goToChat}
              newChatSubmitFn={this.newChatSubmit}>
            </NewChatComponent> : null
        }

        <Button
          // Note that this button will sign us out and will REACT with the if statement inside
          //componentDidMount and will take us to /login
          onClick={this.signOut}
          className={classes.signOutBtn}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  goToChat = async(docKey, msg) =>{
    const usersInChat = docKey.split(":");
    const chat = this.state.chats.find(_chat => usersInChat.every(_user => _chat.users.includes(_user)));
    this.setState({newChatFormVisible: false });
    await this.selectChat(this.state.chats.indexOf(chat));
    this.submitMessage(msg); 
  }

  newChatSubmit = async(chatObj) =>{
    const docKey = this.buildDocKey(chatObj.sendTo);
    await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .set({
        receiverHasRead: false,
        users: [this.state.email, chatObj.sendTo],
        messages: [{
          message: chatObj.message,
          sender: this.state.email
        }]
      })
    this.setState({newChatFormVisible:false});
    this.selectChat(this.state.chats.length-1);
  }

  signOut = () => {
    firebase.auth().signOut();
  };


  newChatBtnClicked = () => {
    this.setState({ newChatFormVisible: true, selectedChat: null });
  };

  selectChat = async (chatIndex) => {
    await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
    console.log("dashboard selectChat: ", this.state);
    this.messageRead();
  };

  submitMessage = (msg) => {
    const docKey = this.buildDocKey(
      this.state.chats[this.state.selectedChat].users.filter(
        (_usr) => _usr !== this.state.email
      )[0]
    );
    firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          //this is a build function in firebase that allow us
          //to append an elemnt into an array (arrayUnion)
          sender: this.state.email,
          message: msg,
          timestamp: Date.now(),
        }),
        receiverHasRead: false,
      });
  };

  buildDocKey = (friend) => [this.state.email, friend].sort().join(":");

  messageRead = () => {
    console.log("messageRead initialize ");
    const docKey = this.buildDocKey(
      this.state.chats[this.state.selectedChat].users.filter(
        (_usr) => _usr !== this.state.email
      )[0]
    );
    if (this.clickedChatWhereNotSender(this.state.selectedChat)) {
      firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .update({ receiverHasRead: true });
      console.log("receiverHasRead: Changed to True ");
    } else {
      console.log("Clicked message where the user was the sender.");
    }
  };

  clickedChatWhereNotSender = (chatIndex) =>
    this.state.chats[chatIndex].messages[
      this.state.chats[chatIndex].messages.length - 1
    ].sender !== this.state.email;

  componentDidMount = () => {
    //Get called whenever the components has been succesfully shown into the DOM
    firebase.auth().onAuthStateChanged(async (_usr) => {
      if (!_usr) this.props.history.push("/login");
      else {
        await firebase
          .firestore()
          .collection("chats")
          .where("users", "array-contains", _usr.email)
          .onSnapshot(async (res) => {
            //onSnapshot allows us to re-render ehnever the database is updated, that way we update when we send messages
            const chats = res.docs.map((_doc) => _doc.data()); // whenever this collection is updated firebase is going to be called
            await this.setState({
              email: _usr.email,
              chats: chats,
            });
            console.log("componentDidMount state: ", this.state);
          });
      }
    });
  };
}

export default withStyles(styles)(DashboardComponent);
