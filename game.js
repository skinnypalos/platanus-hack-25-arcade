// Startup Scramble - Multi-Scene Flow
// =============================================================================
// ARCADE BUTTON MAPPING - COMPLETE TEMPLATE
// =============================================================================
// Reference: See button-layout.webp at hack.platan.us/assets/images/arcade/
//
// Maps arcade button codes to keyboard keys for local testing.
// Each arcade code can map to multiple keyboard keys (array values).
// The arcade cabinet sends codes like 'P1U', 'P1A', etc. when buttons are pressed.
//
// To use in your game:
//   if (key === 'P1U') { ... }  // Works on both arcade and local (via keyboard)
// =============================================================================

const ARCADE_CONTROLS = {
  // ===== PLAYER 1 CONTROLS =====
  'P1U': ['w', 'W'], // Joystick Up
  'P1D': ['s', 'S'], // Joystick Down
  'P1L': ['a', 'A'], // Joystick Left
  'P1R': ['d', 'D'], // Joystick Right
  'P1A': ['u', 'U'], // Button A (Jump)
  'P1B': ['i', 'I'], // Button B
  'P1C': ['o', 'O'], // Button C
  'P1X': ['j', 'J'], // Button X
  'P1Y': ['k', 'K'], // Button Y
  'P1Z': ['l', 'L'], // Button Z
  'START1': ['1', 'Enter'], // Start Button
  
  // ===== PLAYER 2 CONTROLS =====
  'P2U': ['ArrowUp'], // Joystick Up
  'P2D': ['ArrowDown'], // Joystick Down
  'P2L': ['ArrowLeft'], // Joystick Left
  'P2R': ['ArrowRight'], // Joystick Right
  'P2A': ['Numpad1'], // Button A (Jump)
  'P2B': ['Numpad2'], // Button B
  'P2C': ['Numpad3'], // Button C
  'P2X': ['Numpad4'], // Button X
  'P2Y': ['Numpad5'], // Button Y
  'P2Z': ['Numpad6'], // Button Z
  'START2': ['2'] // Start Button
};

// Create reverse mapping: keyboard key -> arcade code
const KEY_TO_ARCADE = {};
Object.keys(ARCADE_CONTROLS).forEach(arcadeCode => {
  const keys = ARCADE_CONTROLS[arcadeCode];
  if (keys) {
    keys.forEach(key => {
      if (!KEY_TO_ARCADE[key]) KEY_TO_ARCADE[key] = [];
      KEY_TO_ARCADE[key].push(arcadeCode);
    });
  }
});

// Helper function to check if a key/arcade code is pressed
function isPressed(scene, ...codes) {
  if (!scene.input || !scene.input.keyboard) return false;
  return codes.some(code => {
    // Check if it's an arcade code
    const keys = ARCADE_CONTROLS[code];
    if (keys) {
      return keys.some(k => scene.input.keyboard.addKey(k).isDown);
    }
    // Otherwise treat as direct key
    return scene.input.keyboard.addKey(code).isDown;
  });
}

// Helper function to check if a key was just pressed (down)
function justPressed(scene, ...codes) {
  if (!scene.input || !scene.input.keyboard) return false;
  return codes.some(code => {
    const keys = ARCADE_CONTROLS[code];
    if (keys) {
      return keys.some(k => {
        const key = scene.input.keyboard.addKey(k);
        return Phaser.Input.Keyboard.JustDown(key);
      });
    }
    const key = scene.input.keyboard.addKey(code);
    return Phaser.Input.Keyboard.JustDown(key);
  });
}

const FN='Times New Roman';

function genFounderSprite(scene, key, color1, color2) {
  if(scene.textures.exists(key)) return;
  const rt = scene.add.renderTexture(0, 0, 32, 48);
  const g = scene.add.graphics();
  const skin = 0xF3C9A9;
  g.fillStyle(skin, 1); g.fillRect(12, 6, 8, 8); g.fillRect(14, 14, 4, 2);
  g.fillStyle(0x222222, 1); g.fillRect(18, 9, 1, 1);
  g.fillStyle(0x5A3A1E, 1); g.fillRect(10, 5, 12, 3); g.fillRect(10, 8, 2, 3);
  const c1 = Phaser.Display.Color.HexStringToColor(color1).color;
  const c2 = Phaser.Display.Color.HexStringToColor(color2).color;
  if (key === 'f1' || key === 'f4') {
    g.fillStyle(c1, 1); g.fillRect(10, 16, 12, 12);
    g.fillStyle(c2, 1); g.fillRect(15, 16, 2, 10); g.fillRect(14, 26, 4, 2);
    g.fillStyle(0x233142, 1); g.fillRect(11, 28, 4, 10); g.fillRect(17, 28, 4, 10);
    g.fillStyle(0x7B4B2A, 1); g.fillRect(10, 38, 6, 3); g.fillRect(16, 38, 6, 3);
  } else {
    g.fillStyle(c2, 1); g.fillRect(12, 9, 3, 2); g.fillRect(17, 9, 3, 2); g.fillRect(15, 10, 2, 1);
    g.fillStyle(c1, 1); g.fillRect(10, 16, 12, 12);
    g.fillStyle(0x6E6E6E, 1); g.fillRect(10, 26, 12, 2);
    g.fillStyle(0x121212, 1); g.fillRect(11, 28, 4, 10); g.fillRect(17, 28, 4, 10);
    g.fillStyle(0x2A2A2A, 1); g.fillRect(10, 38, 6, 3); g.fillRect(16, 38, 6, 3);
  }
  rt.draw(g, 0, 0); rt.saveTexture(key); g.destroy(); rt.destroy();
}

function addStageLights(scene) {
  const w = scene.scale.width, h = scene.scale.height;
  for (let i = 0; i < 8; i++) {
    const l = scene.add.circle(50 + i * (w/8), 40, 16, 0x7F7BFF, 0.25);
    scene.tweens.add({ targets: l, alpha: 0.8, duration: 600, delay: i * 120, yoyo: true, repeat: -1 });
  }
  scene.add.rectangle(w/2, h/2, w, h, 0x12122A, 0.4);
}

function playBeep(scene, freqs, dur, vol) {
  dur = dur || 90; vol = vol || 0.12;
  const ctx = scene.sound && scene.sound.context; if (!ctx) return;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination); g.gain.value = vol; o.frequency.value = freqs[0] || 440; o.start();
  freqs.forEach((f, i) => o.frequency.setValueAtTime(f, ctx.currentTime + (i * dur) / 1000));
  o.stop(ctx.currentTime + (freqs.length * dur) / 1000);
}

function genLaptopSprite(scene, key) {
  if(scene.textures.exists(key)) return;
  const rt = scene.add.renderTexture(0, 0, 50, 35);
  const g = scene.add.graphics();
  g.fillStyle(0x2C3E50, 1); g.fillRect(5, 5, 40, 25);
  g.fillStyle(0x1A1A1A, 1); g.fillRect(8, 8, 34, 20);
  g.fillStyle(0x3498DB, 0.3); g.fillRect(10, 10, 30, 16);
  g.fillStyle(0x95A5A6, 1); g.fillRect(5, 28, 40, 4);
  g.fillStyle(0x34495E, 1); g.fillRect(12, 30, 8, 2);
  rt.draw(g, 0, 0); rt.saveTexture(key); g.destroy(); rt.destroy();
}

function genCoffeeSprite(scene, key) {
  if(scene.textures.exists(key)) return;
  const rt = scene.add.renderTexture(0, 0, 24, 30);
  const g = scene.add.graphics();
  g.fillStyle(0x8B4513, 1); g.fillEllipse(12, 25, 20, 12);
  g.fillStyle(0x6B3410, 1); g.fillRect(2, 10, 20, 18);
  g.fillStyle(0xD2691E, 1); g.fillEllipse(12, 10, 18, 8);
  g.fillStyle(0xFFD700, 1); g.fillCircle(12, 12, 4);
  g.fillStyle(0xFFFFFF, 0.6); g.fillCircle(10, 11, 2);
  rt.draw(g, 0, 0); rt.saveTexture(key); g.destroy(); rt.destroy();
}

function genBluelabelSprite(scene, key) {
  if(scene.textures.exists(key)) return;
  const rt = scene.add.renderTexture(0, 0, 28, 50);
  const g = scene.add.graphics();
  const cx = 14, cy = 25;
  
  // Botella base (vidrio oscuro)
  g.fillStyle(0x1A1A2A, 1);
  g.fillRect(8, 10, 12, 32);
  g.fillRect(7, 42, 14, 4);
  
  // Cuello de la botella
  g.fillStyle(0x1A1A2A, 1);
  g.fillRect(10, 4, 8, 6);
  
  // Tapa dorada
  g.fillStyle(0xD4AF37, 1);
  g.fillRect(10, 2, 8, 3);
  
  // Etiqueta azul (Blue Label)
  g.fillStyle(0x1E3A8A, 1);
  g.fillRect(9, 18, 10, 16);
  
  // Detalles dorados en etiqueta
  g.fillStyle(0xD4AF37, 1);
  g.fillRect(9, 18, 10, 2);
  g.fillRect(9, 32, 10, 2);
  g.fillRect(12, 24, 4, 4);
  
  // Brillo en el vidrio
  g.fillStyle(0xFFFFFF, 0.3);
  g.fillRect(16, 14, 2, 8);
  
  rt.draw(g, 0, 0); rt.saveTexture(key); g.destroy(); rt.destroy();
}

