import {Song, SongSheet} from './common.types';

export interface User {
  // 等级
  level?: number;

  // 听歌记录
  listenSongs?: number;

  profile: {
    userId: number;
    nickname: string;
    avatarUrl: string;
    backgroundUrl: string;
    signature: string;

    // 性别
    gender: number;

    // 粉丝
    followeds: number;

    // 关注
    follows: number;

    // 动态
    eventCount: number;
  };
}

export interface Singin {
  code: number;
  point?: number;
  msg?: string;
}

export interface RecordVal {
  playCount: number;
  score: number;
  song: Song;
}

type recordKey = 'weekData' | 'allData';

export type UserRecord = {
  [key in recordKey]: RecordVal
};

export interface UserSheet {
  self: SongSheet[];
  subscribed: SongSheet[];
}
