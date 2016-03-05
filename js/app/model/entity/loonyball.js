/*
 * Events available
 * 
 * loonyball_before_new_entity
 * loonyball_after_new_entity
 * loonyball_init
 * loonyball_delete_entity
 * loonyball_before_start
 * loonyball_before_create_scene
 * loonyball_after_create_scene
 * 
 */ 
define(['babylon.2.2'], function () {
    function loonyball(user, events) {
		this.entity_code = 'loonyball';
        this.scene = {};
        this.config = {};
        this.camera = {};
        this.entity = [];
        this.entityId = 0;
        this.interactions = [];
        this.moveSpeed = 0.5;
        this.user = user;
        this.events = new events();
        this.map = [
            [],
            [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
            [2,3,4,13,14,19],
            [2,3,4,13,14,15,18,19],
            [2,3,4,5,9,13,14,15,16,17,18,19],
            [5,9,13],
            [5,6,7,8,9,13],
            [5,6,7,8,9,13],
            [8,9,13],
            [4,5,6,7,8,9,10,11,12,13,14],
            [4,5,6,7,8,9,10,11,12,13,14],
            [4,5,14],
            [4,5,14,15,16],
            [5,11,12,13,14,15,16],
            [5,11,12],
            [5,11,12],
            [4,5,11,12,13,14,15],
            [4,5,6,7,8,9,10,11,14,15,16,17,18,19],
            [19,4,5,6,7,8,9,10,11,14,15,16,17,18,19],
            []
        ];
    }
    loonyball.prototype = {
        init: function(data) {
            var data = JSON.parse(data);
            this.entityId = data.id;
            /** Dispatch Init Custom Event **/
            var event = new CustomEvent(
				this.entity_code + '_init', 
				{
					detail: {
						description:this.entity_code + ' : Init function',
						data:{
							id:this.entityId
							}
						}
				}
			);
            document.dispatchEvent(event);
        },
        /**
         * Caracters creation
         * 
         * @params data {id, position}
         */
        new: function(data) {
            var data = JSON.parse(data);
            for(var i in data) {
				
				/** Dispatch before new Custom Event **/
				var event = new CustomEvent(
					this.entity_code + '_before_new_entity', 
					{
						detail: {
							description:this.entity_code + ' : before create new entity',
							data:{
								entity:data
								}
							}
					}
				);
				document.dispatchEvent(event);
				
                var entityMaterial = new BABYLON.StandardMaterial("eMaterial_" + this.entityId, this.scene);
                entityMaterial.diffuseColor = new BABYLON.Color3(0.1,0,0);

                var ent = BABYLON.Mesh.CreateSphere("sphere_" + this.entityId, 20, 0.9, this.scene);
                ent.position = new BABYLON.Vector3(data[i].position.x, data[i].position.y, data[i].position.z);
                ent.material = entityMaterial;
                ent.showBoundingBox = true;
                ent.checkCollisions = true;
                
                this.entity[data[i].id] = {
                    owner: data[i].id,
                    entityId: data[i].id,
                    object: ent,
                    remoteOpts: {
                        id: data[i].id,
                        position: {
                            x: data[i].position.x,
                            y: data[i].position.y,
                            z: data[i].position.z
                        }
                    }
                };
                
                /** Camera target **/
                if(this.entityId == data[i].id) {
                    this.scene.camera.target = this.entity[data[i].id].object;
                }
                
                /** Dispatch after new Custom Event **/
				event = new CustomEvent(
					this.entity_code + '_after_new_entity', 
					{
						detail: {
							description:this.entity_code + ' : after create new entity',
							entity:this.entity[data[i].id]
							}
					}
				);
				document.dispatchEvent(event);
				
                this.scene.render();
            }
        },
        delete: function(connexionId) {
            var i;			
            for(i in this.entity) {
                if(this.entity[i].owner == connexionId) {
					/** Dispatch delete entity Custom Event **/
					var	event = new CustomEvent(
						this.entity_code + '_delete_entity', 
						{
							detail: {
								description:this.entity_code + ' : delete entity',
								data:{
									entity:this.entity[i]
									}
								}
						}
					);
					document.dispatchEvent(event);
					
					this.entity[i].object.dispose();
                    this.scene.render();
                    this.entity.splice(i);
					
                    break;
                }
            }
        },
        /**
         *
         * @important Interface method
         */
        start: function (config) {
			
            this.config = config;
            
			/** Dispatch before start function Custom Event **/
			var	event = new CustomEvent(
				this.entity_code + '_before_start', 
				{
					detail: {
						description:this.entity_code + ' : before start function',
						data:{
							config:this.config
							}
						}
				}
			);
			document.dispatchEvent(event);
			
            var canvas = document.getElementById(config.game.canvas_id);
            var engine = new BABYLON.Engine(canvas, true);

            /** Scene Creation **/
            this.scene = new BABYLON.Scene(engine);

            this.scene.workerCollisions = false;
            this.scene.collisionsEnabled = true;

            this.scene.camera = new BABYLON.ArcRotateCamera("ArcRotateCamera",  0.8, 0.3, 25, new BABYLON.Vector3(0, 5, 2), this.scene);

            this.camera.applyGravity = true;
            this.camera.checkCollisions = true;

            /** Attach control keybord and mouses to camera **/
            this.scene.activeCamera.attachControl(canvas);

            this.camera.speed = 0.5;
            this.camera.angularSensibility = 1000;

            /** Light **/
            var light = new BABYLON.PointLight("DirLight", new BABYLON.Vector3(0, 10, 0), this.scene);
            light.diffuse = new BABYLON.Color3(1, 1, 1);
            light.specular = new BABYLON.Color3(0.6, 0.6, 0.6);
            light.intensity = 1.5;

            /** Attach Action manager to scene **/
            this.scene.actionManager = new BABYLON.ActionManager(this.scene);

            this.scene.registerBeforeRender(this.beforeRender.bind(this));

            /** Dispatch before create scene Custom Event **/
			var	event = new CustomEvent(
				this.entity_code + '_before_create_scene', 
				{
					detail: {
						description:this.entity_code + ' : before create scene function',
						data:{
							scene:this.scene
							}
						}
				}
			);
			
			document.dispatchEvent(event);
			/** Create Scene **/
            this.createScene();
            
			/** Dispatch after create scene Custom Event **/
			var	event = new CustomEvent(
				this.entity_code + '_after_create_scene', 
				{
					detail: {
						description:this.entity_code + ' : after create scene function',
						data:{
							scene:this.scene
							}
						}
				}
			);
			
			var sceneG = this.scene;
			/** Render Scene **/
            engine.runRenderLoop(function () {
                sceneG.render();
            });
        },
        beforeRender : function() {
			if(this.events.hasDataChanged()) {
				var prevPosition = this.entity[this.entityId].object.position;
				var newPosition = new BABYLON.Vector3(0, 0, 0);
				if (this.events.keys.up == 1) {
					newPosition.z = -this.moveSpeed;
				}

				if (this.events.keys.down == 1) {
					newPosition.z = this.moveSpeed;
				}

				if (this.events.keys.left == 1) {
					newPosition.x = this.moveSpeed;
				}

				if (this.events.keys.right == 1) {
					newPosition.x = -this.moveSpeed;
				}

				var collisions = false;
				for(var i =0 ;i< this.interactions.length;i++) {
					if(this.entity.length > 0 && this.interactions[i].intersectsMesh(this.entity[this.entityId].object, true)) {
						collisions = true;
						console.log('collision');
					}
				}
				this.entity[this.entityId].object.moveWithCollisions(newPosition);
				this.entity[this.entityId].object.y = 1;


				var data = {};
				this.entity[this.entityId].remoteOpts.position = this.entity[this.entityId].object.position;
				data[this.entityId] = this.entity[this.entityId].remoteOpts;
				if(!this.config.simulation) {
					this.user.owner.send(JSON.stringify({f:'entity.update', d:data}));
				}
			}
        },
        createScene: function () {
            /** ground creation **/
            var groundSize = 20;
            var ground = BABYLON.Mesh.CreateGround("ground", 20, 20, 0, this.scene);
            ground.checkCollisions = true;
            ground.showBoundingBox = true;

            var boxMaterial = new BABYLON.StandardMaterial("bMaterial", this.scene);
            boxMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.5, 0.1);

            var cubeSize = 1;
            var dummy = BABYLON.Mesh.CreateBox("dummyBox", cubeSize, this.scene);
            dummy.material = boxMaterial;
            dummy.checkCollisions = true;
			dummy.applyGravity = true;
            dummy.showBoundingBox = true;
            dummy.active = false;

            for (var y = 0; y < groundSize; y++) {
                if(this.map[y].length > 0) {
                    for (var x = 1; x <= groundSize; x++) {
                        var found = false;
                        for(var j= 0; j < this.map[y].length; j++) {
                            if(this.map[y][j] == x) {
                                found = true;
                                break;
                            }
                        }
                        if(!found) {
                            var box = dummy.clone('box-' + x + '_' + y);
                            box.position = new BABYLON.Vector3(y-(groundSize/2-0.5), cubeSize / 2, (x-groundSize/2-0.5));
                            this.interactions.push(box);
						}
                    }
                } else {
                    for (var x = 1; x <= groundSize; x++) {
                        var box = dummy.clone('box-' + x + '_' + y);
                        box.position = new BABYLON.Vector3(y-(groundSize/2-0.5), cubeSize / 2, (x-groundSize/2-0.5));
                        this.interactions.push(box);
					}
                }
            }
        },

        update:function (data) {
            var data = JSON.parse(data);
            for(var i in data) {
                this.entity[data[i].id].object.position = new BABYLON.Vector3(data[i].position.x, data[i].position.y, data[i].position.z);
                this.entity[data[i].id].remoteOpts.position = this.entity[data[i].id].object.position;
                this.scene.render();
            }
        }
    };
    return loonyball;
});
