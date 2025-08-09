export default function defineOrder(sequelize, DataTypes) {
  const Order = sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('created', 'paid', 'shipped', 'cancelled', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'created',
      },
      totalAmount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shippingAddressId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      shippingAddressSnapshot: {
        type: DataTypes.JSONB || DataTypes.JSON,
        allowNull: true,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB || DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: 'orders',
      timestamps: true,
      indexes: [{ fields: ['userId'] }],
    }
  );

  return Order;
}


