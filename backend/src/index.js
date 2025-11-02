import "dotenv/config";
import express from "express";
import cors from "cors";
import cache from "./cache.js";
import { makeClients } from "./blockchain.js";
import { ethers } from "ethers";

const PORT = process.env.PORT || 4000;
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const CERTIFICATE_ADDRESS = process.env.CERTIFICATE_ADDRESS;

const app = express();
app.use(cors());
app.use(express.json());

const chain = makeClients({ RPC_URL, CONTRACT_ADDRESS });
chain.startEventPolling();

// Initialize Certificate Service
import CertificateService from './certificate.js';
const certificateService = new CertificateService(chain.provider, CERTIFICATE_ADDRESS);

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.get("/api/counter/value", async (_, res) => {
  try {
    const value = await chain.readValue();
    res.json({ value });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/counter/events", (_, res) => {
  res.json({ events: cache.events });
});

// Certificate endpoints
app.get("/api/certificates/:tokenId", async (req, res) => {
  try {
    const details = await certificateService.getCertificateDetails(req.params.tokenId);
    res.json(details);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/certificates/owner/:address", async (req, res) => {
  try {
    const certificates = await certificateService.getCertificatesByOwner(req.params.address);
    res.json({ certificates });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/certificates/mint", async (req, res) => {
  try {
    const { to, title, achievementType, uri } = req.body;
    if (!to || !title || !achievementType || !uri) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const PK = process.env.SERVER_PK;
    if (!PK) return res.status(400).json({ error: "No SERVER_PK" });
    
    const wallet = new ethers.Wallet(PK, chain.provider);
    const writable = new ethers.Contract(
      CERTIFICATE_ADDRESS, 
      certificateService.contract.interface, 
      wallet
    );

    const tokenId = await writable.mintCertificate(to, title, achievementType, uri);
    const receipt = await tokenId.wait();
    res.json({ 
      tokenId: receipt.logs[0].args.tokenId,
      txHash: receipt.hash 
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Optional relay demo (DO NOT use in production without auth/rate-limit)
app.post("/api/relay-increment", async (req, res) => {
  try {
    const PK = process.env.SERVER_PK;
    if (!PK) return res.status(400).json({ error: "No SERVER_PK" });
    const wallet = new ethers.Wallet(PK, chain.provider);
    const writable = new ethers.Contract(CONTRACT_ADDRESS, ["function increment()"], wallet);
    const tx = await writable.increment();
    const rcpt = await tx.wait();
    res.json({ txHash: rcpt.hash });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`API running http://localhost:${PORT}`));
