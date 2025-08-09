import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

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

export const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    indexes: [{ unique: true, fields: ['email'] }],
  }
);

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


