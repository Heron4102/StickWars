

class LevelCreator {		
    
	constructor(data) {
        this.data = data;
    }

    create() {
        platforms = game.add.group();
        platforms.enableBody = true;
        
        var map = this.data;
        
        for (var i=0; i < map.plateforms.length; i++) {
            var sprite;
            
            if (map.plateforms[i].collider)
                var ground = platforms.create(0, 0, map.plateforms[i].sprite);
            else
                sprite = game.add.sprite(0, 0, map.plateforms[i].sprite);	
            
            sprite.x = map.plateforms[i].x * width / 100;
            sprite.y = map.plateforms[i].y * height / 100;
            sprite.width = map.plateforms[i].w * width / 100;
            sprite.height = map.plateforms[i].h * height / 100;
            

        }
        
        platforms.setAll('body.immovable', true);
    }
}