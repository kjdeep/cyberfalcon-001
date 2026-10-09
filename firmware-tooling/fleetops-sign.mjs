#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash, createPrivateKey, createPublicKey, createSign, createVerify } from 'node:crypto';

const args = process.argv.slice(2);
const command = args[0];
const flag = (name) => args[args.indexOf(name) + 1];
const sha256 = (data) => createHash('sha256').update(data).digest('hex');

if (!['sign', 'verify'].includes(command)) {
  console.error('Usage: fleetops-sign.mjs sign <image> --key <private.pem> --out <manifest.json> | verify <image> --manifest <manifest.json> --public-key <public.pem>');
  process.exit(2);
}
const imagePath = args[1];
const image = readFileSync(imagePath);
if (command === 'sign') {
  const key = createPrivateKey(readFileSync(flag('--key')));
  const signer = createSign('SHA256');
  signer.update(image);
  const signature = signer.sign(key, 'base64');
  const manifest = { schema: 'fleetops.firmware/v1', image: imagePath, sha256: sha256(image), signature, signedAt: new Date().toISOString(), riskFlags: [] };
  writeFileSync(flag('--out'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(JSON.stringify({ ok: true, sha256: manifest.sha256, output: flag('--out') }));
} else {
  const manifest = JSON.parse(readFileSync(flag('--manifest'), 'utf8'));
  const verifier = createVerify('SHA256');
  verifier.update(image);
  const digestOk = sha256(image) === manifest.sha256;
  const signatureOk = verifier.verify(createPublicKey(readFileSync(flag('--public-key'))), manifest.signature, 'base64');
  if (!digestOk || !signatureOk) { console.error(JSON.stringify({ ok: false, digestOk, signatureOk })); process.exit(1); }
  console.log(JSON.stringify({ ok: true, digestOk, signatureOk }));
}
