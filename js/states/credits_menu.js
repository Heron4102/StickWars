var Credits = {

    create: function () {
        
        // RETOUR BUTTON
        var retour = game.add.button(0, 0, 'return', loadMainMenu, this, 2, 1, 0);
        var text = game.add.bitmapText(40, 40, 'pixel', '<', 32);
        
        // LES CREDITS
        var thxPlayer = game.add.bitmapText(game.world.centerX, convertY(30), 'pixel', 'Merci a toi', convertX(fontSize));
        thxPlayer.anchor.setTo(.5,.5);
        
        var thxMe = game.add.bitmapText(game.world.centerX, convertY(50), 'pixel', 'Merci a moi', convertX(fontSize));
        thxMe.anchor.setTo(.5,.5);
        
        var thxEveryone = game.add.bitmapText(game.world.centerX, convertY(70), 'pixel', 'c tro long', convertX(fontSize));
        thxEveryone.anchor.setTo(.5,.5);
    },      
    
    update: function () {        
        //retour menu
        if (game.input.keyboard.addKey(Phaser.Keyboard.ESC).isDown) 
            loadMainMenu();        
    }
};