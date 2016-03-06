# Loonyball
Little javascript game using requirejs, babylonjs library

Demo http://chepchepcirkus.github.io

- ## Library ##
jQuery, babylonJS

- ## Engine ##
CHEPK.game object initialize user and logic game

- ## Layout ##
CHEPK.game object containing all informations about layout of app

- ## Event fired ##
You can plug your javscript module by this way, 
catch one the following event:
     * layout_init
     * loonyball_before_new_entity
     * loonyball_after_new_entity
     * loonyball_init
     * loonyball_delete_entity
     * loonyball_before_start
     * loonyball_before_create_scene
     * loonyball_after_create_scene
     * loonyball_after_render_scene
     
 You can add your custom event in the app if you are in need.
 Just think about update the list below.
 
 Example : see js/plugins/*
           declared in plugins.js
