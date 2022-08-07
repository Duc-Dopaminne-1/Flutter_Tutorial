import { ImageSize } from '@/shared/image'
import { WorkerQueue } from '@/worker/workerQueue'

enum DownloadProgress {
  PROCESSING,
  PENDING,
  COMPLETE,
}

export class WorkerDownload extends WorkerQueue<number> {
  add(processId: string): void {
    // super.add(processId, WorkerDownload.PROCESSING)
    this._buffer.get(ImageSize.XL).set(processId, DownloadProgress.PROCESSING)
  }

  isProcessing(processId: string): boolean {
    return this.get(processId) === DownloadProgress.PROCESSING
  }
}
