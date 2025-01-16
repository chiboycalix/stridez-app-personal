class MessageRateLimiter {
  private queue: Array<{
    message: any;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }> = [];
  private isProcessing = false;
  private messageCount = 0;
  private resetTimer: NodeJS.Timeout | null = null;

  private readonly MAX_MESSAGES = 160;
  private readonly RESET_INTERVAL = 3000;

  async sendMessage(channel: any, message: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queue.push({ message, resolve, reject });
      this.processQueue(channel);
    });
  }

  private async processQueue(channel: any) {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    try {
      while (this.queue.length > 0) {
        if (this.messageCount >= this.MAX_MESSAGES) {
          // Wait for the reset interval
          await new Promise((resolve) =>
            setTimeout(resolve, this.RESET_INTERVAL)
          );
          this.messageCount = 0;
        }

        const { message, resolve, reject } = this.queue.shift()!;

        try {
          await channel.sendMessage(message);
          this.messageCount++;
          resolve(true);
        } catch (error) {
          reject(error);
        }

        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    } finally {
      this.isProcessing = false;
    }
  }

  startResetTimer() {
    if (this.resetTimer) return;

    this.resetTimer = setInterval(() => {
      this.messageCount = 0;
    }, this.RESET_INTERVAL);
  }

  stopResetTimer() {
    if (this.resetTimer) {
      clearInterval(this.resetTimer);
      this.resetTimer = null;
    }
  }
}

export const rateLimiter = new MessageRateLimiter();
