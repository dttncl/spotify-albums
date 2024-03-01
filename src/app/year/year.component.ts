import { Component } from '@angular/core';
import { SpotifyService } from '../spotify.service';
import { Album } from '../album';

@Component({
  selector: 'app-year',
  templateUrl: './year.component.html',
  styleUrl: './year.component.sass'
})
export class YearComponent {
  album : Album = {
    name: '',
    artist: '',
    release_date: '',
    album_uri: '',
    image: ''
  }

  result : string = "Start Now!"

  constructor(private spotifyService : SpotifyService) {

  }

  searchBirthdate(date: string) {
    this.spotifyService.displayYearAlbum(date)
        .then(album => {
            this.album = album;
            if (album.release_date == date) {
              let nowYear = new Date();
              let age = nowYear.getFullYear() - Number(album.release_date.split("-")[0])
              this.result = `You found it! ${album.name} by ${album.artist} was released on ${album.release_date}.\nWhich makes you ${age} years old!`
            } else {
              this.result = "Try Again!"
            }
            //console.log("Birthday Album: ", this.album);
        })
  }


  ngOnInit() {
    const dateStr = "1999-02-23";
    this.spotifyService.displayYearAlbum(dateStr)
        .then(album => {
            this.album = album;
            //console.log("Birthday Album: ", this.album);
        })

  }
}