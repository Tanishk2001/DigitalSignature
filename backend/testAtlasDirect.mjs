import mongoose from 'mongoose';

const uri = 'mongodb://DigitalSignature:DigitalSignature%402026@cluster0-shard-00-00.qxtr6.mongodb.net:27017/DigitalSignature?tls=true&directConnection=true&authSource=admin&retryWrites=true&w=majority';
console.log('trying', uri);

mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log('connected');
    process.exit(0);
  })
  .catch(err => {
    console.error('connect-failure:', err);
    process.exit(1);
  });
