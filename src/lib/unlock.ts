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
  if (!user  || !isPublicKey(user) || user.indexOf("0x") !== 0) {
    return false;
  }
  if (!gate.contract || !isPublicKey(gate.contract)) {
    return false;
  }
  const userPublicKey = new PublicKey(user);
  const mintPublicKey = new PublicKey(gate.contract);
  const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(userPublicKey, {
    mint: mintPublicKey,
    programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
  });

  const requiredBalance = typeof gate.balance === "undefined" ? 1 : parseInt(gate.balance, 10);
  let balance = 0;

  for (const { account } of parsedTokenAccounts.value) {
    const accountInfo = account.data.parsed.info;
    if (accountInfo.tokenAmount.uiAmount) {
      balance += accountInfo.tokenAmount.uiAmount;
    }
  }

  return balance >= requiredBalance;
};

