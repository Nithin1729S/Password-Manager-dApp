import { useState, useEffect } from "react";
import moment from 'moment';
moment().utcOffset(330).format()
import "../stylesheet/style.css";
import deleteLogo from '../images/delete.png';
import editLogo from '../images/edit.png';
import saveLogo from '../images/save.png';
import cancelLogo from '../images/cancel.png';
import '../stylesheet/passwords.css'
import '@fortawesome/fontawesome-free/css/all.min.css';



const Passwords = ({ passwords, account, deletePassword, editPassword, getProfile }) => {
  const [editMode, setEditMode] = useState(null);
  const [newContent, setNewContent] = useState("");
  const handleEdit = (passwordId, content, author) => {
    if (author === account) {
      setEditMode(passwordId);
      setNewContent(content);
    }
  };

  const handleSaveEdit = (passwordId, author) => {
    if (author === account) {
      editPassword(passwordId, newContent);
      setEditMode(null);
      setNewContent("");
    }
  };

  const renderEditButtons = (password) => {
    if (editMode === password.id) {
      return null; // Don't render edit and delete buttons during editing
    } else {
      return (
        <div className="tweet-actions">
          <button onClick={() => handleEdit(password.id, password.content, password.author)}>
            <img src={editLogo} alt="Edit" />
          </button>
          <button onClick={() => deletePassword(password.id)}>
            <img src={deleteLogo} alt="Delete" />
          </button>
        </div>
      );
    }
  };

  return (
    <div id="tweetsContainer">
      {passwords.map((password) => (
        <div key={password.id} className="tweet">
          <img
            className="user-icon"
            src={`https://api.multiavatar.com/${password.username}.svg`}
            alt="User Icon"
          />
          <div className="tweet-inner">
            <div className="author">{password.displayName}</div>
            {(editMode === password.id && password.author === account) ? (
              <div className="editArea">
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(password.id, password.author)}>
                  <img src={saveLogo} alt="Save" />
                </button>
                <button onClick={() => setEditMode(null)}>
                  <img src={cancelLogo} alt="Cancel" />
                </button>
              </div>
            ) : (
              <>
                <div className="content">{ `Username:${password.username}`}</div>
                <div className="content">{ `Site:${password.site}`}</div>
                <div className="content">{ `Notes:${password.notes}`}</div>
                <div className="content">{ `Password :${password.content}`}</div>
                <div className="date">{new moment(Number(password.timestamp) * 1000).toLocaleString().split(' GMT')[0]}</div>
              </>
            )}
          </div>
          {account === password.author && renderEditButtons(password)}
        </div>
      ))}
    </div>
  );
};

export default Passwords;

