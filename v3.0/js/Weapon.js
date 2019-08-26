"use strict";

import GameObject from "./GameObject.js"
import Bullet from "./Bullet.js"

class Weapon extends GameObject {
  constructor(props, owner, game) {
    super(props, game);
    this.owner = owner;
    this.game = game;

    this.maxRoundsInMagazine = 10;
    this.rateOfFire = 0.3;
    this.reloadTime = 5;
    this.currentRoundsInMagazine = this.maxRoundsInMagazine;
    this.currentRateOfFire = this.rateOfFire;
    this.currentReloadTime = this.reloadTime;

    this.bullets = [];
  }

  update(deltaTime) {
    this.x = this.owner.x + this.owner.w / 2;
    this.y = this.owner.y + this.owner.h / 2 - this.h / 2;

    this.bullets.forEach(bullet => {
      bullet.markForDeletion();
      bullet.screenMoving(deltaTime);
      bullet.gravityEffect(deltaTime);
      bullet.update(deltaTime);
    });

    this.bullets = this.bullets.filter(bullet => !bullet.markedForDeletion);
  }

  draw(ctx) {
    super.draw(ctx);
    this.bullets.forEach(bullet => bullet.draw(ctx));
  }

  fire(deltaTime) {
    if (this.currentRoundsInMagazine === 0) {
      this.reload(deltaTime);
      return;
    }
    if (this.currentRateOfFire > 0) {
      this.currentRateOfFire -= deltaTime;
      return;
    }

    this.currentRateOfFire = this.rateOfFire;
    this.currentRoundsInMagazine--;

    this.bullets.push(
        new Bullet({
          x: this.x,
          y: this.y,
          xv: (this.game.hero.x + this.game.hero.w / 2 - this.x) * 2, // TODO: доработать это
          yv: (this.game.hero.y + this.game.hero.h / 2 - this.y) * 2, // и это
          collides: true,
          gravityIsUsed: true,
          color: "green"
        }, this.owner, this.game)
    );
  }

  reload(deltaTime) {
    this.currentReloadTime = (this.currentReloadTime >= this.reloadTime) ?
        deltaTime : (this.currentReloadTime + deltaTime);
    if (this.currentReloadTime >= this.reloadTime) {
      this.currentRoundsInMagazine = this.maxRoundsInMagazine;
    }
  }
}

export default Weapon
