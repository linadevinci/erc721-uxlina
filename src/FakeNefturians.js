import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import FakeNefturiansABI from './abis/FakeNefturians.json';

const FakeNefturians = () => {
  const [tokenPrice, setTokenPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buying, setBuying] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const navigate = useNavigate();

  const CONTRACT_ADDRESS = '0x92Da472BE336A517778B86D7982e5fde0C7993c1';

  useEffect(() => {
    fetchTokenPrice();
    getUserAddress();
  }, []);

  const getUserAddress = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setUserAddress(accounts[0]);
    }
  };

  const fetchTokenPrice = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, FakeNefturiansABI.abi, provider);

      const price = await contract.tokenPrice();
      console.log("Minimum token price:", price.toString());
      setTokenPrice(price);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching price:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const buyToken = async () => {
    try {
      setBuying(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Calculate payment amount (minimum price + extra amount)
      const extraAmount = ethers.parseEther("0.000001"); // Adding 0.000001 ETH extra
      const paymentAmount = tokenPrice + extraAmount;
      
      console.log("Minimum price:", tokenPrice.toString());
      console.log("Payment amount:", paymentAmount.toString());

      const tx = await signer.sendTransaction({
        to: CONTRACT_ADDRESS,
        data: "0x83d0bfa5", // buyAToken function selector
        value: paymentAmount,
        gasLimit: 300000
      });

      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);

      if (receipt.status === 1) {
        alert('Token purchased successfully!');
      } else {
        throw new Error('Transaction failed');
      }
    } catch (err) {
      console.error('Error buying token:', err);
      setError(err.message);
    } finally {
      setBuying(false);
    }
  };

  const viewMyTokens = () => {
    if (userAddress) {
      navigate(`/fakeNefturians/${userAddress}`);
    }
  };

  const getSuggestedPrice = () => {
    if (!tokenPrice) return "0";
    const extraAmount = ethers.parseEther("0.000001");
    return ethers.formatEther(tokenPrice + extraAmount);
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#0d1b2a',
      color: 'white',
      minHeight: '100vh'
    }}>
      <h2>Fake Nefturians</h2>
      
      {tokenPrice && (
        <div style={{ marginTop: '20px' }}>
          <p><strong>Minimum Token Price:</strong> {ethers.formatEther(tokenPrice)} ETH</p>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>
            (You must pay more than this amount to mint a token)
          </p>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>
            Suggested payment: {getSuggestedPrice()} ETH
          </p>
          <button
            onClick={buyToken}
            disabled={buying}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: buying ? '#4a5568' : '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: buying ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              marginRight: '10px'
            }}
          >
            {buying ? 'Purchasing...' : 'Buy Token'}
          </button>

          <button
            onClick={viewMyTokens}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#4a5568',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            View My Tokens
          </button>
        </div>
      )}

      {error && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#fc8181', 
          color: 'white',
          borderRadius: '5px' 
        }}>
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default FakeNefturians;