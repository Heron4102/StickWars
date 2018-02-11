const maxJumps = 3;
const plySpeed = 250;
const plyGravity = 500;
const jumpForce = 600;
const hpMax = 100;

const attackBoxWidth = 65;
const attackBoxHeight = 130;
const sizeBoxAwayFromPlayer = 80;

var PlayerState = {  
  RUN: 1,
  ATTACK: 2,
  JUMP: 3,
  IDLE: 4,
  SLIDEONWALL: 5
};

//
// ATTENTION:
// EN JS, DANS UNE CLASSE, ON N'A PAS BESOIN DE DECLARER LES VARIABLES AVANT DE LES UTILISER
// IL FAUT RAJOUTER THIS. DEVANT CHAQUE VARIABLE INTERNE PARCONTRE :/

class Player {		
	constructor(controls, name, tint) {
		
		// DÉCLARATION DES VARIABLES
		this.isUpKeyReleased = false; // garde le dernier état de la touche de saut
		this.freezeState = false; // gèle l'état du joueur pour attendre que l'animation se finisse (saut ou attaque) 
			
		this.playerState = PlayerState.IDLE;
		this.hp = hpMax;
        this.jumpsCounts = 0;
        this.controls = controls;
        this.name = name;         
        this.damage = 10;        
        
		this.player = game.add.sprite(width * Math.random(), game.world.height - 180, "player");
        this.graphics = game.add.graphics(this.player.x, this.player.y);		
        
        this.player.tint = tint; // on applique un filtre de couleur au joueur pour les comparer

		game.physics.arcade.enable(this.player);
		this.player.anchor.setTo(.5,.5);
		
		this.player.body.gravity.y = plyGravity;
		this.player.body.collideWorldBounds = true;

		// on extrait l"animation de l"atlas
		this.player.animations.add("run", Phaser.Animation.generateFrameNames("run/", 1, 10, ".png", 4), 15, true);	
		this.player.animations.add("idle", Phaser.Animation.generateFrameNames("idle/", 1, 10, ".png", 4), 15, true);
		this.player.animations.add("attack", Phaser.Animation.generateFrameNames("attack/", 1, 10, ".png", 4), 20, false);
		this.player.animations.add("jump", Phaser.Animation.generateFrameNames("jump/", 1, 10, ".png", 4), 15, false);	
        
        // créer la barre de vie
        var barConfig = {
            width: 100,
            height: 15,
            x: this.player.x,
            y: this.player.x,
            bg: {
              color: '#d8231b'
            },
            bar: {
              color: '#00923b'
            },
            animationDuration: 200,
            flipped: false
        };
        
        this.hpBar = new HealthBar(game, barConfig);               
	}
		
	update() {
        this.hpBar.setPosition(this.player.x, this.player.y - 75);
        
		var hitPlatform = game.physics.arcade.collide(this.player, platforms);
		this.player.body.velocity.x = 0;
		
		// on reset le double jump si on touche le sol
		if (this.player.body.touching.down && hitPlatform)
			this.jumpsCounts = 0;
		
		// ===
		// GESTION DE L'ETAT DU JOUEUR
		if (this.controls.attack.isDown) {
			this.playerState = PlayerState.ATTACK;
		}	
		else if (this.controls.up.isDown && !this.isUpKeyReleased && this.jumpsCounts < maxJumps) {
			this.playerState = PlayerState.JUMP;
			
			this.isUpKeyReleased = true;
			this.jumpsCounts++;		
			this.player.body.velocity.y = -jumpForce; 
		}
		else if (this.controls.left.isDown && this.playerState != this.playerState.ATTACK) {
			this.playerState = PlayerState.RUN;
			this.player.scale.x = -1;
				
			this.player.body.velocity.x -= plySpeed;
		}	
		else if (this.controls.right.isDown && this.playerState != this.playerState.ATTACK) {
			this.playerState = PlayerState.RUN;		
			this.player.scale.x = 1;
				
			this.player.body.velocity.x += plySpeed; 
		}
		else {
			this.playerState = PlayerState.IDLE;
		}
		 
		if (this.controls.up.isUp)
			this.isUpKeyReleased = false;
		
        // ====
        // DRAW ATTACK BOX COLLISION
        this.graphics.kill();        
        this.graphics = game.add.graphics(this.player.x - attackBoxWidth/2, this.player.y - attackBoxHeight/2);
        this.graphics.lineStyle(2, 0x0000FF, 1);
        this.graphics.drawRect(sizeBoxAwayFromPlayer * this.player.scale.x, 0, attackBoxWidth, attackBoxHeight);
                  
		// ====
		// ANIMATION        
		if (!this.freezeState) {	
			switch (this.playerState) {
				case PlayerState.IDLE:
					this.player.animations.play("idle");	
					break;
					
				case PlayerState.RUN:
					this.player.animations.play("run");
					break;
					
				case PlayerState.ATTACK:
					var attackAnim = this.player.animations.play("attack");
					
					this.freezeState = true;
					attackAnim.onComplete.add(this.stopAnimation, this);
                    this.inflictDamage(this.damage);
					break;
					
				case PlayerState.JUMP:
					var jumpAnim = this.player.animations.play("jump");
					
					this.freezeState = true;
					jumpAnim.onComplete.add(this.stopAnimation, this);
					break;
			}	
		}
	}
    
    getDamage(damage) {
        this.hp -= damage;
        
        var hpRelative = this.hp / hpMax * 100;
        this.hpBar.setPercent(hpRelative);
        
        return hpRelative;
    }
    
    stopAnimation() {
        this.freezeState = false;
    }
    
    inflictDamage(damage) {
        var playerRect = {
            x: this.player.x - attackBoxWidth/2 + sizeBoxAwayFromPlayer * this.player.scale.x, 
            y: this.player.y - attackBoxHeight/2, 
            width: attackBoxWidth, 
            height: attackBoxHeight
        };
       
                  
        // on regarde si il y a un joueur dans la box d'attaque
        for (var i=0; i < player.length; i++) {
            // on ne check pas les collisions du joueur qui attaque
            if (player[i] == this)
                continue;
            
            var rect2 = {
                x: player[i].player.x, 
                y: player[i].player.y, 
                width: player[i].player.width, 
                height: player[i].player.height
            };

            if (playerRect.x < rect2.x + rect2.width &&
                playerRect.x + playerRect.width > rect2.x &&
                playerRect.y < rect2.y + rect2.height &&
                playerRect.height + playerRect.y > rect2.y) {
                    
                    console.log("Il est dans le box! w/ " + player[i].name);
                    player[i].getDamage(this.damage);
            }
        }
    }
}