/**
 * Manages all game sound effects and music.
 */
class SoundManager {
  /**
   * @param {World} world - Reference to the game world.
   */
  constructor(world) {
    this.world = world;
  }

  /** Initializes all sound objects with their audio files. */
  initSounds() {
    this.world.sounds = {
      background: new Audio("audio/background.mp3"),
      gamePaused: new Audio("audio/game_paused.mp3"),
      bottleFind: new Audio("audio/bottle_find.mp3"),
      coin: new Audio("audio/coin.mp3"),
      heart: new Audio("audio/heart.mp3"),
      throw: new Audio("audio/throw.mp3"),
      hurt: new Audio("audio/hurt.mp3"),
      die: new Audio("audio/die.mp3"),
      bottleBreak: new Audio("audio/bottle_break.mp3"),
      chickenDie: new Audio("audio/chicken_die.mp3"),
      endbossHurt: new Audio("audio/endboss_hurt.mp3"),
      endbossDie: new Audio("audio/endboss_die.mp3"),
      applause: new Audio("audio/applause.mp3"),
      jump_sound: new Audio("audio/jump.mp3"),
      snoring: new Audio("audio/snoring.mp3"),
    };
    this.world.sounds.snoring.loop = true;
  }

  /** Mutes all sounds and pauses any currently playing audio. */
  muteAllSounds() {
    Object.values(this.world.sounds).forEach((sound) => {
      sound.muted = true;
      if (!sound.paused) sound.pause();
    });
    this.world.isMuted = true;
    localStorage.setItem("isMuted", "true");
    this.world.updateMuteIcon();
  }

  /** Unmutes all sounds and resumes background music if appropriate. */
  unmuteAllSounds() {
    Object.values(this.world.sounds).forEach((sound) => {
      sound.muted = false;
    });
    if (
      !this.world.isPaused &&
      !this.world.isGameOver &&
      this.world.sounds.background.paused
    ) {
      this.world.sounds.background.play();
    }
    this.world.isMuted = false;
    localStorage.setItem("isMuted", "false");
    this.world.updateMuteIcon();
  }

  /**
   * Plays the snoring sound if not muted and not already playing.
   */
  playSnoring() {
    if (this.world.isMuted) return;
    const snore = this.world.sounds.snoring;
    if (snore.paused) {
      snore.currentTime = 0;
      snore.play();
    }
  }

  /**
   * Stops the snoring sound if it is currently playing.
   */
  stopSnoring() {
    const snore = this.world.sounds.snoring;
    if (!snore.paused) {
      snore.pause();
      snore.currentTime = 0;
    }
  }

  /** Plays the sound effect for throwing a bottle. */
  playThrowSound() {
    this.world.sounds.throw.currentTime = 0;
    this.world.sounds.throw.play();
  }

  /** Plays the sound effect when the character is hurt. */
  playHurtSound() {
    const hurtSound = this.world.sounds.hurt;
    if (!hurtSound) return;

    if (hurtSound.paused) {
      hurtSound.currentTime = 0;
      hurtSound.play();
    }
  }

  /** Plays the sound effect when a chicken dies. */
  playChickenDieSound() {
    this.world.sounds.chickenDie.currentTime = 0;
    this.world.sounds.chickenDie.play();
  }

  /** Plays the sound effect when the endboss is hurt. */
  playEndbossHurtSound() {
    this.world.sounds.endbossHurt.currentTime = 0;
    this.world.sounds.endbossHurt.play();
  }

  /** Plays the sound effect when a bottle is collected. */
  playBottleFindSound() {
    this.world.sounds.bottleFind.currentTime = 0;
    this.world.sounds.bottleFind.play();
  }

  /** Plays the sound effect when a coin is collected. */
  playCoinSound() {
    this.world.sounds.coin.currentTime = 0;
    this.world.sounds.coin.volume = 0.5;
    this.world.sounds.coin.play();
  }

  /** Plays the sound effect when a heart is collected. */
  playHeartSound() {
    this.world.sounds.heart.currentTime = 0;
    this.world.sounds.heart.play();
  }

  /** Plays the sound effect when the character dies. */
  playDieSound() {
    this.world.sounds.die.currentTime = 0;
    this.world.sounds.die.play();
  }

  /** Plays the sound effect when the endboss dies. */
  playEndbossDieSound() {
    this.world.sounds.endbossDie.currentTime = 0;
    this.world.sounds.endbossDie.play();
  }

  /** Pauses and resets the background music. */
  pauseBackgroundSound() {
    this.world.sounds.background.pause();
    this.world.sounds.background.currentTime = 0;
  }
}
