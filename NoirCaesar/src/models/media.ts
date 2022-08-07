export type IMediaType = 'IMAGE' | 'VIDEO';

export type IMedia = {
  id: string;
  source: string;
  type: IMediaType;
  image?: string;
};

export interface IVideo {
  id: string;
  videoType: string;
  url: string;
  title: string;
}

export interface IVideoModel {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  image_thumb: string;
  genres: [];
  episode: IEpisode;
}

export interface IAudioModel {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  image_thumb: string;
  genres: [];
  episode: IEpisode;
}

export interface IEpisode {
  id: string;
  name: string;
  image: string;
  image_thumb: string;
  duration: 0;
}
