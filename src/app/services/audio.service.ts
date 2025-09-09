import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private playingAudio: HTMLAudioElement | null = null;
  public async playAudio(name: string, loop?: number, vol?: number) {
    this.playingAudio = null;
    this.playingAudio = await this.playSounds(name);
    for (let index = 0; index < (loop || 0); index++) {
      this.playingAudio?.addEventListener('ended', () => {
        this.playingAudio?.play();
      });
    }
  }
  public stopAudio() {
    this.playingAudio?.pause();
  }

  async playSounds(name = 'success'): Promise<HTMLAudioElement | null> {
    try {
      const audio = new Audio(`assets/audio/${name}`);
      await audio.play();

      return audio;
    } catch (error) {
      // Error: NotAllowedError: play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD
      console.error('Failed to play sounds', error);
    }

    return null;
  }
}
