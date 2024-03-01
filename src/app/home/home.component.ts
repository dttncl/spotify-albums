import { Component } from '@angular/core';
import { Album } from '../album';
import { Buffer } from 'buffer';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent {
  albums : Array<Album> = [];

  constructor(private spotifyService: SpotifyService) {  }

  ngOnInit() {
    this.albums = this.spotifyService.displayRecentAlbums();
  }

}