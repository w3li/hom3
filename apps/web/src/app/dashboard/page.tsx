'use client';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Dashboard() {
  const { connected, publicKey } = useWallet();
  return (
    <main className="p-8 max-w-xl mx-auto">
      {!connected ? (
        <p className="text-xl">Connect Phantom from the top‑right.</p>
      ) : (
        <>
          <p className="mb-4">Wallet: {publicKey?.toBase58().slice(0, 8)}…</p>
          <button id="enable" className="btn">Enable Sales</button>
          <button id="buy"    className="btn ml-4">Buy Edition</button>
        </>
      )}
    </main>
  );
}
