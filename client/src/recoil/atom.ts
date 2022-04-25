import { atom } from 'recoil';
import { contentTypes } from '../types/channel/contentType';
import { ThemeMode } from '../types/common/themeTypes';

export const appThemeMode = atom<ThemeMode>({
  key: 'AppThemeMode',
  default: 'light',
});

export const isOpenSide = atom<boolean>({
  key: 'IsOpenSide',
  default: true,
});

export const isOpenChat = atom<boolean>({
  key: 'IsChatOpen',
  default: false,
});

export const channelMessage = atom<string>({
  key: 'ChannelMessage',
  default: '',
});

export const channelContents = atom<contentTypes[]>({
  key: 'ChannelContents',
  default: [],
});
