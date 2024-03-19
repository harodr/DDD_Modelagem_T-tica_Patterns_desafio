import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";

export default class SendEmailConsoleLogHandler
  implements EventHandlerInterface<CustomerAddressChangedEvent>
{
  handle(event: CustomerAddressChangedEvent): void {
    let id = event.eventData.id;
    let nome = event.eventData.nome;
    let endereco = event.eventData.endereco;
    console.log(
      `Endereço do cliente: ${id}, ${nome} alterado para: ${endereco}`
    );
  }
}
