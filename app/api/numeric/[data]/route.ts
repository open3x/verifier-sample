import { NextRequest } from "next/server";
import { isAddress } from "viem";
import { createSignature } from "@/lib/signature";

export async function GET(req: NextRequest, { params: { data } }: { params: { data: string } }) {
  try {
    const address = req.nextUrl.searchParams.get("address");
    if (!address || !isAddress(address)) {
      return new Response("Invalid address", { status: 400 });
    }

    const result = true;
    const signature = await createSignature({ address, result, data });

    return Response.json({ signature, result, data }, { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}
