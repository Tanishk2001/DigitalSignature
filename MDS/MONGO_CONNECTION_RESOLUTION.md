# MongoDB Connection Resolution

## Problem

The backend could not connect to MongoDB via Atlas using the initial SRV URI.
The error shown was:
- `querySrv ECONNREFUSED _mongodb._tcp.cluster0.qxtr6.mongodb.net`
- Later, when using a direct host list, it returned `Server selection timed out`.

## Root Causes

1. Atlas SRV lookup was blocked or failing in the Node runtime.
2. The backend was using a connection string that required SRV DNS resolution.
3. A secondary host was accidentally used for direct connection, causing write failures.

## Files updated

- `DigitalSignature/backend/.env`
- `DigitalSignature/backend/server.js` (backend restart after fix)

## Fix steps

1. Confirm Atlas cluster status is healthy and running.
2. Check Atlas network access:
   - Add current IP address from Atlas Network Access.
   - Confirm the database user exists with proper credentials.
3. Verify DNS and port connectivity:
   - `nslookup -type=SRV _mongodb._tcp.cluster0.qxtr6.mongodb.net`
   - `Test-NetConnection cluster0-shard-00-00.qxtr6.mongodb.net -Port 27017`
4. URL-encode special characters in the password:
   - `DigitalSignature@2026` becomes `DigitalSignature%402026`.
5. Test direct connection to a single Atlas shard host:
   - Use `directConnection=true` to avoid SRV lookup.
6. Update `DigitalSignature/backend/.env` with a working direct Atlas URI:
   ```text
   MONGODB_URI=mongodb://DigitalSignature:DigitalSignature%402026@cluster0-shard-00-01.qxtr6.mongodb.net:27017/DigitalSignature?tls=true&directConnection=true&authSource=admin&retryWrites=true&w=majority
   ```
7. Restart the backend server:
   ```powershell
   powershell -NoProfile -Command "Set-Location 'C:\Users\aj\Desktop\labmentix\DigitalSignature\backend'; npm run dev"
   ```
8. Confirm the backend is running and connected:
   - Open `http://localhost:5000/api/health`
   - The response should include: `✅ Digital Signature API is running`

## Notes

- Using `directConnection=true` bypassed the Atlas SRV DNS issue.
- The direct connection was tested successfully with a temporary Node script.
- The final working URI points at the actual primary host for Atlas writes.