function genRedBullSprite(scene, key) {
  if(scene.textures.exists(key)) return;
  const rt = scene.add.renderTexture(0, 0, 24, 32);
  const g = scene.add.graphics();
  g.fillStyle(0xC8102E, 1); g.fillRect(6, 2, 12, 28);
  g.fillStyle(0x0066CC, 1); g.fillRect(6, 2, 12, 8);
  g.fillStyle(0xFFFFFF, 1); g.fillRect(8, 4, 8, 4);
  g.fillStyle(0xFFFF00, 1); g.fillRect(9, 12, 6, 16);
  g.fillStyle(0x000000, 1); g.fillRect(10, 28, 4, 2);
  g.fillStyle(0xFFFFFF, 1); g.fillRect(9, 15, 6, 2);
  rt.draw(g, 0, 0); rt.saveTexture(key); g.destroy(); rt.destroy();
}

function genBookSprite(scene, key) {
  if(scene.textures.exists(key)) return;
  const rt = scene.add.renderTexture(0, 0, 32, 40);
  const g = scene.add.graphics();
  g.fillStyle(0x8B0000, 1); g.fillRect(6, 4, 20, 32);
  g.fillStyle(0xFF4444, 1); g.fillRect(7, 5, 18, 30);
  g.fillStyle(0xFFFFFF, 1); g.fillRect(9, 8, 14, 3); g.fillRect(9, 13, 14, 2); g.fillRect(9, 17, 14, 2); g.fillRect(9, 21, 10, 2);
  g.fillStyle(0x666666, 1); g.fillRect(6, 4, 2, 32);
  g.fillStyle(0x444444, 1); g.fillRect(6, 12, 2, 2); g.fillRect(6, 20, 2, 2); g.fillRect(6, 28, 2, 2);
  rt.draw(g, 0, 0); rt.saveTexture(key); g.destroy(); rt.destroy();
}

function genLogoPixelSprite(scene, key) {
  if(scene.textures.exists(key)) return;
  const size = 80;
  const rt = scene.add.renderTexture(0, 0, size, size);
  const g = scene.add.graphics();
  const yellow = 0xFFD700;
  const cream = 0xF5F5DC;
  const px = 4;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - px;
  g.fillStyle(yellow, 1);
  for (let y = 0; y < size; y += px) {
    for (let x = 0; x < size; x += px) {
      const dx = x - centerX, dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= radius) {
        g.fillRect(x, y, px, px);
      }
    }
  }
  g.fillStyle(cream, 1);
  const topY = 8;
  const band1X = centerX - 14;
  const band2X = centerX - 2;
  const band3X = centerX + 10;
  for (let i = 0; i < 3; i++) {
    let baseX = [band1X, band2X, band3X][i];
    let curve = [-0.2, 0, 0.3][i];
    let len = [16, 20, 24][i];
    let wd = [3, 3, 4][i];
    for (let step = 0; step < len; step++) {
      const y = topY + step * px;
      const offsetX = Math.floor(step * step * curve * 0.15);
      const pxX = Math.floor((baseX + offsetX) / px) * px;
      const pxY = Math.floor(y / px) * px;
      for (let w = 0; w < wd; w++) {
        g.fillRect(pxX + w * px, pxY, px, px);
      }
    }
  }
  rt.draw(g, 0, 0); rt.saveTexture(key); g.destroy(); rt.destroy();
}

