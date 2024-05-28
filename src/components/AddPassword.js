import { useEffect, useState } from "react";
import '../stylesheet/addPasswords.css'
const AddPassword = ({ contract, account, getPasswords, getProfile }) => {
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [notes, setNotes] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState("");
  useEffect(() => {
    async function fetchProfile() {
      if (account) {
        try {
          const profile = await getProfile(account);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    }
    fetchProfile();
  }, [account, getProfile]);
  document.querySelector("#userAddress").innerHTML = `Connected : ${userProfile}`
  async function createPassword(site, username, notes, password) {
    if (!contract || !account) {
      console.error(
        "Web3 or contract not initialized or account not connected."
      );
      return;
    }
    try {
      setLoading(true);
      await contract.methods.createPassword(site, username, notes, password).send({ from: account });
      getPasswords();
    } catch (error) {
      console.error("User rejected request:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div id="feedback-form">
        <div>
          <form
            id="passwordForm" onSubmit={(e) => {
              e.preventDefault();
              createPassword(site, username, notes, password);
            }}
          >            
          
          <input
          type="text"
          placeholder="Site"
          value={site}
          onChange={(e) => setSite(e.target.value)}
          required
        />  
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />      
         
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="4"
        /> 
          <button type="submit"disabled={loading}>
          {loading ? <div className="spinner"></div> : <>Add Password</>}
          </button>
          </form>
        </div>
      </div>
    </>

  );
};

export default AddPassword;
