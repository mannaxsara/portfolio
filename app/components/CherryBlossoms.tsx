"use client";

import { useEffect } from "react";

type PetalRotation = {
  axis: 'X' | 'Y' | 'Z';
  value: number;
  speed: number;
  x: number;
  y: number;
  z: number;
}

interface PetalConfig {
  customClass?: string;
  x?: number;
  y?: number;
  z?: number;
  xSpeedVariation?: number;
  ySpeed?: number;
  rotation?: PetalRotation;
  swaySpeed?: number;
  swayRange?: number;
  swayAngle?: number;
}

class Petal implements PetalConfig {
  el: HTMLDivElement;
  customClass: string;
  x: number;
  y: number;
  z: number;
  xSpeedVariation: number;
  ySpeed: number;
  rotation: PetalRotation;
  swaySpeed: number;
  swayRange: number;
  swayAngle: number;

  constructor(config: PetalConfig) {
    this.customClass = config.customClass || '';
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.z = config.z || 0; 
    this.xSpeedVariation = config.xSpeedVariation || 0;
    this.ySpeed = config.ySpeed || 0;
    this.swaySpeed = config.swaySpeed || 0;
    this.swayRange = config.swayRange || 0;
    this.swayAngle = config.swayAngle || 0;
    
    this.rotation = {
      axis: 'X',
      value: 0,
      speed: 0,
      x: 0,
      y: 0,
      z: 0
    };

    if (config.rotation && typeof config.rotation === 'object') {
      this.rotation.axis = config.rotation.axis || this.rotation.axis;
      this.rotation.value = config.rotation.value || this.rotation.value;
      this.rotation.speed = config.rotation.speed || this.rotation.speed;
      this.rotation.x = config.rotation.x || this.rotation.x;
      this.rotation.y = config.rotation.y || 0;
      this.rotation.z = config.rotation.z || 0;
    }

    this.el = document.createElement('div');
    this.el.className = 'petal ' + this.customClass;
    this.el.style.position = 'absolute';
    this.el.style.backfaceVisibility = 'visible';
    this.el.style.willChange = 'transform, opacity';
  }
}

type BlossomSceneConfig = {
  id: string;
  petalsTypes: Petal[];
  numPetals?: number;
  gravity?: number;
  windMaxSpeed?: number;
}

class BlossomScene {
  container: HTMLElement;
  numPetals: number;
  petalsTypes: Petal[];
  gravity: number;
  windMaxSpeed: number;
  private windMagnitude: number;
  private placeholder: HTMLDivElement;
  private petals: Petal[];
  private windDuration: number;
  private width: number;
  private height: number;
  private timer: number;
  private animationFrameId: number | null;
  private resizeHandler: (() => void) | null;

  constructor(config: BlossomSceneConfig) {
    let container = document.getElementById(config.id);
    if (container === null) {
      throw new Error('[id] provided was not found in document');
    }
    this.container = container;
    this.placeholder = document.createElement('div');
    this.petals = [];
    this.numPetals = config.numPetals || 45; 
    this.petalsTypes = config.petalsTypes;
    this.gravity = config.gravity || 0.6; 
    this.windMaxSpeed = config.windMaxSpeed || 3;
    this.windMagnitude = 0.1;
    this.windDuration = 150;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.timer = 0;
    this.animationFrameId = null;

    this.container.style.overflow = 'hidden';
    this.placeholder.style.transformStyle = 'preserve-3d';
    this.placeholder.style.width = this.width + 'px';
    this.placeholder.style.height = this.height + 'px';
    this.container.appendChild(this.placeholder);
    this.createPetals();
    
    // Bind resize handler
    this.resizeHandler = () => {
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
      this.placeholder.style.width = this.width + 'px';
      this.placeholder.style.height = this.height + 'px';
    };
    window.addEventListener('resize', this.resizeHandler);

    this.animationFrameId = requestAnimationFrame(this.updateFrame.bind(this));
  }

  destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeHandler !== null) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    if (this.container && this.placeholder.parentNode === this.container) {
      this.container.removeChild(this.placeholder);
    }
  }

  resetPetal(petal: Petal) {
    // Distribute evenly across X axis
    petal.x = Math.random() * this.width;
    // Spawn just above screen
    petal.y = -40 - Math.random() * 80;
    // Depth: 0 (far) to 200 (near)
    petal.z = Math.random() * 200;

    // Organic sway variables (pendulum movement)
    petal.swaySpeed = Math.random() * 0.03 + 0.015;
    petal.swayRange = Math.random() * 30 + 15;
    petal.swayAngle = Math.random() * Math.PI * 2;

    // Random initial rotations
    petal.rotation.value = Math.random() * 360;
    petal.rotation.speed = Math.random() * 2 + 1; // rotation speed
    petal.rotation.x = Math.random() * 360;
    petal.rotation.y = Math.random() * 360;
    petal.rotation.z = Math.random() * 360;

    // Speeds: horizontal drift variation + base gravity speed
    petal.xSpeedVariation = Math.random() * 0.4 - 0.2;
    petal.ySpeed = Math.random() * 0.8 + this.gravity; 

    return petal;
  }

  calculateWindSpeed(t: number, y: number) {
    let a = this.windMagnitude / 2 * (this.height - 2 * y / 3) / this.height;
    return a * Math.sin(2 * Math.PI / this.windDuration * t + (3 * Math.PI / 2)) + a;
  }

  updatePetal(petal: Petal) {
    // Update sway angle for pendulum animation
    petal.swayAngle += petal.swaySpeed;

    // Get current wind speed
    let currentWind = this.calculateWindSpeed(this.timer, petal.y);

    // X: base horizontal speed + wind + side-to-side pendulum sway
    petal.x += currentWind + petal.xSpeedVariation + Math.cos(petal.swayAngle) * 0.4;
    
    // Y: base vertical speed + subtle sway bounce
    petal.y += petal.ySpeed + Math.sin(petal.swayAngle) * 0.15;

    // Update tumbling angle
    petal.rotation.value += petal.rotation.speed;

    // Depth factor: map z (0..200) to percentage (0..1)
    let depthPercent = petal.z / 200;
    let scale = 0.35 + depthPercent * 0.65; // scale from 0.35x to 1.0x
    let opacity = 0.28 + depthPercent * 0.52; // brighter petals for cuter vibe
    if (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark") {
      opacity = Math.min(0.95, opacity + 0.18);
    }

    // Construct smooth 3D transform with tumble and scale
    let t = `translate3d(${petal.x}px, ${petal.y}px, ${petal.z}px) ` +
            `rotateX(${petal.rotation.x + petal.rotation.value * 0.4}deg) ` +
            `rotateY(${petal.rotation.y + petal.rotation.value}deg) ` +
            `rotateZ(${petal.rotation.z + petal.rotation.value * 0.15}deg) ` +
            `scale(${scale})`;

    petal.el.style.transform = t;
    petal.el.style.opacity = opacity.toString();

    // Reset if it flows off the screen (with generous padding)
    if (petal.y > this.height + 40 || petal.x < -60 || petal.x > this.width + 60) {
      this.resetPetal(petal);
      // Ensure it spawns at the top
      petal.y = -30;
    }
  }

  updateWind() {
    this.windMagnitude = Math.random() * this.windMaxSpeed;
    this.windDuration = Math.floor(this.windMagnitude * 75 + (Math.random() * 30 - 15));
    if (this.windDuration <= 0) this.windDuration = 150;
  }

  createPetals() {
    for (let i = 0; i < this.numPetals; i++) {
      let tmpPetalType = this.petalsTypes[Math.floor(Math.random() * this.petalsTypes.length)];
      let tmpPetal = new Petal({ customClass: tmpPetalType.customClass });

      this.resetPetal(tmpPetal);
      // Distribute them vertically initially so they are already spread out on load
      tmpPetal.y = Math.random() * this.height;
      
      this.petals.push(tmpPetal);
      this.placeholder.appendChild(tmpPetal.el);
    }
  }

  updateFrame() {
    if (this.timer >= this.windDuration) {
      this.updateWind();
      this.timer = 0;
    }

    let petalsLen = this.petals.length;
    for (let i = 0; i < petalsLen; i++) {
      this.updatePetal(this.petals[i]);
    }

    this.timer++;
    this.animationFrameId = requestAnimationFrame(this.updateFrame.bind(this));
  }
}

export default function CherryBlossoms() {
  useEffect(() => {
    const petalsTypes = [
      new Petal({ customClass: 'petal-style1' }),
      new Petal({ customClass: 'petal-style2' }),
      new Petal({ customClass: 'petal-style3' }),
      new Petal({ customClass: 'petal-style4' })
    ];

    const myBlossomSceneConfig: BlossomSceneConfig = {
      id: 'blossom_container',
      petalsTypes,
      numPetals: 45
    };

    let blossomScene: BlossomScene | null = null;
    
    // Slight delay to make sure offsetWidth/offsetHeight of container are fully resolved
    const timer = setTimeout(() => {
      blossomScene = new BlossomScene(myBlossomSceneConfig);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (blossomScene) {
        blossomScene.destroy();
      }
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        #blossom_container {
          position: fixed;
          left: 0;
          top: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: -1;
        }

        .petal {
          background: url(/backgrounds/cherry-blossom.png) no-repeat;
          pointer-events: none;
        }
        .petal-style1 {
          width: 45px;
          height: 20px;
          background-position: -31px 0;
        }
        .petal-style2 {
          width: 42px;
          height: 22px;
          background-position: 0 -23px;
        }
        .petal-style3 {
          width: 37px;
          height: 24px;
          background-position: 0 -50px;
        }
        .petal-style4 {
          width: 26px;
          height: 34px;
          background-position: -49px -35px;
        }
      `}} />
      <div id="blossom_container" className="absolute inset-0 overflow-hidden pointer-events-none z-0" />
    </>
  );
}
