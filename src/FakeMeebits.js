/*import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import FakeMeebitsClaimerABI from './abis/FakeMeebitsClaimer.json';
import FakeMeebitsABI from './abis/FakeMeebits.json';

const FakeMeebits = () => {
  const [selectedToken, setSelectedToken] = useState('');
  const [claimedTokens, setClaimedTokens] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const MEEBITS_ADDRESS = '0x238cb11301e9fEA82A7aD6C37137690185138eAE';
  const CLAIMER_ADDRESS = '0x9B6F990793347005bb8a252A67F0FA4d56521447';

  useEffect(() => {
    checkClaimedTokens();
  }, []);

  const checkClaimedTokens = async () => {
    try {
      if (!window.ethereum) throw new Error('Please install MetaMask');

      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Create contract instances
      const meebitsContract = new ethers.Contract(
        MEEBITS_ADDRESS,
        FakeMeebitsABI.abi,
        provider
      );
      
      const claimerContract = new ethers.Contract(
        CLAIMER_ADDRESS,
        FakeMeebitsClaimerABI.abi,
        provider
      );

      const claimed = new Set();
      // Check first 20 tokens
      for (let i = 0; i < 20; i++) {
        try {
          // Try to get owner of token to check if it's minted
          await meebitsContract.ownerOf(i);
          claimed.add(i);
        } catch {
          // If ownerOf reverts, the token hasn't been minted yet
          continue;
        }
      }
      setClaimedTokens(claimed);
      setLoading(false);
    } catch (err) {
      console.error('Error checking claimed tokens:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ 
      backgroundColor: '#0d1b2a', 
      color: 'white', 
      padding: '20px' 
    }}>
      Loading available tokens...
    </div>;
  }

  return (
    <div style={{ 
      backgroundColor: '#0d1b2a', 
      color: 'white',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <h2>Fake Meebits</h2>

      <div style={{ marginTop: '20px' }}>
        <h3>Select a Token</h3>
        <p>Click on an available token to select it</p>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
          gap: '10px',
          marginTop: '20px'
        }}>
          {[...Array(20)].map((_, index) => (
            <div
              key={index}
              onClick={() => !claimedTokens.has(index) && setSelectedToken(index.toString())}
              style={{
                padding: '10px',
                textAlign: 'center',
                backgroundColor: claimedTokens.has(index) 
                  ? '#4a5568' 
                  : selectedToken === index.toString()
                    ? '#2c5282'
                    : '#3182ce',
                borderRadius: '8px',
                cursor: claimedTokens.has(index) ? 'not-allowed' : 'pointer',
                opacity: claimedTokens.has(index) ? 0.5 : 1,
                border: selectedToken === index.toString() ? '2px solid white' : 'none'
              }}
            >
              {index}
              <div style={{ 
                fontSize: '12px', 
                marginTop: '4px' 
              }}>
                {claimedTokens.has(index) ? 'Claimed' : 'Available'}
              </div>
            </div>
          ))}
        </div>

        {selectedToken && (
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#2c5282',
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0' }}>Selected Token: #{selectedToken}</h4>
            <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
              This token is available to be claimed
            </p>
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
    </div>
  );
};

export default FakeMeebits;*/