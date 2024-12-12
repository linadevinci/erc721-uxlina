/*import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';

const FakeBaycToken = ({ provider }) => {
  const { tokenId } = useParams();
  const [tokenMetadata, setTokenMetadata] = useState(null);
  const [error, setError] = useState(null);

  const fakeBaycAddress = '0x1dA89342716B14602664626CD3482b47D5C2005E'; // Fake BAYC Contract Address

  useEffect(() => {
    const fetchTokenMetadata = async () => {
      try {
        const contract = new ethers.Contract(fakeBaycAddress, fakeBaycABI, provider);
        const tokenURI = await contract.tokenURI(tokenId);
        const response = await fetch(tokenURI);
        const metadata = await response.json();
        setTokenMetadata(metadata);
      } catch (err) {
        setError('Token does not exist.');
      }
    };

    fetchTokenMetadata();
  }, [tokenId, provider]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Fake BAYC Token {tokenId}</h2>
      {tokenMetadata ? (
        <div>
          <img src={tokenMetadata.image} alt={tokenMetadata.name} />
          <p>{tokenMetadata.name}</p>
          <p>{tokenMetadata.description}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FakeBaycToken;


*/

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import FakeBaycABI from './abis/FakeBayc.json';

const FakeBaycToken = () => {
  const { tokenId } = useParams();
  const [tokenMetadata, setTokenMetadata] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fakeBaycAddress = '0xdecFAB04fb08cC5da6365C18B26A6B9b1D4BEDFE';

  // Helper function to convert IPFS URL to Gateway URL
  const getIPFSGatewayURL = (ipfsURL) => {
    if (!ipfsURL) return '';
    
    // If it's already using a gateway, return as is
    if (ipfsURL.startsWith('http')) return ipfsURL;
    
    // Remove ipfs:// prefix if present
    const cleanURL = ipfsURL.replace('ipfs://', '');
    
    // Return gateway URL (using Pinata gateway for reliability)
    return `https://gateway.pinata.cloud/ipfs/${cleanURL}`;
  };

  useEffect(() => {
    const fetchTokenMetadata = async () => {
      try {
        if (!window.ethereum) {
          throw new Error('Please install MetaMask');
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(fakeBaycAddress, FakeBaycABI.abi, provider);

        try {
          await contract.ownerOf(tokenId);
        } catch {
          throw new Error('Token does not exist');
        }

        const tokenURI = await contract.tokenURI(tokenId);
        console.log('Original Token URI:', tokenURI); // Debug log

        // Convert token URI to gateway URL
        const gatewayURL = getIPFSGatewayURL(tokenURI);
        console.log('Gateway URL:', gatewayURL); // Debug log

        const response = await fetch(gatewayURL);
        if (!response.ok) {
          throw new Error('Failed to fetch token metadata');
        }
        
        const metadata = await response.json();
        console.log('Metadata:', metadata); // Debug log

        // Convert image URL to gateway URL
        if (metadata.image) {
          metadata.image = getIPFSGatewayURL(metadata.image);
          console.log('Image URL:', metadata.image); // Debug log
        }

        setTokenMetadata(metadata);
      } catch (err) {
        console.error('Error:', err); // Debug log
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenMetadata();
  }, [tokenId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        color: '#e74c3c' 
      }}>
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>
        Fake BAYC Token #{tokenId}
      </h2>

      {tokenMetadata && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <img 
              src={tokenMetadata.image} 
              alt={tokenMetadata.name}
              style={{
                width: '100%',
                maxWidth: '400px',
                height: 'auto',
                borderRadius: '8px'
              }}
              onError={(e) => {
                console.error('Image failed to load:', e.target.src); // Debug log
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Available';
              }}
            />
          </div>

          <h3>{tokenMetadata.name}</h3>
          <p style={{ marginBottom: '20px' }}>{tokenMetadata.description}</p>
          
          {tokenMetadata.attributes && tokenMetadata.attributes.length > 0 && (
            <div>
              <h3>Attributes</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px',
                marginTop: '10px'
              }}>
                {tokenMetadata.attributes.map((attr, index) => (
                  <div key={index} style={{
                    padding: '10px',
                    backgroundColor: '#1a237e',
                    borderRadius: '6px'
                  }}>
                    <strong>{attr.trait_type}:</strong> {attr.value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FakeBaycToken;