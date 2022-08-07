import { Observable, range, throwError, timer } from 'rxjs'
import { mergeMap, zip } from 'rxjs/operators'

export type RetryStrategy = {
  maxRetryAttempts?: number
  scalingDuration?: number
  excludedStatusCodes?: number[]
  excludedMessages?: string[]
}

export const genericRetryStrategy = ({
  maxRetryAttempts = 10,
  scalingDuration = 400,
  excludedStatusCodes = [],
  excludedMessages = [`The Internet connection appears to be offline.`],
}: RetryStrategy = {}) => (attempts: Observable<any>) => {
  return attempts.pipe(
    zip(range(0, maxRetryAttempts)),
    mergeMap(([error, retryAttempt]) => {
      if (
        retryAttempt === 5 ||
        excludedStatusCodes.find(e => e === error.staus) ||
        excludedMessages.find(e => e === error.message)
      ) {
        return throwError(error)
      }

      // console.log(`Delay retry by ${retryAttempt} second(s)`)
      return timer(retryAttempt * scalingDuration)
    })
  )
}
