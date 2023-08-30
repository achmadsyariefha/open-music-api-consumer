const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(id) {
    const queryPlaylist = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [id],
    };

    const querySongs = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
          JOIN playlist_songs ON playlist_songs."songId" = songs.id
          WHERE playlist_songs."playlistId" = $1`,
      values: [id],
    };

    const playlistResult = await this._pool.query(queryPlaylist);
    const songsResult = await this._pool.query(querySongs);

    return {
      playlist: {
        id: playlistResult.rows[0].id,
        name: playlistResult.rows[0].name,
        songs: songsResult.rows,
      },
    };
  }
}

module.exports = PlaylistsService;
