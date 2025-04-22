/* Grants Print‑Delegate authority to our backend keypair */
import { NextResponse } from 'next/server';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi';
import { delegatePrintDelegateV1 } from '@metaplex-foundation/mpl-token-metadata';
import delegateKey from '../../../../../../delegate-keypair.json'; // adjust path if needed

export async function POST(request: Request) {
  const { masterEdition, creator } = await request.json();

  const umi = createUmi(process.env.NEXT_PUBLIC_RPC_URL!);
  umi.use(keypairIdentity(delegateKey));

  const tx = await delegatePrintDelegateV1(umi, {
    mint: publicKey(masterEdition),
    delegate: umi.identity.publicKey,
    authority: publicKey(creator),
  }).buildAndSign();

  return NextResponse.json(Buffer.from(tx).toString('base64'));  // send serialized tx
}
