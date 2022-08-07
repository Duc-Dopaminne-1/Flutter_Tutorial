class NotificationWorker {
  private status = false;

  setStatus(status: boolean) {
    this.status = status;
  }

  getStatus() {
    return this.status;
  }
}

export const notificationWorker = new NotificationWorker();
