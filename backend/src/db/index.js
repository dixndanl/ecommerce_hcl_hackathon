import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import defineUser from '../models/User.js';
import defineAddress from '../models/Address.js';
import defineCart from '../models/Cart.js';
import defineCartItem from '../models/CartItem.js';
import defineOrder from '../models/Order.js';
import defineOrderItem from '../models/OrderItem.js';

const databaseUrl = process.env.DATABASE_URL;
const isSslRequired =
  String(process.env.DB_SSL || '').toLowerCase() === 'true' ||
  (databaseUrl && /sslmode=require/i.test(databaseUrl));
const dialectOptions = isSslRequired ? { ssl: { require: true, rejectUnauthorized: false } } : {};

export const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      dialect: 'postgres',
      logging: false,
      dialectOptions,
    })
  : new Sequelize(
      process.env.DB_NAME || 'ecommerce',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        dialect: 'postgres',
        logging: false,
        dialectOptions,
      }
    );

export const User = defineUser(sequelize, DataTypes);
export const Address = defineAddress(sequelize, DataTypes);
export const Cart = defineCart(sequelize, DataTypes);
export const CartItem = defineCartItem(sequelize, DataTypes);
export const Order = defineOrder(sequelize, DataTypes);
export const OrderItem = defineOrderItem(sequelize, DataTypes);

// Associations
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses', onDelete: 'CASCADE' });
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(Cart, { foreignKey: 'userId', as: 'cart', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

export async function syncAndSeed() {
  await sequelize.authenticate();
  await sequelize.sync();

  const count = await User.count();
  if (count === 0) {
    const adminPass = bcrypt.hashSync('adminpass', 10);
    const userPass = bcrypt.hashSync('userpass', 10);
    await User.bulkCreate([
      { email: 'admin@example.com', name: 'Admin User', role: 'admin', passwordHash: adminPass },
      { email: 'user@example.com', name: 'Normal User', role: 'user', passwordHash: userPass },
    ]);
  }
}


