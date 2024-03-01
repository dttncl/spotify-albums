import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';
import { Album } from './album';

@Injectable({
  providedIn: 'root'
})

export class SpotifyService {
  client_id = '2975874d026e40f48153f609602a8578'; 
  client_secret = '8ae92a55c7f349b7b725c44a2b2444ed'; 

  constructor() {
    this.initialize()
  }

  async getToken(client_id: string, client_secret: string) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: new URLSearchParams({
        'grant_type' : 'client_credentials',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
      }
    });

    return await response.json();
  }

  async getRecentReleases(access_token : string) {
    const response = await fetch('https://api.spotify.com/v1/browse/new-releases?offset=0', {
      method: 'GET',
      headers: {
        'Authorization' : 'Bearer ' + access_token
      },
    });

    return await response.json();
  }

  async getYearAlbum(date:string, access_token: string) {
    const arrDate = date.split('-');

    const response = await fetch(`https://api.spotify.com/v1/search?q=year:${arrDate[0]}&type=album`, {
      method: 'GET',
      headers: {
        'Authorization' : 'Bearer ' + access_token
      },
    });

    return await response.json();
  }

  initialize() {

  }

  displayRecentAlbums() {
    const albums : Array<Album> = [];
    this.getToken(this.client_id, this.client_secret).then(res => {
      this.getRecentReleases(res.access_token).then(album => {
        const recent_albums = album.albums.items;
        for (let i = 0; i < recent_albums.length; i++) {

          let album : Album = {
            name: recent_albums[i].name,
            artist: recent_albums[i].artists[0].name,
            release_date: recent_albums[i].release_date,
            album_uri: recent_albums[i].external_urls.spotify,
            image: recent_albums[i].images[2].url,
          }

          albums[i] = album;
          //console.log(this.albums[i]);
        }
      });
    })  

    return albums
  }

  displayYearAlbum(date:string) : Promise<Album> {
    return new Promise((resolve, reject) => {
      this.getToken(this.client_id, this.client_secret).then(res => {
        this.getYearAlbum(date,res.access_token).then(album => {

          const birthday_albums = album.albums.items;
          const no_albums = birthday_albums.length;
          const rand = this.getRandomInt(no_albums);

          const yearAlbum : Album = {
            name: birthday_albums[rand].name,
            artist: birthday_albums[rand].artists[0].name,
            release_date: birthday_albums[rand].release_date,
            album_uri: birthday_albums[rand].uri,
            image: birthday_albums[rand].images[1].url,
          }

          if (yearAlbum.release_date === date) {
            console.log("HAPPY BIRTHDAY!!");
          }

          resolve(yearAlbum)
        })   

      })
    })

  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
}