import { NextRequest } from "next/server";
import { createPublicClient, http, isAddress } from "viem";
import { createSignature } from "@/lib/signature";
import { getChain } from "@/lib/chain";

export async function GET(req: NextRequest, { params: { chainId } }: { params: { chainId: string } }) {
  try {
    const address = req.nextUrl.searchParams.get("address");
    if (!address || !isAddress(address)) {
      return new Response("Invalid address", { status: 400 });
    }

    const chain = getChain(chainId);
    if (!chain) {
      return new Response("Non supported chainId", { status: 400 });
    }
    const client = createPublicClient({ chain, transport: http() })
    const txCount = await client.getTransactionCount({ address });
    const mint_eligibility = txCount > 0;
    const data = txCount.toString();

    const signature = await createSignature({ address, mint_eligibility, data });

    return Response.json({ signature, mint_eligibility, data }, { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}
