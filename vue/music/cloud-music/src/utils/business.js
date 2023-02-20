export function createSong (song) {
  const { id, name, picUrl, artists, duration, mvid, albumId } = song
  return {
    id, name, picUrl, artists, duration, mvid, albumId
  }
}
