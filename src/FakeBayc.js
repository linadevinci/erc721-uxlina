import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import FakeBaycToken from './abis/FakeBayc.json';

const FakeBayc = () => {
  const [name, setName] = useState('');
  const [totalSupply, setTotalSupply] = useState(null);
  const [error, setError] = useState(null);
  const [minting, setMinting] = useState(false);

  const CONTRACT_ADDRESS = '0xdecFAB04fb08cC5da6365C18B26A6B9b1D4BEDFE';

  useEffect(() => {
    fetchContractInfo();
  }, []);

  const fetchContractInfo = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, FakeBaycToken.abi, provider);

      // Fetch contract name and total supply
      const contractName = await contract.name();
      const supply = await contract.totalSupply();

      setName(contractName);
      setTotalSupply(Number(supply));
    } catch (err) {
      setError(err.message);
    }
  };

  const claimToken = async () => {
    try {
      setMinting(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, FakeBaycToken.abi, signer);

      // Call claimAToken function
      const tx = await contract.claimAToken();
      await tx.wait();

      // Refresh total supply
      const newSupply = await contract.totalSupply();
      setTotalSupply(Number(newSupply));
      setMinting(false);
    } catch (err) {
      setError(err.message);
      setMinting(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>{name || 'Loading...'}</h1>
      <p>Total Supply: {totalSupply !== null ? totalSupply : 'Loading...'}</p>
      
      <button 
        onClick={claimToken}
        disabled={minting}
        style={{
          padding: '10px 20px',
          margin: '20px 0',
          cursor: minting ? 'not-allowed' : 'pointer'
        }}
      >
        {minting ? 'Minting...' : 'Claim Token'}
      </button>

      {totalSupply > 0 && (
        <div>
          <h2>View Tokens:</h2>
          <ul>
            {[...Array(Number(totalSupply))].map((_, index) => (
              <li key={index}>
                <Link to={`/fakeBayc/${index}`}>Token #{index}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FakeBayc;