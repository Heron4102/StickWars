//
// Cette classe s'instantie dans le lobby
// Gère les entrées du joueur dans le lobby

const joinSpeed = 8;

class PlayerLobby {	
    
    /**
     * A instantier dans le lobby. 
     * Gère les entrées du clavier pour créer un nouveau personnage dans le lobby.
     * 
     * @constructor
     * @param {float} x - La position en abcisse du point d'apparition du personnage.
     * @param {float} y - La position en ordonnée du point d'apparition du personnage.
     * @param {PlayerMetaEnum} id - L'ID du joueur.
     * @param {string} key - La touche pour rejoindre la partie.
     * @param {string} spriteId - ?
     */
	constructor(x, y, id, key, spriteId) {
        
        this.x = x;
        this.y = y;      
        this.id = id;
        this.controls = controls[id];        
        this.spriteId = spriteId;
        
        this.angle = 0; 
        this.lobbyJoined = false;              
		
        this.text = game.add.text(x, y, "Hold " + key + " to join the game", styleSmall);
        this.text.anchor.setTo(.5,.5); 

        this.radialProgressBar = game.add.graphics(x, y);
        this.radialProgressBar.lineStyle(32, 0xff0000);
    }
    
    /**
     * A appeler dans l'update du lobby: 
     * Permet au joueur de rejoindre le lobby.
     * Met à jour la position du personnage si il est dans le lobby.
     * 
     * @param {*} platform - Les plateformes du lobby pour les collisions avec le personnage.
     */
    update(platform) 
    {
        if (this.lobbyJoined) 
        {
            this.player.update(platform);
            
            return;
        }
            
        if (this.controls.up.isDown) 
        {
            this.angle += joinSpeed;
            
            // on charge le joueur
            if (this.angle > 360) {
                this.lobbyJoined = true;
                playerMeta[this.id].enable = true;
                
                this.radialProgressBar.destroy();
                this.text.destroy();
                
                // les touches des joueurs
                var touche = game.add.sprite(this.x, this.y, this.spriteId);
                touche.anchor.set(0.5, 0.5);
                touche.width = 20 * width / 100;
                touche.height = 20 * height / 100;

                // on créer un joueur dans le lobby
                this.player = new Player(this.x, this.y, this.id, playerMeta[this.id].tint);
            }
        }            
        else if (this.angle > 0) {
            this.angle -= 2;
        }
        
        // ===
		// MAJ DU CERCLE DE CHARGEMENT
        this.radialProgressBar.clear();
        this.radialProgressBar.lineStyle(16, 0xffffff);
        
        this.radialProgressBar.lineColor = Phaser.Color.interpolateColor(0xff0000, 0x80ff00, 360, this.angle, 1, 1);

        this.radialProgressBar.arc(0, 0, 60, 0, game.math.degToRad(this.angle), false);
        this.radialProgressBar.endFill();    
    }
}