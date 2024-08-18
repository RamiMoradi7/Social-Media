import { Message } from "../models/Message";

class MessagesService {
  public async sendMessage(message: Message): Promise<void> {
    const formData = new FormData();
  }
}

export const messagesService = new MessagesService();
