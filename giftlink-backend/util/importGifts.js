require('dotenv').config();
const { connectToDatabase, closeDatabase } = require('../models/db');

const insertedItems = [
  { name: 'Lamp', category: 'Home Decor', condition: 'New', description: 'A beautifully crafted table lamp with a soft blue shade.', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600', date_added: new Date('2022-11-04'), owner_id: 'seed-user', comments: [] },
  { name: 'Curtain', category: 'Home Decor', condition: 'Older', description: 'These curtains have been the backdrop of my study for years.', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600', date_added: new Date('2020-12-31'), owner_id: 'seed-user', comments: [] },
  { name: 'Bookshelf', category: 'Furniture', condition: 'Like New', description: 'Sturdy wooden bookshelf, five tiers, minimal wear.', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600', date_added: new Date('2021-01-20'), owner_id: 'seed-user', comments: [] },
  { name: 'Dining Table', category: 'Furniture', condition: 'Like New', description: 'Solid wood dining table, seats six comfortably.', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600', date_added: new Date('2023-03-15'), owner_id: 'seed-user', comments: [] },
  { name: 'Office Chair', category: 'Furniture', condition: 'New', description: 'Ergonomic mesh-back office chair, barely used.', image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600', date_added: new Date('2024-01-10'), owner_id: 'seed-user', comments: [] },
  { name: 'Microwave Oven', category: 'Kitchen', condition: 'Older', description: 'Works perfectly, upgrading to a bigger one.', image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600', date_added: new Date('2019-08-22'), owner_id: 'seed-user', comments: [] },
  { name: 'Winter Jacket', category: 'Clothing', condition: 'Like New', description: 'Warm padded jacket, size Medium.', image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600', date_added: new Date('2023-11-02'), owner_id: 'seed-user', comments: [] },
  { name: 'Bookshelf Speaker Set', category: 'Electronics', condition: 'New', description: 'Bluetooth bookshelf speakers, still boxed.', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600', date_added: new Date('2024-05-01'), owner_id: 'seed-user', comments: [] },
  { name: "Children's Storybook Set", category: 'Books', condition: 'Older', description: 'A collection of ten storybooks, well loved.', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600', date_added: new Date('2018-06-12'), owner_id: 'seed-user', comments: [] },
  { name: 'Coffee Table', category: 'Furniture', condition: 'Like New', description: 'Round glass-top coffee table, minor wear on the legs.', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600', date_added: new Date('2022-04-18'), owner_id: 'seed-user', comments: [] },
  { name: 'Blender', category: 'Kitchen', condition: 'New', description: 'High-speed blender, used only twice.', image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600', date_added: new Date('2024-02-09'), owner_id: 'seed-user', comments: [] },
  { name: 'Yoga Mat', category: 'Sports', condition: 'Like New', description: 'Non-slip yoga mat, barely used.', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600', date_added: new Date('2023-09-14'), owner_id: 'seed-user', comments: [] },
  { name: 'Wall Clock', category: 'Home Decor', condition: 'Older', description: 'Vintage-style wall clock, working condition.', image: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=600', date_added: new Date('2017-05-30'), owner_id: 'seed-user', comments: [] },
  { name: 'Study Desk', category: 'Furniture', condition: 'New', description: 'Compact study desk, flat-packed, unopened.', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600', date_added: new Date('2024-06-20'), owner_id: 'seed-user', comments: [] },
  { name: "Kids' Bicycle", category: 'Sports', condition: 'Older', description: "Kids' bicycle, size 16-inch wheels, some rust.", image: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=600', date_added: new Date('2019-03-11'), owner_id: 'seed-user', comments: [] },
  { name: 'Wireless Headphones', category: 'Electronics', condition: 'Like New', description: 'Over-ear wireless headphones, includes case.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', date_added: new Date('2023-12-25'), owner_id: 'seed-user', comments: [] }
];

async function importItems() {
  const db = await connectToDatabase();
  const gifts = db.collection('gifts');

  await gifts.deleteMany({});
  const result = await gifts.insertMany(insertedItems);

  console.log(`${result.insertedCount} document(s) imported successfully into inserted_items.`);
  await closeDatabase();
}

importItems().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});