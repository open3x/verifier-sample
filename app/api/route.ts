import { NextRequest } from "next/server";
import { isAddress } from "viem";
import { createSignature } from "@/lib/signature";

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address");
    if (!address || !isAddress(address)) {
      return new Response("Invalid address", { status: 400 });
    }

    // Your verify logic
    const result = true;
    const counter = BigInt(0); // If the credential type is not numeric, return the result of the contract call condition and a numeric representation of the condition (1 for true, 0 for false)

    const signature = await createSignature({ address, result, counter });

    return Response.json({ signature, result, counter: counter.toString() }, { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}
