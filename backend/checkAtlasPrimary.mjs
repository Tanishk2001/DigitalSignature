import mongoose from 'mongoose';

const hosts = [
  'cluster0-shard-00-00.qxtr6.mongodb.net:27017',
  'cluster0-shard-00-01.qxtr6.mongodb.net:27017',
  'cluster0-shard-00-02.qxtr6.mongodb.net:27017'
];

async function check(host) {
  const uri = `mongodb://DigitalSignature:DigitalSignature%402026@${host}/admin?tls=true&directConnection=true&authSource=admin`;
  console.log('Testing', host);
  try {
    const conn = await mongoose.createConnection(uri, { serverSelectionTimeoutMS: 10000 }).asPromise();
    const admin = conn.db.admin();
    const res = await admin.command({ hello: 1 });
    console.log(host, 'role=', res.ismaster || res.isWritablePrimary || res.isWritablePrimary === true ? 'primary' : 'secondary', 'hello=', res);
    await conn.close();
  } catch (err) {
    console.error(host, 'err', err.message || err);
  }
}

(async () => {
  for (const host of hosts) {
    await check(host);
  }
  process.exit(0);
})();
