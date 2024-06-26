import { extractChain } from "viem";
import * as chains from "viem/chains";

export function getChain(id: number | string) {
  // @ts-ignore
  return extractChain({ chains: Object.values(chains), id: Number(id) });
}
