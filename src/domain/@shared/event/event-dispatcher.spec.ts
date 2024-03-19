import CustomerAddressChangedEvent from "../../customer/event/customer-address-changed.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import SendEmailConsoleLogHandler from "../../customer/event/handler/send-email-console-log-handlres";
import SendEmailConsoleLog1Handler from "../../customer/event/handler/send-email-console-log1-handler";
import SendEmailConsoleLog2Handler from "../../customer/event/handler/send-email-log2-handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventHandlerA = new SendEmailConsoleLogHandler();
    const eventHandlerB = new SendEmailConsoleLog1Handler();
    const eventHandlerC = new SendEmailConsoleLog2Handler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventHandlerB);
    eventDispatcher.register("CustomerCreatedEvent", eventHandlerC);
    eventDispatcher.register("CustomerAddressChangedEvent", eventHandlerA);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    //****

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
    ).toBe(2);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandlerA);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandlerB);
  });

  it("should unregister all event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventHandlerA = new SendEmailConsoleLogHandler();
    const eventHandlerB = new SendEmailConsoleLog1Handler();
    const eventHandlerC = new SendEmailConsoleLog2Handler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerAddressChangedEvent", eventHandlerA);
    eventDispatcher.register("CustomerCreatedEvent", eventHandlerB);
    eventDispatcher.register("CustomerCreatedEvent", eventHandlerC);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );

    //***

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandlerB);

    eventDispatcher.unregister("CustomerCreatedEvent", eventHandlerB);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
    ).toBe(1);

    eventDispatcher.unregister("CustomerCreatedEvent", eventHandlerC);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
    ).toBe(0);
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventHandlerA = new SendEmailConsoleLogHandler();
    const eventHandlerB = new SendEmailConsoleLog1Handler();
    const eventHandlerC = new SendEmailConsoleLog2Handler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    const spyEventHandler1 = jest.spyOn(eventHandlerA, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandlerB, "handle");
    const spyEventHandler3 = jest.spyOn(eventHandlerC, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerAddressChangedEvent", eventHandlerA);
    eventDispatcher.register("CustomerCreatedEvent", eventHandlerB);
    eventDispatcher.register("CustomerCreatedEvent", eventHandlerC);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
    ).toMatchObject(eventHandlerA);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandlerB);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandlerC);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      id: "123",
      nome: "Customer 1",
      endereco: "Customer 1 new address",
    });

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: "123",
      nome: "Customer 1",
      endereco: "Customer 1 new address",
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();

    // ***

    eventDispatcher.notify(customerAddressChangedEvent);

    expect(spyEventHandler1).toHaveBeenCalled();

    // ***

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler2).toHaveBeenCalled();
    expect(spyEventHandler3).toHaveBeenCalled();
  });
});