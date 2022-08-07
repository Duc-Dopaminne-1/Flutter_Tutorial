import { ImageSize } from '@/shared/image'
import { WorkerQueue } from '@/worker/workerQueue'
import { Task } from '@/worker/options'

export class WorkerFailure extends WorkerQueue<Task> {
  add(processId: string, task: Task): void {
    this._buffer.get(ImageSize.XL).set(processId, task)
  }
}
