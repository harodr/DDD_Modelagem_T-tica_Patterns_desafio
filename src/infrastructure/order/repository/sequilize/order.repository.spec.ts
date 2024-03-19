import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  

  it("should create a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    const product1 = new Product("456", "Product 2", 10);
    await productRepository.create(product);
    await productRepository.create(product1);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      1
    );

    const orderItem1 = new OrderItem(
      "2",
      product1.name,
      product1.price,
      product1.id,
      1
    );

    const order = new Order("123", "123", [orderItem, orderItem1]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: "123",
          product_id: "456",
        },
      ],
    });
  });


 it("should update a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);

    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      1
    );

    const orderItem1 = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    let order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    let orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });

    order.changeOrderItem([orderItem1]);

    await orderRepository.update(order);

    orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });
  
  
  it("should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const customer1 = new Customer("456", "Customer 2");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    const address1 = new Address("Street 2", 1, "Zipcode 2", "City 2");
    customer.changeAddress(address);
    customer1.changeAddress(address1);
    await customerRepository.create(customer);
    await customerRepository.create(customer1);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    const product1 = new Product("456", "Product 2", 10);
    await productRepository.create(product);
    await productRepository.create(product1);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      1
    );

    const orderItem1 = new OrderItem(
      "2",
      product1.name,
      product1.price,
      product1.id,
      1
    );

    const order = new Order("123", customer.id, [orderItem]);
    const order1 = new Order("456", customer1.id, [orderItem1]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    await orderRepository.create(order1);

    const orderFound = await orderRepository.find(order.id);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: orderFound.customerId,
      total: orderFound.total(),
      items: [
        {
          id: "1",
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: order.id,
          product_id: orderItem.productId,
        },
      ],
    });
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const customer1 = new Customer("456", "Customer 2");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    const address1 = new Address("Street 2", 1, "Zipcode 2", "City 2");
    customer.changeAddress(address);
    customer1.changeAddress(address1);
    await customerRepository.create(customer);
    await customerRepository.create(customer1);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    const product1 = new Product("456", "Product 2", 10);
    await productRepository.create(product);
    await productRepository.create(product1);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      1
    );

    const orderItem1 = new OrderItem(
      "2",
      product1.name,
      product1.price,
      product1.id,
      1
    );

    const order = new Order("123", customer.id, [orderItem]);
    const order1 = new Order("456", customer1.id, [orderItem1]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    await orderRepository.create(order1);

    const orderFound = await orderRepository.findAll();

    const orderModel = await OrderModel.findAll({
      include: ["items"],
    });

    const jsonString = JSON.stringify(orderModel);
    const obj = JSON.parse(jsonString);

    expect(orderModel[0].toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: 10,
      items: [
        {
          id: "1",
          name: product.name,
          price: product.price,
          quantity: 1,
          order_id: orderModel[0].id,
          product_id: product.id,
        },
      ],
    });

    expect(orderModel[1].toJSON()).toStrictEqual({
      id: "456",
      customer_id: "456",
      total: 10,
      items: [
        {
          id: "2",
          name: product1.name,
          price: product1.price,
          quantity: 1,
          order_id: orderModel[1].id,
          product_id: product1.id,
        },
      ],
    });
  });
});
