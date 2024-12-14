import React, { useState } from "react";
import { ethers } from "ethers";
import { BrowserProvider, parseEther, Contract } from "ethers";

// Replace with your deployed smart contract address and ABI
const contractAddress = "0x700b6a60ce7eaaea56f065753d8dcb9653dbad35";
const contractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "studentId",
        type: "string",
      },
    ],
    name: "getPaymentStatus",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "studentId",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct MyContract.Payment",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "studentId",
        type: "string",
      },
    ],
    name: "payFees",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "payments",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "studentId",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const App = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  // Connect to Metamask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install Metamask to use this feature.");
    }
  };

  // Pay fees using the smart contract
  const payFees = async () => {
    if (!studentId || !amount) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractABI, signer);
      const currentNonce = await provider.getTransactionCount(signer.address);
      const tx = await contract.payFees(studentId, {
        value: parseEther(amount),
        nonce: 0,
      });

      setPaymentStatus("Transaction in progress...");
      await tx.wait();
      setPaymentStatus(`Payment successful! Transaction Hash: ${tx.hash}`);
    } catch (error) {
      console.error("Payment failed:", error);
      setPaymentStatus("Payment failed. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>College Fee Payment System</h1>

      {/* Wallet Connection */}
      <button onClick={connectWallet} style={styles.button}>
        {walletAddress
          ? `Wallet Connected: ${walletAddress}`
          : "Connect Wallet"}
      </button>

      {/* Payment Form */}
      <div style={styles.form}>
        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Enter Amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
        />
        <button onClick={payFees} style={styles.button}>
          Pay Fees
        </button>
      </div>

      {/* Payment Status */}
      {paymentStatus && <p style={styles.status}>{paymentStatus}</p>}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    margin: "50px auto",
    maxWidth: "400px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "10px 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  status: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#333",
  },
};

export default App;
