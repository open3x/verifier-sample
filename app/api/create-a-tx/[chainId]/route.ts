import { NextRequest } from "next/server";
import { createPublicClient, extractChain, http, isAddress } from "viem";
import * as chains from 'viem/chains'
import { createSignature } from "@/lib/signature";

function getChain(id: number | string) {
  // @ts-ignore
  return extractChain({ chains: Object.values(chains), id: Number(id) });
}

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
    const result = txCount > 0;
    const counter = BigInt(txCount > 0 ? 1 : 0);

    const signature = await createSignature({ address, result, counter });

    return Response.json({ signature, result, counter: counter.toString() }, { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}