function createHackathonBackground(scene) {
  const w = scene.scale.width, h = scene.scale.height;
  if(!scene.textures.exists('hackathonBg')){
    const bg = scene.add.graphics();
    bg.fillGradientStyle(0x2C3E50, 0x2C3E50, 0x1A252F, 0x1A252F, 1);
    bg.fillRect(0, 0, w, h);
    for (let i = 0; i < 15; i++) {
      bg.fillStyle(0x3498DB, Phaser.Math.FloatBetween(0.1, 0.3));
      bg.fillCircle(Phaser.Math.Between(0, w), Phaser.Math.Between(50, h - 150), Phaser.Math.Between(2, 5));
    }
    bg.fillStyle(0x34495E, 0.6);
    bg.fillRect(0, h - 60, w, 60);
    for (let i = 0; i < 5; i++) {
      const x = 50 + i * (w / 5);
      bg.fillStyle(0x7F8C8D, 0.4);
      bg.fillRect(x - 2, h - 80, 4, 20);
    }
    bg.generateTexture('hackathonBg', w, h);
    bg.destroy();
  }
  scene.add.image(w/2, h/2, 'hackathonBg').setAlpha(0.8);
  if (!scene.textures.exists('logoPixel')) {
    genLogoPixelSprite(scene, 'logoPixel');
  }
  for (let i = 0; i < 8; i++) {
    const x = Phaser.Math.Between(60, w - 60);
    const y = Phaser.Math.Between(80, h - 200);
    const scale = Phaser.Math.FloatBetween(0.3, 0.6);
    const alpha = Phaser.Math.FloatBetween(0.15, 0.3);
    const logo = scene.add.image(x, y, 'logoPixel');
    logo.setScale(scale);
    logo.setAlpha(alpha);
    scene.tweens.add({targets: logo, alpha: alpha + 0.1, duration: 2000 + i * 200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'});
  }
}

function createCityBackground(scene) {
  const w = scene.scale.width, h = scene.scale.height;
  if(!scene.textures.exists('cityBg')){
    const bg = scene.add.graphics();
    bg.fillGradientStyle(0x1a1a2e, 0x0a0a1a, 0x2c2c4e, 0x1a1a2e, 1);
    bg.fillRect(0, 0, w, h);
    const buildings = [100, 180, 220, 320, 380, 480, 520, 620, 680, 750];
    buildings.forEach((x) => {
      const height = Phaser.Math.Between(h * 0.3, h * 0.7);
      const width = Phaser.Math.Between(40, 80);
      bg.fillStyle(0x34495E, 1);
      bg.fillRect(x - width/2, h - height, width, height);
      const windows = Math.floor(height / 20);
      for (let win = 0; win < windows; win++) {
        if (Math.random() > 0.3) {
          bg.fillStyle(0xFFD700, 0.8);
          const winY = h - height + win * 20 + 5;
          bg.fillRect(x - width/2 + 8, winY, 12, 12);
          bg.fillRect(x - width/2 + 24, winY, 12, 12);
          if (width > 50) {
            bg.fillRect(x - width/2 + 40, winY, 12, 12);
          }
        }
      }
    });
    bg.fillStyle(0x34495E, 0.6);
    bg.fillRect(0, h - 60, w, 60);
    bg.generateTexture('cityBg', w, h);
    bg.destroy();
  }
  scene.add.image(w/2, h/2, 'cityBg').setAlpha(0.8);
}

function createOfficeBackground(scene) {
  const w = scene.scale.width, h = scene.scale.height;
  if(!scene.textures.exists('officeBg')){
    const bg = scene.add.graphics();
    bg.fillStyle(0xF5F5DC, 1);
    bg.fillRect(0, 0, w, h);
    bg.fillStyle(0x8B4513, 1);
    bg.fillRect(0, 0, w, h * 0.3);
    for (let i = 0; i < 6; i++) {
      const x = 80 + i * 120;
      bg.fillStyle(0xD2691E, 1);
      bg.fillRect(x - 3, 0, 6, h * 0.3);
    }
    for (let i = 0; i < 8; i++) {
      const x = 50 + i * 100;
      bg.fillStyle(0xE0E0E0, 1);
      bg.fillRect(x, h * 0.35, 60, 100);
      bg.fillStyle(0x1E90FF, 0.4);
      bg.fillRect(x + 5, h * 0.35 + 10, 50, 80);
    }
    bg.fillStyle(0x2C3E50, 1);
    bg.fillRect(50, h * 0.55, 700, 4);
    bg.fillStyle(0x34495E, 0.6);
    bg.fillRect(0, h - 60, w, 60);
    bg.generateTexture('officeBg', w, h);
    bg.destroy();
  }
  scene.add.image(w/2, h/2, 'officeBg').setAlpha(0.8);
}

function createStageBackground(scene) {
  const w = scene.scale.width, h = scene.scale.height;
  if(!scene.textures.exists('stageBg')){
    const bg = scene.add.graphics();
    bg.fillGradientStyle(0x1a1a2e, 0x0f0f1f, 0x2a2a4a, 0x1a1a2e, 1);
    bg.fillRect(0, 0, w, h);
    for (let i = 0; i < 6; i++) {
      const x = 100 + i * 120;
      bg.fillStyle(0x7F7BFF, 0.2);
      bg.fillEllipse(x, h * 0.2, 200, 300);
    }
    bg.fillStyle(0x34495E, 0.6);
    bg.fillRect(0, h - 60, w, 60);
    bg.generateTexture('stageBg', w, h);
    bg.destroy();
  }
  scene.add.image(w/2, h/2, 'stageBg').setAlpha(0.8);
  addStageLights(scene);
}

class IntroScene extends Phaser.Scene {
  constructor() { super('intro'); }
  create() {
    const w = this.scale.width, h = this.scale.height;
    this.add.rectangle(w/2, h/2, w, h, 0x1a1a2e);
    addStageLights(this);
    const logo = this.add.text(w/2, h/2 - 20, 'STARTUP SCRAMBLE', { fontSize: '58px', fontFamily: FN, color: '#FFFFFF', fontStyle: 'bold' }).setOrigin(0.5);
    const sub = this.add.text(w/2, h/2 + 30, 'PLATANUS HACK 25', { fontSize: '24px', fontFamily: FN, color: '#FFD700' }).setOrigin(0.5);
    const press = this.add.text(w/2, h/2 + 90, 'PRESIONA START o BOTÓN A', { fontSize: '18px', fontFamily: FN, color: '#DDDDDD' }).setOrigin(0.5);
    this.tweens.add({ targets: press, alpha: 0, duration: 500, yoyo: true, repeat: -1 });
  }
  update() {
    if (justPressed(this, 'START1', 'START2', 'P1A', 'P2A')) this.scene.start('mainMenu');
  }
}

class MainMenuScene extends Phaser.Scene {
  constructor() { super('mainMenu'); this.cursor = 0; }
  create() {
    const w = this.scale.width, h = this.scale.height;
    this.add.rectangle(w/2, h/2, w, h, 0x1a1a2e);
    addStageLights(this);
    this.add.text(w/2, 80, 'STARTUP SCRAMBLE', { fontSize: '48px', fontFamily: FN, color: '#FFFFFF', fontStyle: 'bold' }).setOrigin(0.5);
    this.opts = [
      this.add.text(w/2, 200, 'START GAME', { fontSize: '28px', fontFamily: FN, color: '#FFD700' }).setOrigin(0.5),
      this.add.text(w/2, 250, 'SELECT BACKGROUND', { fontSize: '24px', fontFamily: FN, color: '#FFFFFF' }).setOrigin(0.5),
      this.add.text(w/2, 300, 'INSTRUCTIONS', { fontSize: '24px', fontFamily: FN, color: '#FFFFFF' }).setOrigin(0.5)
    ];
    this.updateMenu();
  }
  update() {
    if (justPressed(this, 'P1U', 'P2U')) { this.cursor = (this.cursor + this.opts.length - 1) % this.opts.length; this.updateMenu(); playBeep(this,[660]); }
    if (justPressed(this, 'P1D', 'P2D')) { this.cursor = (this.cursor + 1) % this.opts.length; this.updateMenu(); playBeep(this,[660]); }
    if (justPressed(this, 'START1', 'START2', 'P1A', 'P2A')) {
      if (this.cursor === 0) this.scene.start('gameMode');
      else if (this.cursor === 1) this.scene.start('backgroundSelect');
      else this.scene.start('instructions');
    }
  }
  updateMenu() { this.opts.forEach((o,i)=>o.setStyle({ color: i===this.cursor?'#FFD700':'#FFFFFF'})); }
}

class GameModeScene extends Phaser.Scene {
  constructor() { super('gameMode'); this.cursor = 0; }
  create() {
    const w = this.scale.width, h = this.scale.height;
    this.add.rectangle(w/2, h/2, w, h, 0x1a1a2e);
    addStageLights(this);
    this.add.text(w/2, 80, 'SELECT GAME MODE', { fontSize: '42px', fontFamily: FN, color: '#FFFFFF', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(w/2, 180, '1 PLAYER', { fontSize: '48px', fontFamily: FN, color: '#FFD700', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(w/2, 240, 'HIGH SCORE MODE', { fontSize: '20px', fontFamily: FN, color: '#AAAAAA' }).setOrigin(0.5);
    const highScore=localStorage.getItem('highScore')||0;
    this.add.text(w/2, 270, 'RECORD: $'+highScore+'K', { fontSize: '18px', fontFamily: FN, color: '#FFD700' }).setOrigin(0.5);
    this.add.text(w/2, 340, 'MULTIPLAYER', { fontSize: '48px', fontFamily: FN, color: '#FFFFFF', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(w/2, 400, '2 PLAYERS VS', { fontSize: '20px', fontFamily: FN, color: '#AAAAAA' }).setOrigin(0.5);
    this.opts = [
      {y: 180, main: this.add.text(w/2, 180, '1 PLAYER', { fontSize: '48px', fontFamily: FN, color: '#FFD700', fontStyle: 'bold' }).setOrigin(0.5)},
      {y: 340, main: this.add.text(w/2, 340, 'MULTIPLAYER', { fontSize: '48px', fontFamily: FN, color: '#FFFFFF', fontStyle: 'bold' }).setOrigin(0.5)}
    ];
    this.arrow = this.add.text(w/2 - 220, 180, '▶', { fontSize: '42px', fontFamily: FN, color: '#FFD700' }).setOrigin(0.5);
    this.add.text(w/2, h-60, 'JOYSTICK: MOVER | BOTÓN A: SELECCIONAR | BOTÓN B: VOLVER', { fontSize: '14px', fontFamily: FN, color: '#DDDDDD' }).setOrigin(0.5);
  }
  update() {
    if (justPressed(this, 'P1U', 'P2U', 'P1D', 'P2D')) { 
      this.cursor = (this.cursor + 1) % 2; 
      this.updateMenu(); 
      playBeep(this,[660]); 
    }
    if (justPressed(this, 'START1', 'START2', 'P1A', 'P2A')) {
      const mode = this.cursor === 0 ? 'single' : 'multi';
      this.game.registry.set('gameMode', mode);
      this.scene.start('characterSelect', {background: this.game.registry.get('background') || 'hackathon', mode: mode});
    }
    if (justPressed(this, 'P1B', 'P2B')) {
      this.scene.start('mainMenu');
    }
  }
  updateMenu() { 
    this.opts.forEach((o,i)=>o.main.setStyle({ color: i===this.cursor?'#FFD700':'#FFFFFF'}));
    this.arrow.setY(this.opts[this.cursor].y);
  }
}

class InstructionsScene extends Phaser.Scene {
  constructor(){ super('instructions'); this.slide=0; }
  preload(){
    genLaptopSprite(this, 'laptop');
    genCoffeeSprite(this, 'coffee');
    genBluelabelSprite(this, 'bluelabel');
    genRedBullSprite(this, 'redbull');
    genBookSprite(this, 'book');
  }
  create(){
    const w=this.scale.width,h=this.scale.height;
    this.add.rectangle(w/2, h/2, w, h, 0x1a1a2e);
    addStageLights(this);
    this.slides=[
      {title:'CONTROLES',desc:'JOYSTICK: Mover izquierda/derecha\nBOTÓN A o JOYSTICK ↑: Saltar\nDOBLE SALTO con power-ups',color:0x3498DB,icon:'controls'},
      {title:'EVENTOS ESPECIALES',desc:'Aparecen aleatoriamente!\nGolden Hour, Bill Storm,\nAnti-Gravity',color:0xFF6B6B,icon:'events'},
      {title:'Billete Verde',desc:'+1K USD\nRecógelo para sumar puntos\n3 seguidos = +2 BONUS',color:0x27AE60,icon:'$'},
      {title:'Billete Rojo',desc:'-1K USD (EN PITCH MODE: -5K)\nEvítalo o perderás puntos',color:0xE74C3C,icon:'$'},
      {title:'Ampolleta Dorada',desc:'MENTOR MODE\nTamaño + Velocidad + DOBLE SALTO\nRoba puntos al rival - 8 seg',color:0xFFD700,icon:'bulb'},
      {title:'Burnout',desc:'CONGELADO 3 segundos\nPierdes el combo activo',color:0xAAAAAA,icon:'burnout'},
      {title:'Red Bull',desc:'MULTIPLICADOR x2\nDuplica puntos + DOBLE SALTO\n7 segundos',color:0xC8102E,icon:'redbull'},
      {title:'Blue Label',desc:'MULTIPLICADOR x5\nPuntos x5 + DOBLE SALTO\n7 segundos',color:0x1E3A8A,icon:'bluelabel'},
      {title:'PIVOT',desc:'RALENTIZA AL OPONENTE\nReduce su velocidad 50%\n6 segundos',color:0x8B4513,icon:'book'}
    ];
    this.createSlide(0);
    this.add.text(w/2,h-40,'JOYSTICK ←/→: NAVEGAR | BOTÓN A: CONTINUAR | BOTÓN B: MENÚ',{fontSize:'14px',fontFamily:FN,color:'#DDDDDD'}).setOrigin(0.5);
  }
  createSlide(index){
    const w=this.scale.width,h=this.scale.height;
    if(this.slideGroup) this.slideGroup.destroy(true);
    this.slideGroup=this.add.container(0,0);
    const slide=this.slides[index];
    const title=this.add.text(w/2,100,slide.title,{fontSize:'40px',fontFamily:FN,color:'#FFFFFF',fontStyle:'bold'}).setOrigin(0.5);
    const desc=this.add.text(w/2,h-180,slide.desc,{fontSize:'24px',fontFamily:FN,color:'#FFD700',align:'center'}).setOrigin(0.5);
    this.slideGroup.add([title,desc]);
    const centerX=w/2,centerY=h/2;
    if(slide.icon==='controls'){
      const c=this.add.container(centerX,centerY);
      const g=this.add.graphics();
      g.fillStyle(0x3498DB,1); g.fillCircle(-40,0,30);
      g.fillStyle(0x2C3E50,1); g.fillCircle(-40,0,20);
      g.fillStyle(0x3498DB,1); g.fillRect(-50,-10,20,4); g.fillRect(-50,6,20,4);
      g.fillRect(-48,-20,4,10); g.fillRect(-48,10,4,10);
      g.fillStyle(0xFF6B6B,1); g.fillCircle(40,0,25);
      g.fillStyle(0xFFFFFF,1);
      g.fillStyle(0x2C3E50,1); g.fillRect(36,-8,8,16);
      g.fillRect(32,-4,16,8);
      c.add(g);
      c.setScale(1.5);
      this.tweens.add({targets:c,scaleX:1.7,scaleY:1.7,duration:700,yoyo:true,repeat:-1});
      this.slideGroup.add(c);
    } else if(slide.icon==='events'){
      const c=this.add.container(centerX,centerY);
      const g=this.add.graphics();
      g.fillStyle(0xFFD700,1);
      g.beginPath();
      for(let i=0;i<5;i++){
        const angle=(i*4*Math.PI)/5-Math.PI/2;
        const x=Math.cos(angle)*20;
        const y=Math.sin(angle)*20-20;
        if(i===0) g.moveTo(x,y); else g.lineTo(x,y);
        const innerAngle=((i*4+2)*Math.PI)/5-Math.PI/2;
        g.lineTo(Math.cos(innerAngle)*10,Math.sin(innerAngle)*10-20);
      }
      g.closePath();
      g.fillPath();
      g.fillStyle(0xFF6B6B,1); g.fillCircle(-25,15,12);
      g.fillStyle(0x9B59B6,1); g.fillCircle(25,15,12);
      g.fillStyle(0x27AE60,1); g.fillCircle(0,30,12);
      g.fillStyle(0xFFFFFF,0.8); g.fillCircle(-25,15,4); g.fillCircle(25,15,4); g.fillCircle(0,30,4);
      c.add(g);
      c.setScale(1.8);
      this.tweens.add({targets:c,angle:360,duration:4000,repeat:-1,ease:'Linear'});
      this.slideGroup.add(c);
    } else if(slide.icon==='$'){
      const isRed=slide.color===0xE74C3C;
      const c=this.add.container(centerX,centerY);
      const bg=this.add.rectangle(0,0,80,40,slide.color);
      const tx=this.add.text(0,0,'$',{fontSize:'32px',fontFamily:FN,color:'#fff',fontStyle:'bold'}).setOrigin(0.5);
      c.add([bg,tx]);
      if(isRed){
        const mtx=this.add.text(0,-20,'x2',{fontSize:'14px',fontFamily:FN,color:'#FFD700'}).setOrigin(0.5);
        c.add(mtx);
      }
      c.setScale(2);
      this.tweens.add({targets:c,y:'-=10',duration:800,yoyo:true,repeat:-1});
      this.slideGroup.add(c);
    } else if(slide.icon==='bulb'){
      const c=this.add.container(centerX,centerY);
      const bulb=this.add.circle(0,0,28,0xFFD700);
      const base=this.add.rectangle(0,24,24,12,0xB7950B);
      const fil=this.add.rectangle(0,-4,16,4,0xFFF2B0);
      c.add([bulb,base,fil]);
      c.setScale(2);
      this.tweens.add({targets:c,scaleX:2.4,scaleY:2.4,duration:600,yoyo:true,repeat:-1});
      this.slideGroup.add(c);
    } else if(slide.icon==='burnout'){
      const c=this.add.container(centerX,centerY);
      const bg=this.add.circle(0,0,28,0xAAAAAA);
      const t=this.add.text(0,-4,'...',{fontSize:'32px',fontFamily:FN,color:'#000'}).setOrigin(0.5);
      c.add([bg,t]);
      c.setScale(2);
      this.tweens.add({targets:c,alpha:0.5,duration:500,yoyo:true,repeat:-1});
      this.slideGroup.add(c);
    } else if(slide.icon==='redbull'){
      const c=this.add.container(centerX,centerY);
      if(this.textures.exists('redbull')){
        const can=this.add.sprite(0,0,'redbull');
        can.setScale(1.6);
        c.add(can);
      } else {
        const g=this.add.graphics();
        g.fillStyle(0xC8102E,1); g.fillRect(-12,-16,24,32);
        g.fillStyle(0x0066CC,1); g.fillRect(-12,-16,24,8);
        g.fillStyle(0xFFFFFF,1); g.fillRect(-10,-14,20,4);
        c.add(g);
      }
      this.tweens.add({targets:c,scaleX:1.7,scaleY:1.7,duration:800,yoyo:true,repeat:-1});
      this.slideGroup.add(c);
    } else if(slide.icon==='bluelabel'){
      const c=this.add.container(centerX,centerY);
      if(this.textures.exists('bluelabel')){
        const bottle=this.add.sprite(0,0,'bluelabel');
        bottle.setScale(2.2);
        c.add(bottle);
      } else {
        const g=this.add.graphics();
        g.fillStyle(0x1A1A2A,1); g.fillRect(-6,-15,12,30);
        g.fillStyle(0x1E3A8A,1); g.fillRect(-5,-8,10,16);
        g.fillStyle(0xD4AF37,1); g.fillRect(-5,-8,10,2);
        c.add(g);
      }
      this.tweens.add({targets:c,scaleX:2.4,scaleY:2.4,duration:700,yoyo:true,repeat:-1});
      this.slideGroup.add(c);
    } else if(slide.icon==='book'){
      const c=this.add.container(centerX,centerY);
      if(this.textures.exists('book')){
        const book=this.add.sprite(0,0,'book');
        book.setScale(1.8);
        c.add(book);
      } else {
        const g=this.add.graphics();
        g.fillStyle(0x8B0000,1); g.fillRect(-10,-16,20,32);
        g.fillStyle(0xFF4444,1); g.fillRect(-9,-15,18,30);
        c.add(g);
      }
      this.tweens.add({targets:c,rotation:0.1,duration:800,yoyo:true,repeat:-1});
      this.slideGroup.add(c);
    }
    const slideText=this.add.text(w/2,50,`${index+1}/${this.slides.length}`,{fontSize:'18px',fontFamily:FN,color:'#888888'}).setOrigin(0.5);
    this.slideGroup.add(slideText);
  }
  update(){
    if(justPressed(this, 'P1L', 'P2L')){
      this.slide=(this.slide-1+this.slides.length)%this.slides.length;
      this.createSlide(this.slide);
      playBeep(this,[660]);
    }
    if(justPressed(this, 'P1R', 'P2R')){
      this.slide=(this.slide+1)%this.slides.length;
      this.createSlide(this.slide);
      playBeep(this,[660]);
    }
    if(justPressed(this, 'P1B', 'P2B')){
      this.scene.start('mainMenu');
    }
    if(justPressed(this, 'START1', 'START2', 'P1A', 'P2A')){
      if(this.slide<this.slides.length-1){
        this.slide++;
        this.createSlide(this.slide);
      } else {
        this.scene.start('mainMenu');
      }
    }
  }
}

class BackgroundSelectScene extends Phaser.Scene {
  constructor(){ super('backgroundSelect'); this.cursor=0; }
  create(){
    const w=this.scale.width,h=this.scale.height;
    this.add.rectangle(w/2, h/2, w, h, 0x1a1a2e);
    addStageLights(this);
    this.add.text(w/2,80,'SELECT BACKGROUND',{fontSize:'32px',fontFamily:FN,color:'#FFFFFF'}).setOrigin(0.5);
    this.opts=[
      this.add.text(w/2,200,'HACKATHON',{fontSize:'24px',fontFamily:FN,color:'#FFD700'}).setOrigin(0.5),
      this.add.text(w/2,260,'CITY',{fontSize:'24px',fontFamily:FN,color:'#FFFFFF'}).setOrigin(0.5),
      this.add.text(w/2,320,'OFFICE',{fontSize:'24px',fontFamily:FN,color:'#FFFFFF'}).setOrigin(0.5),
      this.add.text(w/2,380,'STAGE',{fontSize:'24px',fontFamily:FN,color:'#FFFFFF'}).setOrigin(0.5)
    ];
    this.bgNames=['hackathon','city','office','stage'];
    const current=this.game.registry.get('background')||'hackathon';
    this.cursor=this.bgNames.indexOf(current);
    if(this.cursor<0) this.cursor=0;
    this.updateMenu();
    this.add.text(w/2,h-80,'JOYSTICK ↑/↓: MOVER | BOTÓN A: SELECCIONAR | BOTÓN B: VOLVER',{fontSize:'14px',fontFamily:FN,color:'#DDDDDD'}).setOrigin(0.5);
  }
  update(){
    if(justPressed(this, 'P1U', 'P2U')){ 
      this.cursor=(this.cursor+this.opts.length-1)%this.opts.length; 
      this.updateMenu(); 
      playBeep(this,[660]); 
    }
    if(justPressed(this, 'P1D', 'P2D')){ 
      this.cursor=(this.cursor+1)%this.opts.length; 
      this.updateMenu(); 
      playBeep(this,[660]); 
    }
    if(justPressed(this, 'START1', 'START2', 'P1A', 'P2A')){
      this.game.registry.set('background',this.bgNames[this.cursor]);
      this.scene.start('mainMenu');
    }
    if(justPressed(this, 'P1B', 'P2B')){
      this.scene.start('mainMenu');
    }
  }
  updateMenu(){ this.opts.forEach((o,i)=>o.setStyle({color:i===this.cursor?'#FFD700':'#FFFFFF'})); }
}

class CharacterSelectScene extends Phaser.Scene {
  constructor(){ super('characterSelect'); }
  preload(){ 
    genFounderSprite(this,'f1','#5DADE2','#1F618D');
    genFounderSprite(this,'f2','#2C3E50','#ECF0F1');
    genFounderSprite(this,'f3','#8E44AD','#ECF0F1');
    genFounderSprite(this,'f4','#27AE60','#1F618D');
  }
  create(data){
    const w=this.scale.width,h=this.scale.height;
    this.mode=data&&data.mode?data.mode:'multi';
    this.add.rectangle(w/2, h/2, w, h, 0x1a1a2e);
    addStageLights(this);
    const title=this.mode==='single'?'CHOOSE YOUR FOUNDER':'CHOOSE YOUR FOUNDERS';
    this.add.text(w/2,80,title,{fontSize:'32px',fontFamily:FN,color:'#FFFFFF'}).setOrigin(0.5);
    this.p1List=['f1','f2','f3','f4']; this.p2List=['f2','f1','f3','f4']; this.i1=0; this.i2=0;
    if(this.mode==='single'){
      this.s1=this.add.sprite(w/2,h/2,'f1').setScale(2.5); 
      this.add.text(w/2,h/2+100,'JUGADOR 1\nJOYSTICK ←/→: SELECCIONAR',{fontSize:'18px',fontFamily:FN,color:'#5DADE2',align:'center'}).setOrigin(0.5);
    } else {
      this.s1=this.add.sprite(w/2-200,h/2,'f1').setScale(2); 
      this.add.text(this.s1.x,h/2+80,'BUSINESS FOUNDER\nP1: JOYSTICK + BOTÓN A',{fontSize:'16px',fontFamily:FN,color:'#5DADE2',align:'center'}).setOrigin(0.5);
      this.s2=this.add.sprite(w/2+200,h/2,'f2').setScale(2); 
      this.add.text(this.s2.x,h/2+80,'TECH FOUNDER\nP2: JOYSTICK + BOTÓN A',{fontSize:'16px',fontFamily:FN,color:'#ECF0F1',align:'center'}).setOrigin(0.5);
      this.tweens.add({targets:[this.s1,this.s2], y:'+=6', duration:600, yoyo:true, repeat:-1});
    }
    if(this.mode==='single'){
      this.tweens.add({targets:this.s1, y:'+=8', duration:600, yoyo:true, repeat:-1});
    }
    this.add.text(w/2,h-80,'PRESIONA START PARA CONTINUAR',{fontSize:'18px',fontFamily:FN,color:'#DDDDDD'}).setOrigin(0.5);
    this.selectedBg=data&&data.background?data.background:(this.game.registry.get('background')||'hackathon');
  }
  update(){
    if(justPressed(this, 'P1L')){ this.i1=(this.i1+3)%4; this.s1.setTexture(this.p1List[this.i1]); playBeep(this,[660]); }
    if(justPressed(this, 'P1R')){ this.i1=(this.i1+1)%4; this.s1.setTexture(this.p1List[this.i1]); playBeep(this,[660]); }
    if(this.mode==='multi'){
      if(justPressed(this, 'P2L')){ this.i2=(this.i2+3)%4; this.s2.setTexture(this.p2List[this.i2]); playBeep(this,[660]); }
      if(justPressed(this, 'P2R')){ this.i2=(this.i2+1)%4; this.s2.setTexture(this.p2List[this.i2]); playBeep(this,[660]); }
    }
    if(justPressed(this, 'START1', 'START2', 'P1A', 'P2A')){
      const p2=this.mode==='single'?'f2':this.p2List[this.i2];
      this.scene.start('vsScreen',{p1:this.p1List[this.i1],p2:p2,background:this.selectedBg,mode:this.mode});
    }
  }
}

class VSScene extends Phaser.Scene { 
  constructor(){ super('vsScreen'); }
  create(data){ 
    const w=this.scale.width,h=this.scale.height;
    const mode=data&&data.mode?data.mode:'multi';
    this.add.rectangle(w/2, h/2, w, h, 0x1a1a2e);
    addStageLights(this);
    if(mode==='single'){
      const s1=this.add.sprite(w/2,h/2,data.p1).setScale(3);
      this.add.text(w/2,100,'GET READY!',{fontSize:'64px',fontFamily:FN,color:'#FFD700',fontStyle:'bold'}).setOrigin(0.5);
      this.add.text(w/2,h/2+140,'HIGH SCORE MODE',{fontSize:'24px',fontFamily:FN,color:'#5DADE2'}).setOrigin(0.5);
    } else {
      const s1=this.add.sprite(w/2-160,h/2,data.p1).setScale(2.2);
      const s2=this.add.sprite(w/2+160,h/2,data.p2).setScale(2.2);
      this.add.text(w/2,120,'VS',{fontSize:'64px',fontFamily:FN,color:'#FFD700',fontStyle:'bold'}).setOrigin(0.5);
    }
    let count=3; const t=this.add.text(w/2,h-120,'3',{fontSize:'48px',fontFamily:FN,color:'#FFFFFF'}).setOrigin(0.5);
    this.time.addEvent({delay:1000,repeat:3,callback:()=>{count--; t.setText(count>0?String(count):'GO!'); if(count===0){ this.time.delayedCall(500,()=>this.scene.start('gameplay',{p1:data.p1,background:data.background||'hackathon',mode:mode})); }}});
  }
}

class GameplayScene extends Phaser.Scene {
  constructor(){ super('gameplay'); }
  preload() {
    genLaptopSprite(this, 'laptop');
    genCoffeeSprite(this, 'coffee');
    genBluelabelSprite(this, 'bluelabel');
    genRedBullSprite(this, 'redbull');
    genBookSprite(this, 'book');
  }
  create(data){ 
    this.items=[]; this.powerups=[]; this.spawnTimers=[]; this.score1=0; this.score2=0; this.timeLeft=60; this.difficulty=1; this.bills1=0; this.bills2=0; this.hits1=0; this.hits2=0; this.pups1=0; this.pups2=0; this.obstacles=[]; this.platforms=[]; this.combo1=0; this.combo2=0; this.multiplier1=1; this.multiplier2=1; this.multiplierTime1=0; this.multiplierTime2=0; this.lastStealTime=0; this.jumpsLeft1=1; this.jumpsLeft2=1; this.slowTime1=0; this.slowTime2=0; this.doubleJumpTime1=0; this.doubleJumpTime2=0; this.singleMode=data&&data.mode==='single';
    this.activeEvent=null; this.eventEndTime=0; this.lastEventTime=0; this.eventOverlay=null; this.eventParticles=[];
    const w=this.scale.width,h=this.scale.height;
    const bgName=data&&data.background?data.background:(this.game.registry.get('background')||'hackathon');
    if(bgName==='city') createCityBackground(this);
    else if(bgName==='office') createOfficeBackground(this);
    else if(bgName==='stage') createStageBackground(this);
    else createHackathonBackground(this);
    this.ground=this.add.rectangle(w/2,h-30,w,60,0x34495E); this.physics.add.existing(this.ground,true);
    const t1=data&&data.p1?data.p1:'f1';
    this.p1=this.physics.add.sprite(this.singleMode?w/2:100,h-100,t1); 
    this.p1.setCollideWorldBounds(true); this.p1.setBounce(0); this.p1.body.setGravity(0,800); this.p1.powerupTime=0; this.p1.multiplierTime=0; this.p1.body.setSize(this.p1.width*0.8,this.p1.height*0.9); this.p1.body.setOffset(this.p1.width*0.1,this.p1.height*0.1);
    if(!this.singleMode){
      const t2=data&&data.p2?data.p2:'f2';
      this.p2=this.physics.add.sprite(w-100,h-100,t2);
      this.p2.setCollideWorldBounds(true); this.p2.setBounce(0); this.p2.body.setGravity(0,800); this.p2.powerupTime=0; this.p2.multiplierTime=0; this.p2.body.setSize(this.p2.width*0.8,this.p2.height*0.9); this.p2.body.setOffset(this.p2.width*0.1,this.p2.height*0.1);
      this.physics.add.overlap(this.p1, this.p2, this.handlePlayerCollision, null, this);
      this.physics.add.collider(this.p2,this.ground);
    }
    this.physics.add.collider(this.p1,this.ground);
    this.createFloorObstacles();
    if(this.singleMode){
      this.add.text(20,20,'SCORE',{fontSize:'16px',fontFamily:FN,color:'#AAAAAA'}).setOrigin(0,0);
      this.scoreText1=this.add.text(20,45,'$0K',{fontSize:'36px',fontFamily:FN,color:'#FFD700',fontStyle:'bold'}).setOrigin(0,0); this.scoreText1.setShadow(2,2,'#000',3);
      const hs=localStorage.getItem('highScore')||0;
      this.add.text(w-20,20,'RECORD',{fontSize:'16px',fontFamily:FN,color:'#AAAAAA'}).setOrigin(1,0);
      this.highScoreText=this.add.text(w-20,45,'$'+hs+'K',{fontSize:'36px',fontFamily:FN,color:'#5DADE2',fontStyle:'bold'}).setOrigin(1,0); this.highScoreText.setShadow(2,2,'#000',3);
      this.timerText=this.add.text(w/2,40,'60',{fontSize:'48px',fontFamily:FN,color:'#E74C3C',fontStyle:'bold'}).setOrigin(0.5); this.timerText.setShadow(2,2,'#000',3);
    } else {
      this.scoreText1=this.add.text(20,80,'$0K',{fontSize:'32px',fontFamily:FN,color:'#5DADE2',fontStyle:'bold'}); this.scoreText1.setShadow(2,2,'#000',3);
      this.scoreText2=this.add.text(w-20,80,'$0K',{fontSize:'32px',fontFamily:FN,color:'#ECF0F1',fontStyle:'bold'}).setOrigin(1,0); this.scoreText2.setShadow(2,2,'#000',3);
      this.timerText=this.add.text(w/2,80,'60',{fontSize:'48px',fontFamily:FN,color:'#E74C3C',fontStyle:'bold'}).setOrigin(0.5); this.timerText.setShadow(2,2,'#000',3);
    }
    this.pitchModeText=this.add.text(w/2,150,'PITCH MODE',{fontSize:'56px',fontFamily:FN,color:'#FF0000',fontStyle:'bold'}).setOrigin(0.5); this.pitchModeText.setShadow(3,3,'#000',5); this.pitchModeText.setVisible(false); this.pitchModeText.setAlpha(0);
    this.eventText=this.add.text(w/2,h/2,'',{fontSize:'48px',fontFamily:FN,color:'#FFD700',fontStyle:'bold',align:'center'}).setOrigin(0.5); this.eventText.setShadow(3,3,'#000',5); this.eventText.setVisible(false).setDepth(100);
    this.startTimers(); this.gameOver=false;
  }
  createFloorObstacles() {
    const w = this.scale.width, h = this.scale.height;
    this.platforms = [];
    this.movingPlatforms = [];
    const platformData = [
      {x: 150, y: h - 180, width: 120, moving: false},
      {x: 400, y: h - 260, width: 140, moving: true, minX: 250, maxX: 550, speed: 80},
      {x: 650, y: h - 180, width: 120, moving: false},
      {x: 280, y: h - 340, width: 100, moving: true, minX: 180, maxX: 380, speed: 60},
      {x: 520, y: h - 320, width: 100, moving: false}
    ];
    platformData.forEach(pd => {
      const platform = this.add.rectangle(pd.x, pd.y, pd.width, 14, 0x34495E);
      const topLine = this.add.rectangle(pd.x, pd.y - 7, pd.width, 3, 0x7F8C8D);
      this.physics.add.existing(platform, true);
      platform.body.checkCollision.down = false;
      platform.body.checkCollision.left = false;
      platform.body.checkCollision.right = false;
      this.physics.add.collider(this.p1, platform);
      if(!this.singleMode) this.physics.add.collider(this.p2, platform);
      platform.topLine = topLine;
      if(pd.moving) {
        platform.moving = true;
        platform.minX = pd.minX;
        platform.maxX = pd.maxX;
        platform.speed = pd.speed;
        platform.direction = 1;
        this.movingPlatforms.push(platform);
      }
      this.platforms.push(platform);
    });
    const floorY = h - 60;
    const blockPositions = [
      {x: 220, w: 40, h: 50},
      {x: 450, w: 35, h: 45},
      {x: 600, w: 38, h: 48}
    ];
    blockPositions.forEach(bp => {
      const block = this.add.rectangle(bp.x, floorY - bp.h/2, bp.w, bp.h, 0x8B4513);
      const top = this.add.rectangle(bp.x, floorY - bp.h - 3, bp.w, 6, 0xD2691E);
      this.physics.add.existing(block, true);
      this.physics.add.collider(this.p1, block);
      if(!this.singleMode) this.physics.add.collider(this.p2, block);
      this.obstacles.push(block);
    });
  }
  startTimers(){ const a=this.time.addEvent({delay:1000,callback:this.updateTimer,callbackScope:this,loop:true}); const b=this.time.addEvent({delay:1000,callback:this.spawnBill,callbackScope:this,loop:true}); const c=this.time.addEvent({delay:1500,callback:this.spawnObstacle,callbackScope:this,loop:true}); const d=this.time.addEvent({delay:10000,callback:this.spawnPowerup,callbackScope:this,loop:true}); const e=this.time.addEvent({delay:12000,callback:this.spawnMultiplier,callbackScope:this,loop:true}); const f=this.time.addEvent({delay:16000,callback:this.spawnBluelabel,callbackScope:this,loop:true}); const g=this.time.addEvent({delay:14000,callback:this.spawnBook,callbackScope:this,loop:true}); this.spawnTimers=[a,b,c,d,e,f,g]; }
  stopTimers(){ this.spawnTimers.forEach(t=>t&&t.remove()); this.spawnTimers=[]; }
  updateTimer(){ if(this.gameOver) return; this.timeLeft--; this.timerText.setText(this.timeLeft); const pitchMode=this.timeLeft<=10; if(this.pitchModeText){ if(pitchMode&&!this.pitchModeText.visible){ this.pitchModeText.setVisible(true); this.tweens.add({targets:this.pitchModeText,alpha:0.9,duration:300}); this.tweens.add({targets:this.pitchModeText,scaleX:1.2,scaleY:1.2,duration:400,yoyo:true,repeat:-1}); } else if(!pitchMode&&this.pitchModeText.visible){ this.tweens.add({targets:this.pitchModeText,alpha:0,duration:300,onComplete:()=>this.pitchModeText.setVisible(false)}); } } if(this.timeLeft%10===0&&this.timeLeft>10){ this.difficulty=Math.min(3,this.difficulty+0.25); } if(this.timeLeft<=0){ this.endGame(); } }
  spawnBill(){ if(this.gameOver) return; const count=this.items.filter(i=>i.type==='bill'&&i.active).length; if(count>=60) return; const pitchMode=this.timeLeft<=10; const isRed=pitchMode?(Math.random()<0.85):(Math.random()<0.35); const spawnCount=pitchMode?3:1; for(let i=0;i<spawnCount;i++){ const x=Phaser.Math.Between(50,this.scale.width-50); const c=this.add.container(x,-20-i*25); const bg=this.add.rectangle(0,0,40,20,isRed?0xE74C3C:0x27AE60); const tx=this.add.text(0,0,'$',{fontSize:'16px',fontFamily:FN,color:'#fff',fontStyle:'bold'}).setOrigin(0.5); const redInPitch=isRed&&pitchMode; const multiplier=(pitchMode&&!redInPitch)?2:1; if(multiplier>1){ const mtx=this.add.text(0,-10,'x2',{fontSize:'10px',fontFamily:FN,color:'#FFD700'}).setOrigin(0.5); c.add([bg,tx,mtx]); } else { c.add([bg,tx]); } c.type='bill'; c.value=redInPitch?-5:(isRed?-1:1); c.multiplier=multiplier; this.physics.add.existing(c); c.body.setVelocity(0,150*this.difficulty); this.items.push(c); } }
  spawnObstacle(){ if(this.gameOver||Math.random()>0.6) return; const count=this.items.filter(i=>i.type==='obstacle'&&i.active).length; if(count>=30) return; const x=Phaser.Math.Between(50,this.scale.width-50); const c=this.add.container(x,-20); if(Math.random()<0.25){ const bg=this.add.circle(0,0,14,0xAAAAAA); const t=this.add.text(0,-2,'...',{fontSize:'16px',fontFamily:FN,color:'#000'}).setOrigin(0.5); c.add([bg,t]); c.type='freeze'; } else { const bg=this.add.rectangle(0,0,40,20,0xE74C3C); const t=this.add.text(0,0,'✗',{fontSize:'18px',fontFamily:FN,color:'#fff',fontStyle:'bold'}).setOrigin(0.5); c.add([bg,t]); c.type='obstacle'; c.value=-1; } this.physics.add.existing(c); c.body.setVelocity(0,180*this.difficulty); this.items.push(c); }
  spawnPowerup(){ if(this.gameOver) return; const x=Phaser.Math.Between(100,this.scale.width-100); const c=this.add.container(x,-20); const bulb=this.add.circle(0,0,14,0xFFD700); const base=this.add.rectangle(0,12,12,6,0xB7950B); const fil=this.add.rectangle(0,-2,8,2,0xFFF2B0); c.add([bulb,base,fil]); this.physics.add.existing(c); c.body.setVelocity(0,100); c.type='powerup'; this.tweens.add({targets:c,scaleX:1.2,scaleY:1.2,duration:300,yoyo:true,repeat:-1}); this.powerups.push(c); }
  spawnMultiplier(){ if(this.gameOver) return; const x=Phaser.Math.Between(100,this.scale.width-100); const c=this.add.container(x,-20); const can=this.add.sprite(0,0,'redbull'); can.setScale(0.8); c.add([can]); this.physics.add.existing(c); c.body.setVelocity(0,100); c.type='multiplier'; this.tweens.add({targets:c,scaleX:1.15,scaleY:1.15,duration:400,yoyo:true,repeat:-1}); this.powerups.push(c); }
  spawnBluelabel(){ if(this.gameOver) return; const x=Phaser.Math.Between(100,this.scale.width-100); const c=this.add.container(x,-20); const bottle=this.add.sprite(0,0,'bluelabel'); bottle.setScale(1.0); c.add([bottle]); this.physics.add.existing(c); c.body.setVelocity(0,100); c.type='bluelabel'; this.tweens.add({targets:c,scaleX:1.15,scaleY:1.15,duration:600,yoyo:true,repeat:-1}); this.tweens.add({targets:c,rotation:Phaser.Math.Between(-0.1,0.1),duration:1000,yoyo:true,repeat:-1}); this.powerups.push(c); }
  spawnBook(){ if(this.gameOver||this.singleMode) return; const x=Phaser.Math.Between(100,this.scale.width-100); const c=this.add.container(x,-20); const book=this.add.sprite(0,0,'book'); book.setScale(0.9); c.add([book]); this.physics.add.existing(c); c.body.setVelocity(0,100); c.type='slowbook'; this.tweens.add({targets:c,rotation:0.1,duration:800,yoyo:true,repeat:-1}); this.powerups.push(c); }
  triggerRandomEvent(){ 
    if(this.gameOver||this.activeEvent||this.timeLeft<=10) return; 
    const now=this.time.now; if(now-this.lastEventTime<15000) return;
    const events=['golden','storm','antigrav'];
    const event=Phaser.Utils.Array.GetRandom(events);
    this.lastEventTime=now;
    if(event==='golden') this.startGoldenHour();
    else if(event==='storm') this.startBillStorm();
    else if(event==='antigrav') this.startAntiGravity();
  }
  startGoldenHour(){ 
    this.activeEvent='golden'; this.eventEndTime=this.time.now+5000;
    this.showEventText('⭐ GOLDEN HOUR ⭐\n¡TODO VALE x2!',0xFFD700);
    this.playTone([523,659,784,1047]);
    const w=this.scale.width,h=this.scale.height;
    this.eventOverlay=this.add.rectangle(w/2,h/2,w,h,0xFFD700,0.15).setDepth(5);
    this.tweens.add({targets:this.eventOverlay,alpha:0.25,duration:500,yoyo:true,repeat:-1});
  }
  startBillStorm(){ 
    this.activeEvent='storm'; this.eventEndTime=this.time.now+3000;
    this.showEventText('💰 BILL STORM 💰\n¡LLUVIA DE DINERO!',0x27AE60);
    this.playTone([784,880,988,1175]);
    for(let i=0;i<20;i++){ this.time.delayedCall(i*150,()=>{ if(!this.gameOver) this.spawnBill(); }); }
  }
  startAntiGravity(){ 
    this.activeEvent='antigrav'; this.eventEndTime=this.time.now+6000;
    this.showEventText('🚀 ANTI-GRAVITY 🚀\n¡FLOTAS EN EL AIRE!',0x9B59B6);
    this.playTone([440,554,659,880,1047]);
    if(this.p1) this.p1.body.setGravity(0,300);
    if(this.p2) this.p2.body.setGravity(0,300);
    this.createFloatingParticles();
  }
  showEventText(text,color){ 
    this.eventText.setText(text).setColor('#'+color.toString(16).padStart(6,'0')).setVisible(true).setAlpha(0).setScale(0.5);
    this.tweens.add({targets:this.eventText,alpha:1,scale:1,duration:300,ease:'Back.easeOut'});
    this.time.delayedCall(2000,()=>{ this.tweens.add({targets:this.eventText,alpha:0,scale:0.8,duration:400,onComplete:()=>this.eventText.setVisible(false)}); });
  }
  createFloatingParticles(){ 
    const w=this.scale.width,h=this.scale.height;
    for(let i=0;i<15;i++){ 
      const p=this.add.circle(Phaser.Math.Between(0,w),Phaser.Math.Between(h/2,h),Phaser.Math.Between(2,5),0x9B59B6,0.6).setDepth(10);
      this.eventParticles.push(p);
      this.tweens.add({targets:p,y:p.y-Phaser.Math.Between(100,200),alpha:0,duration:Phaser.Math.Between(2000,4000),repeat:-1,yoyo:true});
    }
  }
  endEvent(){ 
    if(!this.activeEvent) return;
    if(this.activeEvent==='antigrav'){ 
      if(this.p1) this.p1.body.setGravity(0,800);
      if(this.p2) this.p2.body.setGravity(0,800);
      this.eventParticles.forEach(p=>p.destroy());
      this.eventParticles=[];
    }
    if(this.eventOverlay){ this.eventOverlay.destroy(); this.eventOverlay=null; }
    this.activeEvent=null;
  }
  playTone(freqs){ playBeep(this,freqs); }
  collectItem(player,item,isP1){ if(!item.active) return; item.setActive(false).setVisible(false); const mult=isP1?this.multiplier1:this.multiplier2; if(item.type==='bill'){ const baseValue=item.value*(item.multiplier||1); const goldenMult=this.activeEvent==='golden'?2:1; const finalValue=Math.round(baseValue*mult*goldenMult); if(isP1){ this.score1=Math.max(0,this.score1+finalValue); this.bills1++; this.combo1++; if(this.combo1>=3 && baseValue>0){ this.score1=Math.max(0,this.score1+2); this.playTone([523,659,784,880]); this.createParticles(player.x,player.y-20,0x00FF00); this.combo1=0; } this.playTone([523,659,784]); this.updateScores(); } else { this.score2=Math.max(0,this.score2+finalValue); this.bills2++; this.combo2++; if(this.combo2>=3 && baseValue>0){ this.score2=Math.max(0,this.score2+2); this.playTone([523,659,784,880]); this.createParticles(player.x,player.y-20,0x00FF00); this.combo2=0; } this.playTone([523,659,784]); this.updateScores(); } this.createParticles(item.x,item.y,baseValue>0?0x27AE60:0xE74C3C); } else if(item.type==='obstacle'){ if(isP1){ this.score1=Math.max(0,this.score1-1); this.hits1++; this.combo1=0; } else { this.score2=Math.max(0,this.score2-1); this.hits2++; this.combo2=0; } this.updateScores(); this.playTone([200,150,100]); this.createParticles(item.x,item.y,0xE74C3C); this.cameras.main.shake(200,0.005); } else if(item.type==='freeze'){ const now=this.time.now; player.frozenUntil=now+3000; player.setTint(0x99ccff); if(isP1) this.combo1=0; else this.combo2=0; this.playTone([180,120,90]); this.cameras.main.shake(120,0.004); } item.destroy(); }
  collectPowerup(player,pw){ if(!pw.active) return; pw.setActive(false).setVisible(false); const now=this.time.now; const isP1=player===this.p1; if(pw.type==='powerup'){ player.setScale(1.5); player.powerupTime=8; player.setTint(0xFFD700); if(isP1){ this.pups1++; this.doubleJumpTime1=now+8000; } else { this.pups2++; this.doubleJumpTime2=now+8000; } this.playTone([440,554,659,880]); this.createParticles(pw.x,pw.y,0xFFD700); } else if(pw.type==='multiplier'||pw.type==='bluelabel'){ const mult=pw.type==='bluelabel'?5:2; const tint=pw.type==='bluelabel'?0x1E3A8A:0x00AAFF; const tone=pw.type==='bluelabel'?[660,784,988,1320]:[554,659,784,988]; if(isP1){ this.multiplier1=mult; this.multiplierTime1=now+7000; this.doubleJumpTime1=now+7000; } else { this.multiplier2=mult; this.multiplierTime2=now+7000; this.doubleJumpTime2=now+7000; } player.setTint(tint); this.playTone(tone); this.createParticles(pw.x,pw.y,tint); } else if(pw.type==='slowbook'&&!this.singleMode){ const opponent=isP1?this.p2:this.p1; if(isP1){ this.slowTime2=now+6000; } else { this.slowTime1=now+6000; } opponent.setTint(0x8B4513); this.playTone([200,180,160,140]); this.createParticles(pw.x,pw.y,0x8B4513); } pw.destroy(); }
  createParticles(x,y,color){ for(let i=0;i<8;i++){ const p=this.add.circle(x,y,3,color); this.tweens.add({targets:p,x:x+Phaser.Math.Between(-30,30),y:y+Phaser.Math.Between(-30,30),alpha:0,duration:500,onComplete:()=>p.destroy()}); } }
  endGame(){ 
    this.gameOver=true; this.stopTimers(); 
    if(this.singleMode){
      const hs=parseInt(localStorage.getItem('highScore'))||0;
      const newRecord=this.score1>hs;
      if(newRecord) localStorage.setItem('highScore',this.score1);
      this.scene.start('result',{score1:this.score1,singleMode:true,newRecord:newRecord,highScore:Math.max(this.score1,hs),stats:{b1:this.bills1,h1:this.hits1,p1:this.pups1}});
    } else {
      const winner = this.score1>this.score2?1:(this.score2>this.score1?2:0); 
      this.scene.start('result',{score1:this.score1,score2:this.score2,winner,stats:{b1:this.bills1,b2:this.bills2,h1:this.hits1,h2:this.hits2,p1:this.pups1,p2:this.pups2}});
    }
  }
  update(){ 
    if(this.gameOver) return; 
    const now=this.time.now, h=this.scale.height, base=200;
    const slow1=now<this.slowTime1?0.5:1;
    const s1=(this.p1.powerupTime>0)?1.4*slow1:slow1;
    const f1=this.p1.frozenUntil&&now<this.p1.frozenUntil;
    if(f1){ this.p1.setVelocityX(0); } 
    else { const vel=isPressed(this,'P1L')?-base*s1:isPressed(this,'P1R')?base*s1:0; this.p1.setVelocityX(vel); }
    const hasDoubleJump1=now<this.doubleJumpTime1;
    if(this.p1.body.touching.down){ this.jumpsLeft1=hasDoubleJump1?2:1; }
    if(!f1&&justPressed(this,'P1U','P1A')&&this.jumpsLeft1>0){ 
      this.p1.setVelocityY(this.p1.powerupTime>0?-500:-400); 
      this.jumpsLeft1--;
    }
    if(!this.singleMode){
      const slow2=now<this.slowTime2?0.5:1;
      const s2=(this.p2.powerupTime>0)?1.4*slow2:slow2;
      const f2=this.p2.frozenUntil&&now<this.p2.frozenUntil;
      if(f2){ this.p2.setVelocityX(0); } 
      else { const vel=isPressed(this,'P2L')?-base*s2:isPressed(this,'P2R')?base*s2:0; this.p2.setVelocityX(vel); }
      const hasDoubleJump2=now<this.doubleJumpTime2;
      if(this.p2.body.touching.down){ this.jumpsLeft2=hasDoubleJump2?2:1; }
      if(!f2&&justPressed(this,'P2U','P2A')&&this.jumpsLeft2>0){ 
        this.p2.setVelocityY(this.p2.powerupTime>0?-500:-400); 
        this.jumpsLeft2--;
      }
    }
    this.movingPlatforms.forEach(p=>{
      p.x += p.speed * p.direction * (1/60);
      if(p.topLine) p.topLine.x = p.x;
      if(p.x >= p.maxX) p.direction = -1;
      else if(p.x <= p.minX) p.direction = 1;
      p.body.x = p.x - p.width/2;
    });
    if(this.activeEvent&&now>=this.eventEndTime) this.endEvent();
    if(!this.activeEvent&&Math.random()<0.002) this.triggerRandomEvent();
    this.updatePlayerEffects(now);
    this.updateItems(h);
    this.updatePowerups(h);
  }
  updatePlayerEffects(now){
    const players=this.singleMode?[this.p1]:[this.p1,this.p2];
    players.forEach((p,i)=>{
      if(!p) return;
      const multTime=i===0?this.multiplierTime1:this.multiplierTime2;
      const slowTime=i===0?this.slowTime1:this.slowTime2;
      if(p.powerupTime>0){ 
        p.powerupTime-=1/60; 
        if(p.powerupTime<=0){ 
          p.setScale(1); 
          if(multTime<=now&&slowTime<=now) p.clearTint(); 
        } 
      }
      if(multTime>0&&now>=multTime){ 
        if(i===0){ this.multiplier1=1; this.multiplierTime1=0; }
        else { this.multiplier2=1; this.multiplierTime2=0; }
        if(p.powerupTime<=0&&slowTime<=now) p.clearTint(); 
      }
      if(slowTime>0&&now>=slowTime){ 
        if(i===0){ this.slowTime1=0; }
        else { this.slowTime2=0; }
        if(multTime<=now&&p.powerupTime<=0) p.clearTint(); 
      }
      if(p.frozenUntil&&now>=p.frozenUntil){ 
        p.frozenUntil=0; 
        if(multTime<=now&&p.powerupTime<=0&&slowTime<=now) p.clearTint(); 
      }
    });
  }
  updateItems(h){
    const b1=this.p1.getBounds();
    const b2=this.singleMode?null:this.p2.getBounds();
    this.items.forEach(it=>{ 
      if(!it.active) return; 
      const bi=it.getBounds(); 
      if(Phaser.Geom.Intersects.RectangleToRectangle(b1,bi)){ 
        this.collectItem(this.p1,it,true); 
      } else if(b2&&Phaser.Geom.Intersects.RectangleToRectangle(b2,bi)){ 
        this.collectItem(this.p2,it,false); 
      }
      if(it.y>h+50) it.destroy(); 
    }); 
    this.items=this.items.filter(i=>i.active);
  }
  updatePowerups(h){
    const b1=this.p1.getBounds();
    const b2=this.singleMode?null:this.p2.getBounds();
    this.powerups.forEach(pw=>{ 
      if(!pw.active) return; 
      const bp=pw.getBounds(); 
      if(Phaser.Geom.Intersects.RectangleToRectangle(b1,bp)){ 
        this.collectPowerup(this.p1,pw); 
      } else if(b2&&Phaser.Geom.Intersects.RectangleToRectangle(b2,bp)){ 
        this.collectPowerup(this.p2,pw); 
      }
      if(pw.y>h+50) pw.destroy(); 
    }); 
    this.powerups=this.powerups.filter(p=>p.active);
  }
  handlePlayerCollision(p1,p2){
    const now=this.time.now; if(now-this.lastStealTime<1000) return;
    const big1=p1.powerupTime>0&&p1.scaleX>1, big2=p2.powerupTime>0&&p2.scaleX>1;
    if(big1&&!big2){ this.score1=Math.max(0,this.score1+1); this.score2=Math.max(0,this.score2-1); this.updateScores(); this.playTone([300,250,200]); this.createParticles(p1.x,p1.y,0xFFD700); this.lastStealTime=now; }
    else if(big2&&!big1){ this.score2=Math.max(0,this.score2+1); this.score1=Math.max(0,this.score1-1); this.updateScores(); this.playTone([300,250,200]); this.createParticles(p2.x,p2.y,0xFFD700); this.lastStealTime=now; }
  }
  updateScores(){ 
    this.scoreText1.setText('$'+this.score1+'K'); 
    if(!this.singleMode){ 
      this.scoreText2.setText('$'+this.score2+'K'); 
    } else {
      const hs=parseInt(localStorage.getItem('highScore'))||0;
      if(this.score1>hs){ this.highScoreText.setText('$'+this.score1+'K'); }
    }
  }
}

class ResultScene extends Phaser.Scene { 
  constructor(){ super('result'); }
  create(data){ 
    const w=this.scale.width,h=this.scale.height;
    this.add.rectangle(w/2, h/2, w, h, 0x1a1a2e);
    addStageLights(this);
    if(data&&data.singleMode){
      const title=data.newRecord?'🏆 ¡NUEVO RECORD!':'JUEGO TERMINADO';
      const titleColor=data.newRecord?'#FFD700':'#FFFFFF';
      this.add.text(w/2, h/2-120, title, {fontSize:'48px',fontFamily:FN,color:titleColor,fontStyle:'bold'}).setOrigin(0.5);
      this.add.text(w/2, h/2-40, 'TU SCORE', {fontSize:'24px',fontFamily:FN,color:'#AAAAAA'}).setOrigin(0.5);
      this.add.text(w/2, h/2+20, '$'+data.score1+'K', {fontSize:'64px',fontFamily:FN,color:'#5DADE2',fontStyle:'bold'}).setOrigin(0.5);
      this.add.text(w/2, h/2+100, 'RECORD: $'+data.highScore+'K', {fontSize:'28px',fontFamily:FN,color:'#FFD700'}).setOrigin(0.5);
      if(data.stats){ this.add.text(w/2, h/2+150, `BILLS: ${data.stats.b1}  OBSTÁCULOS: ${data.stats.h1}  POWER-UPS: ${data.stats.p1}`, {fontSize:'16px',fontFamily:FN,color:'#AAAAAA'}).setOrigin(0.5); }
    } else {
      const {score1,score2,winner,stats}=data||{};
      let title='🤝 EMPATE'; if(winner===1) title='🚀 FOUNDER 1 GANA'; else if(winner===2) title='🔥 FOUNDER 2 GANA';
      this.add.text(w/2, h/2-60, title, {fontSize:'48px',fontFamily:FN,color:'#FFFFFF',fontStyle:'bold'}).setOrigin(0.5);
      this.add.text(w/2, h/2, `$${score1}K vs $${score2}K`, {fontSize:'28px',fontFamily:FN,color:'#FFD700'}).setOrigin(0.5);
      if(stats){ this.add.text(w/2, h/2+60, `BILLS: ${stats.b1+stats.b2}  OBST.: ${stats.h1+stats.h2}  POWER-UPS: ${stats.p1+stats.p2}`, {fontSize:'18px',fontFamily:FN,color:'#FFFFFF'}).setOrigin(0.5); }
    }
    const t=this.add.text(w/2, h-80, 'PRESIONA BOTÓN A o START PARA CONTINUAR', {fontSize:'16px',fontFamily:FN,color:'#DDDDDD'}).setOrigin(0.5); this.tweens.add({targets:t,alpha:0,duration:500,yoyo:true,repeat:-1});
    this.data=data;
  }
  update(){
    if(justPressed(this, 'START1', 'START2', 'P1A', 'P2A')) this.scene.start('gameOver',this.data);
  }
}

class GameOverScene extends Phaser.Scene { 
  constructor(){ super('gameOver'); }
  create(data){ 
    const w=this.scale.width,h=this.scale.height;
    this.add.rectangle(w/2, h/2, w, h, 0x1a1a2e);
    addStageLights(this);
    this.add.text(w/2, 120, 'GAME OVER', {fontSize:'52px',fontFamily:FN,color:'#FFFFFF',fontStyle:'bold'}).setOrigin(0.5);
    if(data&&data.singleMode){
      this.add.text(w/2, 180, `FINAL SCORE: $${data.score1||0}K`, {fontSize:'28px',fontFamily:FN,color:'#FFD700'}).setOrigin(0.5);
      if(data.newRecord) this.add.text(w/2, 220, '¡NUEVO RECORD!', {fontSize:'22px',fontFamily:FN,color:'#FFD700'}).setOrigin(0.5);
    } else {
      const s1=data&&data.score1||0, s2=data&&data.score2||0; 
      this.add.text(w/2, 180, `FINAL: $${s1}K VS $${s2}K`, {fontSize:'24px',fontFamily:FN,color:'#FFD700'}).setOrigin(0.5);
    }
    this.add.text(w/2, 260, 'MADE FOR PLATANUS HACK 25', {fontSize:'16px',fontFamily:FN,color:'#CCCCCC'}).setOrigin(0.5);
    const a=this.add.text(w/2, 340, 'START o BOTÓN A: JUGAR DE NUEVO', {fontSize:'18px',fontFamily:FN,color:'#FFFFFF'}).setOrigin(0.5);
    const b=this.add.text(w/2, 380, 'BOTÓN B: VOLVER AL MENÚ', {fontSize:'18px',fontFamily:FN,color:'#FFFFFF'}).setOrigin(0.5);
  }
  update(){
    if(justPressed(this, 'START1', 'START2', 'P1A', 'P2A')) this.scene.start('mainMenu');
    if(justPressed(this, 'P1B', 'P2B')) this.scene.start('mainMenu');
  }
}

const config = { 
  type: Phaser.AUTO, 
  width: 800, 
  height: 600, 
  backgroundColor: '#1a1a2e', 
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } }, 
  scene: [IntroScene, MainMenuScene, GameModeScene, InstructionsScene, BackgroundSelectScene, CharacterSelectScene, VSScene, GameplayScene, ResultScene, GameOverScene] 
};
new Phaser.Game(config);

