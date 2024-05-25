import { createClient } from "@vercel/kv";

const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;

const kv = createClient({ url, token });

export default kv;
