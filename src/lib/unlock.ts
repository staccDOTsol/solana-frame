import { Connection, PublicKey } from '@solana/web3.js';
export default function isPublicKey(key: string): boolean {
  try {
    const _pubkey = new PublicKey(key);
    return true;
  } catch {
    return false;
  }
}
export const meetsRequirement = async (user: string, gate: any) => {
  const connection = new Connection(`https://mainnet.helius-rpc.com/?api-key=02befe47-b808-4837-8ce3-409c845b79bb`);
  if (!user) {
    return false;
  }
  if (!gate.contract) {
    return false;
  }
  const userPublicKey = new PublicKey(user);
  const mintPublicKey = new PublicKey(gate.contract);
  const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(userPublicKey, {
    mint: mintPublicKey
  });

  const requiredBalance = typeof gate.balance === "undefined" ? 1 : gate.balance;
  let balance = 0;

  for (const { account } of parsedTokenAccounts.value) {
    const accountInfo = account.data.parsed.info;
    if (accountInfo.tokenAmount.uiAmount) {
      balance += parseFloat(accountInfo.tokenAmount.uiAmount);
    }
  }

  // Time-dependent adjustment
  const creationTime = gate.time;
  const currentTime = Date.now();
  const deltaDays = (currentTime - creationTime) / (1000 * 60 * 60 * 24); // Delta in days

  // Adjusting the requirement based on the delta
  // This example reduces the required balance by 1% per day, with a minimum of 50% of the original requirement
  const timeAdjustedRequirement = Math.max(requiredBalance * 0.5, requiredBalance * (1 - 0.01 * deltaDays));

  return balance >= timeAdjustedRequirement;
};
