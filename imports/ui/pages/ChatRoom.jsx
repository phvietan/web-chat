import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { FormControl, Button } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';
import UploadFileModal from '../components/UploadFileModal';
import '../css/ChatRoom.css';

function findSpace(s) {
    for (let i = 0, n = s.length; i < n; ++i)
      if (s[i] == ' ') return i;
}

export default class ChatRoom extends Component {
  logout() {
    document.getElementById('type-bar').value = '';
    Meteor.call('chat-upload', `${this.props.user.username} has just logged out!!!`, 'SYSTEM');
    Meteor.logout();
  }
  confirm() {
    let text = document.getElementById('type-bar').value;
    if (text != '') {
      if (text == '/logout') {
        this.logout();
        return;
      }
      Meteor.call('chat-upload', text, this.props.user.username, (err) => {});
    }
    document.getElementById('type-bar').value = '';
  }
  type(event) {
    if (event.keyCode==13)
      this.confirm();
  }
  componentDidUpdate() {
    let box = document.getElementById('chat-outer');
    box.scrollTop = box.scrollHeight;
  }
  uploadFile() {

  }
  render() {
    let Height = window.innerHeight - 150;
    return (
      <div>
        <NavigationBar
          logout={this.logout}
          user={this.props.user}
        />
        <div id='chat-outer' className='chat-outer' style={{height: `${Height}px`}}>
          <ul className='chat-box'>
            {this.props.list.map((value, index) =>
              <div key={index}>
                {value.user == 'SYSTEM' &&
                  <p className="system-log">
                    SYSTEM: {value.content}
                  </p>
                }
                {this.props.user.username == value.user && value.user != 'SYSTEM' &&
                  <li key={index}>
                    <span style={{color:'red', fontWeight:'bold'}}>{value.user}</span>: {value.content}
                  </li>
                }
                {this.props.user.username != value.user && value.user != 'SYSTEM' &&
                  <li key={index}>
                    <span style={{color:'black', fontWeight:'bold'}}>{value.user}</span>: {value.content}
                  </li>
                }
              </div>
            )}
          </ul>
        </div>
        <div className="type-group">
          <input type="text" onKeyDown={this.type.bind(this)} className="type-bar" id='type-bar'/>
        </div>

      </div>
    );
  }
}