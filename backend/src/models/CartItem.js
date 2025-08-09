export default function defineCartItem(sequelize, DataTypes) {
  const CartItem = sequelize.define(
    'CartItem',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      cartId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      productId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: { min: 1 },
      },
      thumbnailUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      tableName: 'cart_items',
      timestamps: true,
      indexes: [{ fields: ['cartId'] }, { fields: ['productId'] }],
    }
  );

  return CartItem;
}


