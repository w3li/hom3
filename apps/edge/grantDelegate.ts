import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { delegatePrintDelegateV1 } from '@metaplex-foundation/mpl-token-metadata';
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi';

export default async (req: Request): Promise<Response> => {
  const { masterEdition, creator } = await req.json();
  const umi = createUmi(process.env.NEXT_PUBLIC_RPC_URL!);
  umi.use(keypairIdentity(require('../../delegate-keypair.json')));

  await delegatePrintDelegateV1(umi, {
    mint: publicKey(masterEdition),
    delegate: umi.identity.publicKey,
    authority: publicKey(creator),
  }).sendAndConfirm(umi);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

