import React, { useState } from "react";
import { ethers } from "ethers";
import MyContractABI from "./MyContract.json";
import { BrowserProvider } from "ethers";

const ContractInteraction = () => {
  const [contractResponse, setContractResponse] = useState(null);
  const [contractSumResponse, setContractSumResponse] = useState(null);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  const contractAddress = "0x700b6a60ce7eaaea56f065753d8dcb9653dbad35"; // Replace with your contract address

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error(
          "MetaMask is not installed. Please install it to continue."
        );
      }

      // Request account access
      const provider = new BrowserProvider(window.ethereum);

      await provider.send("eth_requestAccounts", []); // Opens MetaMask prompt
      const signer = await provider.getSigner();
      console.log("Signer object:", signer);

      // Get the connected account
      const userAccount = await signer.getAddress();
      console.log("Connected account:", userAccount);
      setAccount(userAccount);

      return { provider, signer };
    } catch (err) {
      console.error("Error connecting to wallet:", err);
      setError(err.message);
    }
  };

  // Interact with the contract
  const interactWithContract = async () => {
    try {
      const { signer } = await connectWallet();
      if (!signer) return;

      // Create contract instance with signer
      const contract = new ethers.Contract(
        contractAddress,
        MyContractABI.abi,
        signer
      );

      // Call contract function
      const response = await contract.helloWorld(); // Replace `helloWorld` with your actual contract function
      console.log("Contract response:", response);

      const responseSum = await contract.sum(2, 3); // Replace `helloWorld` with your actual contract function
      console.log("Contract response:", responseSum);

      // Save the response in the state
      setContractResponse(response);
      setContractSumResponse(responseSum);
    } catch (err) {
      console.error("Error interacting with contract:", err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>React Smart Contract Interaction</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      {account && <p>Connected Account: {account}</p>}
      <button onClick={interactWithContract}>Call Contract Function</button>
      {contractResponse && <p>Contract Response: {contractResponse}</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {contractSumResponse && (
        <p>Contract Sum Response: {contractSumResponse.toString()}</p>
      )}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};

export default ContractInteraction;
