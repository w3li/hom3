/* Builds atomic Buy‑Edition transaction + Bundlr upload */
import { NextResponse } from 'next/server';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi';
import { createDelegatePrintV1 } from '@metaplex-foundation/mpl-token-metadata';
import Bundlr from '@bundlr-network/client';
import delegateKey from '../../../../../../delegate-keypair.json';

export async function POST(request: Request) {
  const { masterEdition, buyer, metadataJson, priceLamports } = await request.json();
  const umi = createUmi(process.env.NEXT_PUBLIC_RPC_URL!);
  umi.use(keypairIdentity(delegateKey));

  /* 1 · Upload metadata */
  const bundlr = new Bundlr(
    process.env.NEXT_PUBLIC_BUNDLR_NODE!,
    process.env.NEXT_PUBLIC_BUNDLR_CURRENCY!,
    delegateKey.secretKey
  );
  const { id } = await bundlr.upload(JSON.stringify(metadataJson));
  const uri = `https://arweave.net/${id}`;

  /* 2 · Build tx */
  const tx = await createDelegatePrintV1(umi, {
    mint: publicKey(masterEdition),
    delegate: umi.identity.publicKey,
    buyer: publicKey(buyer),
    payer: publicKey(buyer),
    metadataUri: uri,
    price: BigInt(priceLamports),
  }).buildAndSign();

  return NextResponse.json(Buffer.from(tx).toString('base64'));
}
