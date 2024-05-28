import { useState, useEffect } from "react";
import moment from 'moment';
moment().utcOffset(330).format()
import "../stylesheet/style.css";
import deleteLogo from '../images/delete.png';
import editLogo from '../images/edit.png';
import saveLogo from '../images/save.png';
import cancelLogo from '../images/cancel.png';
import clipboardLogo from '../images/clipboard.png';
import '../stylesheet/passwords.css';
import '../styles.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Passwords = ({ passwords, account, deletePassword, editPassword, getProfile }) => {
  const [editMode, setEditMode] = useState(null);
  const [newContent, setNewContent] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState({});

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

  const handleToggleVisibility = (passwordId) => {
    setVisiblePasswords({
      ...visiblePasswords,
      [passwordId]: !visiblePasswords[passwordId],
    });
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied 🙌');
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
            src={`https://source.boringavatars.com/bauhaus/120/${password.username}`}
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
                <div className="content" style={{ minWidth: '300px' }}>
                  <span style={{ minWidth: '300px', display: 'inline-block' }}><strong>{`Username : `}</strong>
                  &nbsp;&nbsp;&nbsp;&nbsp;{password.username} </span>
                  <button onClick={() => handleCopyToClipboard(password.username)}>
                    <img src={clipboardLogo} alt="Copy" style={{ height: '15px' }} />
                  </button>
                </div>



                <div className="content" style={{ minWidth: '300px' }}>
                  <span style={{ minWidth: '300px', display: 'inline-block' }}><strong style={{ minWidth: '80px', display: 'inline-block' }}>{`Site  `}</strong><span><strong>: </strong></span>
                  &nbsp;&nbsp;&nbsp;&nbsp;{password.site}</span>
                  <button onClick={() => handleCopyToClipboard(password.site)}>
                    <img src={clipboardLogo} alt="Copy" style={{ height: '15px' }} />
                  </button>
                </div>


                <div className="content">
                  <span style={{ minWidth: '263px', display: 'inline-block' }}><strong>{'Password : '}</strong>
                  &nbsp;&nbsp;&nbsp;&nbsp; {`${visiblePasswords[password.id] ? password.content : '********'}`}</span>
                  <button onClick={() => handleToggleVisibility(password.id)}>
                    <i className={`fa ${visiblePasswords[password.id] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                  <button onClick={() => handleCopyToClipboard(password.content)}>
                    <img src={clipboardLogo} alt="Copy" style={{ height: '15px' }} />
                  </button>
                </div>
                <div className="content">
                  <strong style={{ minWidth: '80px', display: 'inline-block' }}>Notes</strong><span><strong>: </strong></span>
                  &nbsp;&nbsp;&nbsp;&nbsp;{password.notes.length > 0 ? password.notes : '--------'}
                </div>

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
