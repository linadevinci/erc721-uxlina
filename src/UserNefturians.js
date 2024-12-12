import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import FakeNefturiansABI from './abis/FakeNefturians.json';

const UserNefturians = () => {
  const { userAddress } = useParams();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CONTRACT_ADDRESS = '0x92Da472BE336A517778B86D7982e5fde0C7993c1';

  useEffect(() => {
    fetchUserTokens();
  }, [userAddress]);

  const fetchUserTokens = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, FakeNefturiansABI.abi, provider);

      // Get user's token balance
      const balance = await contract.balanceOf(userAddress);
      const tokenCount = Number(balance);

      // Fetch all tokens for this user
      const tokenPromises = [];
      for (let i = 0; i < tokenCount; i++) {
        const tokenIdPromise = contract.tokenOfOwnerByIndex(userAddress, i)
          .then(async (tokenId) => {
            const uri = await contract.tokenURI(tokenId);
            const response = await fetch(uri);
            const metadata = await response.json();
            return {
              id: Number(tokenId),
              name: metadata.name,
              description: metadata.description,
              image: metadata.image
            };
          });
        tokenPromises.push(tokenIdPromise);
      }

      const userTokens = await Promise.all(tokenPromises);
      setTokens(userTokens);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tokens:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ 
      backgroundColor: '#0d1b2a',
      color: 'white',
      padding: '20px'
    }}>Loading tokens...</div>;
  }

  if (error) {
    return <div style={{ 
      backgroundColor: '#0d1b2a',
      color: 'white',
      padding: '20px'
    }}>Error: {error}</div>;
  }

  return (
    <div style={{ 
      backgroundColor: '#0d1b2a',
      color: 'white',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <h2>Tokens owned by {userAddress}</h2>
      
      {tokens.length === 0 ? (
        <p>This address owns no tokens</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
          padding: '20px'
        }}>
          {tokens.map(token => (
            <div key={token.id} style={{
              backgroundColor: '#1e3a8a',
              borderRadius: '8px',
              padding: '15px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3>Token #{token.id}</h3>
              <p><strong>Name:</strong> {token.name}</p>
              <p><strong>Description:</strong> {token.description}</p>
              {token.image && (
                <img 
                  src={token.image} 
                  alt={token.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '4px',
                    marginTop: '10px'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserNefturians;