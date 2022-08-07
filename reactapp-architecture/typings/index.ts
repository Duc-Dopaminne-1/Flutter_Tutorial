interface Console {
  tron(...value: any[]): void
}

interface String {
  capitalize(): void
}

interface Array<T> {
  move(from: number, to: number): T[]
}

interface ArrayBuffer {
  toImage(): string
}
