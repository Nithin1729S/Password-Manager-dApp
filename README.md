# Web3 Vault dApp

A Decentralized Password Manager compiled in Remix IDE , deployed on Ethereum BlockChain (Sepolia TestNet). The frontend is designed using ReactJS and CRUD functionalities are implemented. Users can save their passwords securely using blockchain technology.

## Live Demo

Visit the live version of the Web3 Vault dApp [here](https://web3vault.vercel.app).

## Demo of the Project
Experience the functionality of our Web3 Vault dApp by watching the demo




https://github.com/Nithin1729S/Web3-Vault-dApp/assets/78496667/8d07157f-8bbf-4d82-bc3a-a6a9995b843c






Alternatively, you can also view the demo on [YouTube](https://www.youtube.com/watch?v=wmYAtVDMEuc).

## About the Project

### Smart Contracts
Two Smart Contracts are deployed on the Sepolia test network:
- **Main Contract:** `0x659752537DDA80Fb0071DDad74E21cE902aD8e06`
- **User Contract:** `0x4D9b090a17976068a743fD9ae3BebDB491d25831`

- The **Main Contract** handles the core functions of the password manager.
- The **User Contract** manages user profiles.
- Both contracts inherit ownership features from `Ownable.sol` by OpenZeppelin, ensuring secure and controlled access.
- The Main and User contracts can communicate with each other to coordinate user and password management functions.

### Development Environment
- The smart contracts are compiled using Remix IDE.
- The application is built with a React frontend, using ABI to facilitate communication with the deployed smart contracts.

### Features
- **User Profile:** A user can create a profile, provided they have a MetaMask wallet with some Sepolia ETH.
- **Password Management:** Users can add, edit, and delete their passwords.
- **Timestamps:** Each password entry includes a timestamp to track its age.
- Basic CRUD functionality is implemented.

### Security of Password Manager on Blockchain
Using a password manager on the blockchain offers several security advantages:
1. **Decentralization:** Data is stored in a decentralized manner, reducing the risk of a single point of failure.
2. **Immutability:** Once data is stored on the blockchain, it cannot be altered, ensuring the integrity of the information.
3. **Transparency:** Blockchain transactions are transparent and can be audited, providing clear accountability.
4. **Smart Contract Security:** The use of smart contracts ensures that the application logic is executed as written, without interference.
5. **User Control:** Users have complete control over their data, secured by their private keys in their MetaMask wallets.

However, it's essential to implement robust security measures, such as regular smart contract audits and secure handling of private keys, to mitigate potential vulnerabilities.



## Instructions to Run the Project

To get started with the Web3 Vault dApp, please follow the steps below:

1. **Set Up Metamask Wallet:**
    - Install the Metamask extension in your preferred web browser.
    - Create a new wallet or import an existing wallet.
    - Collect some Sepolia ETH using available free faucets.

2. **Clone the GitHub Repository:**
    - Open your terminal.
    - Execute the following command to clone the repository:
      ```bash
      git clone https://github.com/Nithin1729S/Web3-Vault-dApp.git
      ```

3. **Install Project Dependencies:**
    - Navigate to the project's main directory:
      ```bash
      cd Web3-Vault-dApp
      ```
    - Install the necessary dependencies using npm:
      ```bash
      npm install
      ```

4. **Start the React Application:**
    - Run the following command to start the React application:
      ```bash
      npm start
      ```

5. **Connect to Your Metamask Wallet:**
    - Open the application in your web browser.
    - Use the Metamask extension to connect your wallet.

6. **Create Your Account and Add Passwords:**
    - Once connected, your account will be created automatically.
    - You can now start adding and managing your passwords securely.

