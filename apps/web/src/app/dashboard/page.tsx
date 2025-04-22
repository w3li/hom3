'use client';
import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import bs58 from 'bs58';

export default function Dashboard() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [masterEdition, setMasterEdition] = useState('');

  const postJSON = async (url: string, body: any) =>
    fetch(url, { method: 'POST', body: JSON.stringify(body) }).then((r) => r.json());

  const enableSales = async () => {
    if (!publicKey || !masterEdition) return alert('Connect wallet and paste Master‑Edition address');
    const txB64 = await postJSON('/api/enable', { masterEdition, creator: publicKey.toBase58() });
    const signature = await sendTransaction(
      Buffer.from(txB64, 'base64'),
      connection,
      { skipPreflight: false }
    );
    alert(`Delegate granted 🎉  Tx: ${signature}`);
  };

  const buyEdition = async () => {
    const metadataJson = { name: 'Demo Print', symbol: 'PRINT', image: 'https://placekitten.com/400' };
    const txB64 = await postJSON('/api/mint', {
      masterEdition,
      buyer: publicKey?.toBase58(),
      metadataJson,
      priceLamports: 10000000  // 0.01 SOL
    });
    const sig = await sendTransaction(Buffer.from(txB64, 'base64'), connection);
    alert(`Edition minted! ${sig}`);
  };

  return (
    <main className="p-8 space-y-6">
      <WalletMultiButton />
      <input
        placeholder="Paste Master‑Edition address"
        value={masterEdition}
        onChange={(e) => setMasterEdition(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button onClick={enableSales} className="btn">Enable Sales</button>
      <button onClick={buyEdition} className="btn">Buy Edition</button>
    </main>
  );
}
