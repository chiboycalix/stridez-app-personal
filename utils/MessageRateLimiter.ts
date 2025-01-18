class MessageRateLimiter {
  private messageQueue: {
    message: any;
    channel: any;
    resolve: (value: unknown) => void;
  }[] = [];
  private isProcessing = false;
  private messageCount = 0;
  private resetInterval: NodeJS.Timeout | null = null;

  constructor(
    private maxMessages: number = 60,
    private intervalSeconds: number = 3
  ) {}

  async sendMessage(rtmChannel: any, message: any) {
    return new Promise((resolve) => {
      this.messageQueue.push({ message, channel: rtmChannel, resolve });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.messageQueue.length === 0) return;

    this.isProcessing = true;

    while (this.messageQueue.length > 0) {
      if (this.messageCount >= this.maxMessages) {
        this.isProcessing = false;
        return;
      }

      const { message, channel, resolve } = this.messageQueue.shift()!;

      try {
        await channel.sendMessage(message);
        this.messageCount++;
        resolve(true);
      } catch (error) {
        console.error("Error sending RTM message:", error);
        resolve(false);
      }
    }

    this.isProcessing = false;
  }

  startResetTimer() {
    if (this.resetInterval) return;

    this.resetInterval = setInterval(() => {
      this.messageCount = 0;
      if (this.messageQueue.length > 0 && !this.isProcessing) {
        this.processQueue();
      }
    }, this.intervalSeconds * 1000);
  }

  stopResetTimer() {
    if (this.resetInterval) {
      clearInterval(this.resetInterval);
      this.resetInterval = null;
    }
  }
}

export const rateLimiter = new MessageRateLimiter();
