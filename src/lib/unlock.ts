import { Connection, PublicKey } from '@solana/web3.js';

export const meetsRequirement = async (user: string, gate: any) => {
  const connection = new Connection(`https://api.mainnet-beta.solana.com`);
  const userPublicKey = new PublicKey(user);
  const mintPublicKey = new PublicKey(gate.token);
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

