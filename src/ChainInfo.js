/*import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ChainInfo = ({ userAddress }) => {
  const [chainId, setChainId] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getChainInfo = async () => {
      try {
        if (!window.ethereum) {
          throw new Error('Please install MetaMask');
        }

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const blockNumber = await window.ethereum.request({ method: 'eth_blockNumber' });

        setChainId(chainId);
        setBlockNumber(parseInt(blockNumber, 16));
      } catch (err) {
        setError(err.message);
      }
    };

    getChainInfo();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chain Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Chain ID</h3>
            <p>{chainId ? parseInt(chainId, 16) : 'Not connected'}</p>
          </div>
          
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Latest Block</h3>
            <p>{blockNumber || 'Not available'}</p>
          </div>
          
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Your Address</h3>
            <p className="truncate">{userAddress || 'Not connected'}</p>
          </div>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};*/
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ChainInfo = () => {
  const [chainId, setChainId] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Connect to MetaMask and get chain information
  useEffect(() => {
    const getChainInfo = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);

          // Request user account and chain information
          const accounts = await provider.send("eth_requestAccounts", []);
          const currentChainId = await provider.getNetwork();
          const latestBlock = await provider.getBlockNumber();

          // Set state with the fetched data
          setUserAddress(accounts[0]);
          setChainId(currentChainId.chainId.toString());

          console.log(chainId);

          if (currentChainId.chainId.toString() !== "17000") {
            window.location.href="/error"; 
          }

          setBlockNumber(latestBlock);
        } catch (err) {
          setErrorMessage("Error fetching chain info. Make sure you're connected to the Holesky network.");
        }
      } else {
        setErrorMessage("MetaMask is not installed.");
      }
    };

    getChainInfo();
  }, []);

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (  
    <div>
      <h2>Chain Information</h2>
      <p><strong>Chain ID:</strong> {chainId}</p>
      <p><strong>Last Block Number:</strong> {blockNumber}</p>
      <p><strong>User Address:</strong> {userAddress}</p>
    </div>
  );
};

export default ChainInfo;