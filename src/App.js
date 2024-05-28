import "./styles.css";
import { useEffect, useState } from "react";

import Passwords from "./components/Passwords";
import AddPassword from "./components/AddPassword";
import Connect from "./components/Connect";
import ProfileCreation from "./components/ProfileCreation";
import logo from "./images/logo.png";

export default function App() {
  const [account, setAccount] = useState(null);
  const [profileExists, setProfileExists] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [profileContract, setProfileContract] = useState(null);
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getPasswords() {
    if (!web3 || !contract) {
      console.error("Web3 or contract not initialized.");
      return;
    }

    const tempPaswords = await contract.methods.getAllPasswords(account).call();
    const passwords = [...tempPaswords];
    passwords.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
    setPasswords(passwords);
    setLoading(false);
  }

  async function checkProfile() {
    const userProfile = await getProfile(account);
    setProfileExists(userProfile);
  }

  async function getProfile() {
    if (!web3 || !profileContract || !account) {
      console.error(
        "Web3 or profileContract not initialized or account not connected."
      );
      return;
    }

    const profile = await profileContract.methods.getProfile(account).call();
    setLoading(false);
    return profile.displayName;
  }

  useEffect(() => {
    if (contract && account) {
      if (profileExists) {
        getPasswords();
      } else {
        checkProfile();
      }
    }
  }, [contract, account, profileExists]);

  async function deletePassword(id) {
    if (!contract || !account) {
      console.error("Web3 or contract not initialized or account not connected.");
      return;
    }

    try {
      await contract.methods.deletePassword(id).send({ from: account });
      getPasswords();
    } catch (error) {
      console.error("Failed to delete password:", error);
    }
  }

  async function editPassword(id, newContent) {
    if (!contract || !account) {
      console.error("Web3 or contract not initialized or account not connected.");
      return;
    }

    try {
      await contract.methods.editPassword(id, newContent).send({ from: account });
      getPasswords();
    } catch (error) {
      console.error("Failed to edit password:", error);
    }
  }

  return (
    <div className="container">
      <img id="logo" src={logo} alt="Logo" />
      <Connect
        web3={web3}
        setWeb3={setWeb3}
        account={account}
        setAccount={setAccount}
        setContract={setContract}
        setProfileContract={setProfileContract}
      />
      {!loading && account && profileExists ? (
        <>
          <AddPassword
            contract={contract}
            account={account}
            getPasswords={getPasswords}
            getProfile={getProfile}

          />
          <Passwords
            passwords={passwords}
            account={account}
            deletePassword={deletePassword}
            editPassword={editPassword}
            getProfile={getProfile}
          />
        </>
      ) : (
        account &&
        !loading && (
          <ProfileCreation
            account={account}
            profileContract={profileContract}
            checkProfile={checkProfile}
          />
        )
      )}
    </div>
  );
}
