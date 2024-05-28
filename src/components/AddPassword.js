import { useEffect, useState } from "react";
import '../stylesheet/addPasswords.css'
const AddPassword = ({ contract, account, getPasswords ,getProfile}) => {
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
  document.querySelector("#userAddress").innerHTML=`Connected : ${userProfile}`
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
    <form
      id="passwordForm"
      onSubmit={(e) => {
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
      <br />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <br />
      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows="4"
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />
      <button
        id="passwordSubmitBtn"
        style={{ marginLeft: '260px', background: '#eb57ad' }}
        disabled={loading}
        type="submit"
      >
        {loading ? <div className="spinner"></div> : <>Add Password</>}
      </button>
    </form>
  );
};

export default AddPassword;
