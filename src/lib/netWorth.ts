import { publicClient } from "../lib/veimClient";
import { formatEther, isAddress, formatUnits } from "viem";
import redis from "./redisClient";

const fetchNetWorth = async (address: `0x${string}`): Promise<any> => {
  try {
    if (!isAddress(address)) {
      throw new Error("Invalid Ethereum address");
    }
    const balance = await publicClient.getBalance({ address });
    const ethValueInEther = parseFloat(formatEther(balance));
    const ethPrice = await fetchEthPrice(); 
    const ethValueInUSD = ethValueInEther * ethPrice;

    console.log(`ETH Value (in USD): ${ethValueInUSD}`);

    const tokenBalances = await fetchTokenBalances(address);

    console.log(`Token Balances:`, tokenBalances);

    let tokenValueInUSD = 0;
    for (const token of tokenBalances) {
      const tokenPrice = await fetchTokenPrice(token.contractAddress);
      console.log(
        `Token: ${token.contractAddress}, Balance: ${token.balance}, Price: ${tokenPrice}`
      );
      tokenValueInUSD += token.balance * tokenPrice;
    }

    const netWorth = ethValueInUSD + tokenValueInUSD;

    console.log(`Net Worth Before Multiplyer: ${netWorth}`);

    return { ethValue: ethValueInUSD, netWorth, tokenValue: tokenValueInUSD };
  } catch (error) {
    console.error("Error fetching net worth:", error);
    throw error;
  }
};

const fetchTokenBalances = async (address: string) => {
  try {
    const response = await fetch(
      `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=latest&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`
    );
    const data = await response.json();
    const transactions = data.result;
    console.log("transactions", transactions);

    const tokenBalances = new Map<string, number>();

    transactions.forEach((tx: any) => {
      const contractAddress = tx.contractAddress;
      const tokenDecimal = parseInt(tx.tokenDecimal);
      const tokenValue = parseFloat(formatUnits(tx.value, tokenDecimal));

      if (!tokenBalances.has(contractAddress)) {
        tokenBalances.set(contractAddress, 0);
      }

      if (tx.to.toLowerCase() === address.toLowerCase()) {
        tokenBalances.set(
          contractAddress,
          tokenBalances.get(contractAddress)! + tokenValue
        );
      } else if (tx.from.toLowerCase() === address.toLowerCase()) {
        tokenBalances.set(
          contractAddress,
          tokenBalances.get(contractAddress)! - tokenValue
        );
      }
    });

    return Array.from(tokenBalances.entries()).map(
      ([contractAddress, balance]) => ({
        contractAddress,
        balance,
      })
    );
  } catch (error) {
    console.error("Error fetching token balances:", error);
    throw error;
  }
};

const fetchTokenPrice = async (address: string): Promise<number> => {
  const cacheKey = `tokenPrice:${address.toLowerCase()}`;

  try {
    const cachedPrice: string | null = await redis.get(cacheKey);
    if (cachedPrice) {  
      return parseFloat(cachedPrice);
    }

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${address}&vs_currencies=usd`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    const price = data[address.toLowerCase()]?.usd;

    if (price) {
      await redis.set(cacheKey, price.toString());
      return price;
    } else {
      console.log(`Price not found for token at address ${address}`);
      return 0;
    }
  } catch (error) {
    console.log(`Error fetching token price for ${address}:`, error);
    return 0;
  }
};

const fetchEthPrice = async (): Promise<number> => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    const ethPrice = data.ethereum.usd;

    if (ethPrice) {
      return ethPrice;
    } else {
      console.log("Price not found for Ethereum");
      return 3900;
    }
  } catch (error) {
    console.log("Error fetching Ethereum price:", error);
    return 3900;
  }
};

export default fetchNetWorth;
