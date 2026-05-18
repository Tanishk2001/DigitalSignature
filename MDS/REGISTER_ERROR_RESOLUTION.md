# Register Error Resolution

## Problem

When clicking Register, the frontend showed an error related to MongoDB replica set status:
- `not primary and secondaryOk=false`

This means the backend was connected to a secondary Atlas shard host and could not perform write operations.

## Root Cause

The backend `.env` was configured to use a direct Atlas host that was not the primary host.
In a MongoDB replica set, writes must go to the primary node.

## Files updated

- `DigitalSignature/backend/.env`

## Fix steps

1. Identify the Atlas replica set primary host.
2. Use a temporary connection script to query each shard host:
   ```js
   const uri = 'mongodb://DigitalSignature:DigitalSignature%402026@HOST:27017/admin?tls=true&directConnection=true&authSource=admin';
   // send { hello: 1 } and inspect isWritablePrimary
   ```
3. Confirm the primary host from the output:
   - In this case, `cluster0-shard-00-01.qxtr6.mongodb.net:27017` was the primary.
4. Update `DigitalSignature/backend/.env` with the primary host:
   ```text
   MONGODB_URI=mongodb://DigitalSignature:DigitalSignature%402026@cluster0-shard-00-01.qxtr6.mongodb.net:27017/DigitalSignature?tls=true&directConnection=true&authSource=admin&retryWrites=true&w=majority
   ```
5. Restart the backend server to apply the new connection string.
6. Test the backend health endpoint:
   - `http://localhost:5000/api/health`
7. Retry registration in the frontend.

## Why this fixes it

- The Atlas primary host accepts write operations.
- The `directConnection=true` parameter ensures Node connects directly to that host without SRV lookup.
- The username/password were already URL-encoded correctly.

## Result

After updating the `.env` connection string to the primary host and restarting the backend, registration should work normally and the write error should disappear.
