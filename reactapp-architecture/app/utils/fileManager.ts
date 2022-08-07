import RNFetchBlob from 'react-native-fetch-blob'

export class FileManager {
  static path(id: string) {
    const cacheDir = RNFetchBlob.fs.dirs.CacheDir
    return `${cacheDir}/ShowSourcing/5/${id}.png`
  }
}
