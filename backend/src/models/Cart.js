export default function defineCart(sequelize, DataTypes) {
  const Cart = sequelize.define(
    'Cart',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'abandoned', 'converted'),
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      tableName: 'carts',
      timestamps: true,
      indexes: [{ unique: true, fields: ['userId'] }],
    }
  );

  return Cart;
}


