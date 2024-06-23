import { NextRequest } from "next/server";
import { createPublicClient, http, isAddress } from "viem";
import { base } from "viem/chains";
import { createSignature } from "@/lib/signature";

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address");
    if (!address || !isAddress(address)) {
      return new Response("Invalid address", { status: 400 });
    }

    const client = createPublicClient({ chain: base, transport: http(process.env.RPC_BASE) })
    const txCount = await client.getTransactionCount({ address });
    const result = txCount > 0;
    const counter = BigInt(txCount > 0);

    const signature = await createSignature({ address, result, counter });

    return Response.json({ signature, result, counter: counter.toString() }, { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}
