// import Redis from "ioredis";
// const REDIS_URL = process.env.REDIS_URL || "";
// const redis = new Redis(REDIS_URL);

// export default redis;

import { createClient } from "@vercel/kv";

const url = process.env.KV_REST_API_URL || "";
const token = process.env.KV_REST_API_TOKEN || "";

const kv = createClient({ url, token });

export default kv;
