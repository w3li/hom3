import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createDelegatePrintV1 } from '@metaplex-foundation/mpl-token-metadata';
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi';
import Bundlr from '@bundlr-network/client';

export default async (req: Request): Promise<Response> => {
  const { masterEdition, priceLamports, buyer, fileBuffer, metadataJson } = await req.json();
  const umi = createUmi(process.env.NEXT_PUBLIC_RPC_URL!);
  umi.use(keypairIdentity(require('../../delegate-keypair.json')));

  // 1) Upload metadata
  const bundlr = new Bundlr(process.env.NEXT_PUBLIC_BUNDLR_NODE!, process.env.NEXT_PUBLIC_BUNDLR_CURRENCY!, umi.identity.secretKey);
  const { id } = await bundlr.upload(JSON.stringify(metadataJson));
  const uri = `https://arweave.net/${id}`;

  // 2) Mint & collect payment
  const tx = await createDelegatePrintV1(umi, {
    mint: publicKey(masterEdition),
    delegate: umi.identity.publicKey,
    buyer: publicKey(buyer),
    payer: publicKey(buyer),
    metadataUri: uri,
    price: BigInt(priceLamports),
  }).buildAndSign();

  return new Response(tx.serialize(), { status: 200 });
};


