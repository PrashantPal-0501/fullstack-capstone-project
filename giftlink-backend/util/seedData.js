require('dotenv').config();
const { connectToDatabase, closeDatabase } = require('../models/db');

const moreGifts = [
  {
    name: 'Dining Table',
    category: 'Furniture',
    condition: 'Like New',
    description: 'Solid wood dining table, seats six comfortably, minor scratches on the surface.',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600',
    date_added: new Date('2023-03-15'),
    owner_id: 'seed-user',
    comments: []
  },
  {
    name: 'Office Chair',
    category: 'Furniture',
    condition: 'New',
    description: 'Ergonomic mesh-back office chair, still has the plastic wrap on the armrests.',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600',
    date_added: new Date('2024-01-10'),
    owner_id: 'seed-user',
    comments: []
  },
  {
    name: 'Microwave Oven',
    category: 'Kitchen',
    condition: 'Older',
    description: 'Works perfectly, just upgrading to a bigger one. 700W, compact size.',
    image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600',
    date_added: new Date('2019-08-22'),
    owner_id: 'seed-user',
    comments: []
  },
  {
    name: 'Winter Jacket',
    category: 'Clothing',
    condition: 'Like New',
    description: 'Warm padded jacket, size Medium, worn only a couple of times.',
    image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600',
    date_added: new Date('2023-11-02'),
    owner_id: 'seed-user',
    comments: []
  },
  {
    name: 'Bookshelf Speaker Set',
    category: 'Electronics',
    condition: 'New',
    description: 'Bluetooth bookshelf speakers, still boxed, unwanted gift.',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600',
    date_added: new Date('2024-05-01'),
    owner_id: 'seed-user',
    comments: []
  },
  {
    name: "Children's Storybook Set",
    category: 'Books',
    condition: 'Older',
    description: 'A collection of ten storybooks, well loved but all pages intact.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600',
    date_added: new Date('2018-06-12'),
    owner_id: 'seed-user',
    comments: []
  }
];

async function addMore() {
  const db = await connectToDatabase();
  const gifts = db.collection('gifts');

  const result = await gifts.insertMany(moreGifts);
  console.log(`Inserted ${result.insertedCount} more gifts.`);

  await closeDatabase();
}

addMore().catch(err => {
  console.error('Failed to add gifts:', err);
  process.exit(1);
});