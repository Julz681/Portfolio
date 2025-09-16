/**
 * Class representing the main character Pepe. Extends DrawableObject.
 */
class Character extends MovableObject {
  height = 280;
  y = 80;
  speed = 10;

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGE_THROW = ["img/2_character_pepe/1_idle/throw_pepe.png"];

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  isThrowing = false;
  world;
  wasAboveGround = false;

  energy = 100;
  lastHitTime = 0;

  lastActiveTime = Date.now();
  currentIdleIndex = 0;
  currentLongIdleIndex = 0;
  idleAnimationInterval = null;
  longIdleAnimationInterval = null;
  isLongIdlePlaying = false;
  hurtSoundPlaying = false;

  canMove = true;
  isStunned = false;

  /**
   * Constructor: loads images, applies gravity and starts animation loops.
   */
  constructor() {
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadAllImages();
    this.applyGravity();
    this.animate();
  }

  /** Loads all animation images into cache */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGE_THROW);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
  }

  /** Starts animation loops for movement and states */
  animate() {
    setInterval(() => {
      if (!this.world || this.world.isPaused) return;
      this.handleMovement();
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    setInterval(() => {
      if (!this.world || this.world.isPaused) return;
      this.handleAnimations();
      this.onLand();
      this.checkIdleTimeout();
    }, 20);
  }

  /** Handles character movement input and actions */
  handleMovement() {
    if (!this.world || !this.canMove) return;

    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.resetIdleTimer();
    } else if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      this.resetIdleTimer();
    }

    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.resetIdleTimer();
    }
  }

  /** Handles animations depending on state */
  handleAnimations() {
    if (!this.world) return;
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
      this.stopIdleAnimations();
      return;
    }
    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      this.stopIdleAnimations();
      return;
    }
    if (this.isThrowing) {
      this.loadImage(this.IMAGE_THROW[0]);
      this.stopIdleAnimations();
      return;
    }
    if (this.isAboveGround()) {
      this.animateJump();
      this.stopIdleAnimations();
      return;
    }
    if (this.isMoving()) {
      this.playAnimation(this.IMAGES_WALKING);
      this.stopIdleAnimations();
      this.resetIdleTimer();
      return;
    }
    this.startIdleAnimationIfNeeded();
  }

  /** Starts idle animation if no other animation is running */
  startIdleAnimationIfNeeded() {
    if (!this.idleAnimationInterval && !this.longIdleAnimationInterval) {
      this.startIdleAnimation();
    }
  }

  /** Checks if character is currently moving */
  isMoving() {
    if (!this.world) return false;
    return (
      this.world.keyboard.RIGHT ||
      this.world.keyboard.LEFT ||
      this.world.keyboard.SPACE ||
      this.isThrowing
    );
  }

  /** Animates jumping frames based on vertical speed */
  animateJump() {
    if (this.speedY > 5) {
      this.img = this.imageCache[this.IMAGES_JUMPING[2]];
    } else if (this.speedY > -5) {
      this.img = this.imageCache[this.IMAGES_JUMPING[4]];
    } else {
      this.img = this.imageCache[this.IMAGES_JUMPING[7]];
    }
  }

  /** Initiates jump if on ground */
  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 25;
      this.playJumpSound();
    }
  }

  /** Plays the jump sound */
  playJumpSound() {
    if (this.world?.sounds?.jump_sound) {
      this.world.sounds.jump_sound.currentTime = 0;
      this.world.sounds.jump_sound.volume = 0.2;
      this.world.sounds.jump_sound.play();
    }
  }

  /** Updates state on landing */
  onLand() {
    if (!this.wasAboveGround && this.isAboveGround()) {
      this.wasAboveGround = true;
    }
    if (this.wasAboveGround && !this.isAboveGround()) {
      this.wasAboveGround = false;
      this.loadImage(this.IMAGES_JUMPING[8]);
    }
  }

  /** Handles character being hit, applies damage and effects */
  hit() {
    if (this.isInImmunity()) return;
    this.lastHitTime = Date.now();
    if (this.energy > 0) {
      this.decreaseEnergy();
      this.showHurtAnimation();
      this.playHurtSoundIfNeeded();
      this.applyKnockback();
      this.resetAnimationAfterDelay();
      if (this.energy === 0) this.die();
    }
  }

  /** Checks if character is currently immune from damage */
  isInImmunity() {
    return Date.now() - this.lastHitTime < 1000;
  }

  /** Decreases energy by damage amount */
  decreaseEnergy() {
    this.energy -= 20;
    if (this.energy < 0) this.energy = 0;
  }

  /** Displays hurt animation */
  showHurtAnimation() {
    this.loadImage(this.IMAGES_HURT[0]);
  }

  /** Plays hurt sound once per immunity period */
  playHurtSoundIfNeeded() {
    if (this.world?.soundManager && !this.hurtSoundPlaying) {
      this.world.soundManager.playHurtSound();
      this.hurtSoundPlaying = true;
      setTimeout(() => (this.hurtSoundPlaying = false), 1000);
    }
  }

  /** Applies knockback effect and disables movement briefly */
  applyKnockback() {
    if (this.isStunned) return;
    this.isStunned = true;
    this.canMove = false;
    const knockbackDistance = 20;
    const knockbackDuration = 300;
    if (this.otherDirection) {
      this.x += knockbackDistance;
    } else {
      this.x -= knockbackDistance;
    }
    setTimeout(() => {
      this.canMove = true;
      this.isStunned = false;
    }, knockbackDuration);
  }

  /** Resets hurt animation back to idle after delay */
  resetAnimationAfterDelay() {
    setTimeout(() => {
      if (!this.isDead()) {
        this.loadImage(this.IMAGES_IDLE[0]);
      }
    }, 300);
  }

  /** Checks if character is dead */
  isDead() {
    return this.energy === 0;
  }

  /** Checks if character is in hurt state */
  isHurt() {
    return Date.now() - this.lastHitTime < 1500 && this.energy > 0;
  }

  /** Handles death logic */
  die() {
    this.loadImage(this.IMAGES_DEAD[0]);
    this.stopIdleAnimations();
  }

  /** Starts the idle animation */
  startIdleAnimation() {
    if (this.idleAnimationInterval) return;
    this.isLongIdlePlaying = false;
    this.currentIdleIndex = 0;
    this.idleAnimationInterval = setInterval(() => {
      this.loadImage(this.IMAGES_IDLE[this.currentIdleIndex]);
      this.currentIdleIndex++;
      if (this.currentIdleIndex >= this.IMAGES_IDLE.length) {
        this.currentIdleIndex = 0;
      }
    }, 150);
    if (this.world?.soundManager) {
      this.world.soundManager.stopSnoring();
    }
  }

  /** Starts the long idle animation */
  startLongIdleAnimation() {
    if (this.longIdleAnimationInterval) return;
    this.isLongIdlePlaying = true;
    this.currentLongIdleIndex = 0;
    this.longIdleAnimationInterval = setInterval(() => {
      this.loadImage(this.IMAGES_LONG_IDLE[this.currentLongIdleIndex]);
      this.currentLongIdleIndex++;
      if (this.currentLongIdleIndex >= this.IMAGES_LONG_IDLE.length) {
        this.currentLongIdleIndex = 0;
      }
    }, 150);
    if (this.world?.soundManager) {
      this.world.soundManager.playSnoring();
    }
  }

  /** Stops any running idle animations */
  stopIdleAnimations() {
    if (this.idleAnimationInterval) {
      clearInterval(this.idleAnimationInterval);
      this.idleAnimationInterval = null;
    }
    if (this.longIdleAnimationInterval) {
      clearInterval(this.longIdleAnimationInterval);
      this.longIdleAnimationInterval = null;
    }
    this.isLongIdlePlaying = false;
    if (this.world?.soundManager) {
      this.world.soundManager.stopSnoring();
    }
  }

  /** Resets the idle timer to prevent idle animations */
  resetIdleTimer() {
    this.lastActiveTime = Date.now();
    if (this.isLongIdlePlaying) {
      this.stopIdleAnimations();
      this.startIdleAnimation();
    }
  }

  /**
   * Checks if idle animations should start based on inactivity timeout
   */
  checkIdleTimeout() {
    if (!this.isMoving() && !this.isDead() && !this.isHurt()) {
      if (Date.now() - this.lastActiveTime > 5000 && !this.isLongIdlePlaying) {
        this.stopIdleAnimations();
        this.startLongIdleAnimation();
      }
    } else {
      if (this.isLongIdlePlaying) {
        this.stopIdleAnimations();
        this.startIdleAnimation();
      }
    }
  }
}
