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
define([
		 'lib/babylon.2.2',
		 'lib/hand-1.1.3'
	], function (babylon) {
    function loonyball() {
		this.entity_code = 'loonyball';
        this.scene = {};
        this.config = {};
        this.camera = {};
        this.entity = [];
        this.entityId = 0;
        this.interactions = [];
        this.moveSpeed = 0.2;
        this.user = CHEPK.user;
        this.events = CHEPK.layout.events;
		this.cameraPos = '';
		this.cameraRot = '';
		this.viewFromTop = false;
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
            window.dispatchEvent(event);
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
				window.dispatchEvent(event);

                var entityMaterial = new BABYLON.StandardMaterial("eMaterial_" + this.entityId, this.scene);
                entityMaterial.diffuseColor = new BABYLON.Color3(0.1,0,0);

                var ent = BABYLON.Mesh.CreateSphere("sphere_" + this.entityId, 10, 0.5, this.scene);
                ent.position = new BABYLON.Vector3(data[i].position.x, data[i].position.y, data[i].position.z);
                ent.rotation = new BABYLON.Vector3(0, 0, 0);
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
				window.dispatchEvent(event);

                this.scene.render();
            }
            this.startBot();
        },
        startBot : function() {
            var directionBot = 'z';

            setInterval(function(){
                var collisions = false;
                var newPosition = this.entity[2].object.position;
                for(var i =0 ;i< this.interactions.length;i++) {
                    if(this.entity.length > 0 && this.interactions[i].intersectsMesh(this.entity[2].object, false)) {
                        collisions = true;
                        console.log('Bot collision');
                    }
                }
                if(collisions) {
                    var directions = ['x','z'];
                    directionBot = directions[Math.floor((Math.random() * 2) + 0)];
                    //newPosition[directionBot] = newPosition[directionBot]+this.moveSpeed;
                }
                newPosition[directionBot] = newPosition[directionBot]-this.moveSpeed;
                //this.entity[2].onCollisionPositionChange();
                this.entity[2].object.position = newPosition;

                //this.entity[2].object.updatePhysicsBodyPosition();
            }.bind(this), 0.2);
        },
        delete : function(connexionId) {
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
					window.dispatchEvent(event);
					
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
			window.dispatchEvent(event);
			
            var canvas = document.getElementById(config.layout.canvas);
            var engine = new BABYLON.Engine(canvas, true);

            /** Scene Creation **/
            this.scene = new BABYLON.Scene(engine);

            this.scene.workerCollisions = false;
            this.scene.collisionsEnabled = true;
            this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

			// Camera ArcRotate
            /*this.scene.camera = new BABYLON.ArcRotateCamera("ArcRotateCamera",  0.8, 0.3, 25, new BABYLON.Vector3(0, 5, 2), this.scene);
            this.scene.camera.applyGravity = true;
            this.scene.camera.checkCollisions = true;
            this.scene.camera.speed = 0.5;
            this.scene.camera.angularSensibility = 1000;*/

			//Camera Free
			/*this.scene.camera = new BABYLON.FreeCamera("free", new BABYLON.Vector3(0, 1, 0), this.scene);
			this.scene.camera.minZ = 0.5;
			this.scene.camera.checkCollisions = true;
			this.scene.camera.applyGravity = true;
			this.scene.camera.ellipsoid = new BABYLON.Vector3(0, 0, 1);
			this.scene.camera.speed = 0.2;
			this.scene.camera.angularSensibility = 1000;
			
			this.scene.camera.keysUp = [90]; // Touche Z
			this.scene.camera.keysDown = [83]; // Touche S
			this.scene.camera.keysLeft = [81]; // Touche Q
			this.scene.camera.keysRight = [68]; // Touche D;*/
			
			//FollowCamera
			this.scene.camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 0, 0), this.scene);
			this.scene.camera.radius = 3;
			this.scene.camera.heightOffset = 1;
			this.scene.camera.rotationOffset = 0;
			this.scene.camera.cameraAcceleration = 0.2;
			this.scene.camera.maxCameraSpeed = 70;

            /** Attach control keybord and mouses to camera **/
            this.scene.activeCamera.attachControl(canvas); 

            /** Light **/
            var light = new BABYLON.PointLight("DirLight", new BABYLON.Vector3(0, 10, 0), this.scene);
            light.diffuse = new BABYLON.Color3(1, 1, 1);
            light.specular = new BABYLON.Color3(0.6, 0.6, 0.6);
            light.intensity = 1.5;

            /** Attach Action manager to scene **/
            this.scene.actionManager = new BABYLON.ActionManager(this.scene);

            this.scene.registerBeforeRender(this.beforeRender.bind(this));

            /** Dispatch before create scene Custom Event **/
			event = new CustomEvent(
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
			
			window.dispatchEvent(event);
			/** Create Scene **/
            this.createScene();
            
			/** Dispatch after create scene Custom Event **/
			event = new CustomEvent(
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
			window.dispatchEvent(event);
			
			var sceneG = this.scene;
			/** Render Scene **/
            engine.runRenderLoop(function () {
                sceneG.render();
            });

            window.addEventListener("resize", function () {
                engine.resize();
            });
		    /** Dispatch after rebder scene Custom Event **/
			event = new CustomEvent(
				this.entity_code + '_after_render_scene', 
				{
					detail: {
						description:this.entity_code + ' : after render scene function',
						data:{
							scene:this.scene
							}
						}
				}
			);
            window.dispatchEvent(event);
        },
        beforeRender : function() {			
			/** Dispatch before render from events **/
			var event = new CustomEvent(
				this.entity_code + '_before_render_event', 
				{
					detail: {
						description:this.entity_code + ' : before render event function',
						data:{
							event:this.events
							}
						}
				}
			);
			window.dispatchEvent(event);

			if(this.events.joystickRight != '') {
				if(this.events.joystickRight.right()){
					this.events.keys.rotate.right = 1;	
					this.events.dataChanged = true;
				} else {
					this.events.keys.rotate.right = 0;
					this.events.dataChanged = true;
				}
			}
			if(this.events.joystickRight != ''){
				if(this.events.joystickRight.left()){
					this.events.keys.rotate.left = 1;
					this.events.dataChanged = true;				
				} else {
					this.events.keys.rotate.left = 0;
					this.events.dataChanged = true;
				}
			}
			if(this.events.joystickLeft != '') {
				if(this.events.joystickLeft.up()){
					this.events.keys.up = 1;	
					this.events.dataChanged = true;
				} else {
					this.events.keys.up = 0;
					this.events.dataChanged = true;
				}
			}
			if(this.events.joystickLeft != '') {
				if(this.events.joystickLeft.down()){
					this.events.keys.down = 1;
					this.events.dataChanged = true;				
				} else {
					this.events.keys.down = 0;
					this.events.dataChanged = true;
				}
			}
			if(this.events.joystickLeft != '') {
				if(this.events.joystickLeft.right()){
					this.events.keys.right = 1;
					this.events.dataChanged = true;				
				} else {
					this.events.keys.right = 0;
					this.events.dataChanged = true;
				}
			}
			if(this.events.joystickLeft != '') {
				if(this.events.joystickLeft.left()){
					this.events.keys.left = 1;
					this.events.dataChanged = true;				
				} else {
					this.events.keys.left = 0;
					this.events.dataChanged = true;
				}
			}
			if(this.events.hasDataChanged()) {
				var prevPosition = this.entity[this.entityId].object.position;
				var newPosition = new BABYLON.Vector3(0, 0, 0);
				var newRotation = this.entity[this.entityId].object.rotation;
			
				if (this.events.keys.up == 1) {
					var direction = this.getForwardVector(this.scene.camera.rotation, new BABYLON.Vector3(0, 0, 1));
					newPosition.z = direction.z * this.moveSpeed;
					newPosition.y = 0;
					newPosition.x = direction.x * this.moveSpeed;
				}

				if (this.events.keys.down == 1) {
					var direction = this.getForwardVector(this.scene.camera.rotation, new BABYLON.Vector3(0, 0, -1));
					newPosition.z = direction.z * this.moveSpeed;
					newPosition.y = 0;
					newPosition.x = direction.x * this.moveSpeed;
				}

				if (this.events.keys.left == 1) {
					var direction = this.getForwardVector(this.scene.camera.rotation, new BABYLON.Vector3(-1, 0, 0));
					newPosition.z = direction.z * this.moveSpeed;
					newPosition.y = 0;
					newPosition.x = direction.x * this.moveSpeed;
				}

				if (this.events.keys.right == 1) {
					var direction = this.getForwardVector(this.scene.camera.rotation, new BABYLON.Vector3(1, 0, 0));
					newPosition.z = direction.z * this.moveSpeed;
					newPosition.y = 0;
					newPosition.x = direction.x * this.moveSpeed;
				}
				
				if(this.events.keys.rotate.left == 1) {
					newRotation.y = this.entity[this.entityId].object.rotation.y - 0.2;
				}

				if(this.events.keys.rotate.right == 1) {
					newRotation.y = this.entity[this.entityId].object.rotation.y + 0.2;
				}

				var collisions = false;
				for(var i =0 ;i< this.interactions.length;i++) {
					if(this.entity.length > 0 && this.interactions[i].intersectsMesh(this.entity[this.entityId].object, true)) {
						collisions = true;
						console.log('collision');
					}
				}
				
				this.entity[this.entityId].object.rotation = newRotation;
				newPosition.y = 0;
				this.entity[this.entityId].object.moveWithCollisions(newPosition);

				var data = {};
				this.entity[this.entityId].remoteOpts.position = this.entity[this.entityId].object.position;
				data[this.entityId] = this.entity[this.entityId].remoteOpts;
				if(!this.config.simulation) {
					this.user.owner.send(JSON.stringify({f:'entity.update', d:data}));
				}
			}
        },
        getForwardVector: function (rotation, axe) {
			var rotationMatrix = BABYLON.Matrix.RotationYawPitchRoll(rotation.y, rotation.x, rotation.z);   
			var forward = BABYLON.Vector3.TransformCoordinates(axe, rotationMatrix);
			return forward;
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
							if(y == groundSize) {
								var box = dummy;
							} else {
								var box = dummy.clone('box-' + x + '_' + y);
							}
                            box.position = new BABYLON.Vector3(y-(groundSize/2-0.5), cubeSize / 2, (x-groundSize/2-0.5));
                            this.interactions.push(box);
						}
                    }
                } else {
                    for (var x = 1; x <= groundSize; x++) {
						if(x == groundSize) {
							var box = dummy;
						} else {
							var box = dummy.clone('box-' + x + '_' + y);
						}
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
        },
		moveCamera : function (freeCamera, fromPosition, toPosition, fromRotation, toRotation) {

			var animCamPosition = new BABYLON.Animation("animCam", "position", 70,
									  BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
									  BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

			var keysPosition = [];
			keysPosition.push({
				frame: 0,
				value: fromPosition
			});
			keysPosition.push({
				frame: 100,
				value: toPosition
			});

			animCamPosition.setKeys(keysPosition);

			var animCamRotation = new BABYLON.Animation("animCam", "rotation", 70,
									  BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
									  BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

			var keysRotation = [];
			keysRotation.push({
				frame: 0,
				value: fromRotation
			});
			keysRotation.push({
				frame: 100,
				value: toRotation
			});

			animCamRotation.setKeys(keysRotation);
			this.scene.camera.animations.push(animCamPosition);
			this.scene.camera.animations.push(animCamRotation);

			this.scene.beginAnimation(this.scene.camera, 0, 100, false);
		},
		switchView : function() {
			if (!this.viewFromTop) {
				this.viewFromTop = true;
				// Saving current position & rotation in the maze
				this.cameraPos = this.scene.camera.position;
				this.cameraRot = this.scene.camera.rotation;
				this.moveCamera(
					this.scene.camera,
					this.scene.camera.position,
					new BABYLON.Vector3(0, 50, 0),
					this.scene.camera.rotation,
					new BABYLON.Vector3(1.4912565104551518, 3.1, this.scene.camera.rotation.z)
				);
			}
			else {
				this.viewFromTop = false;
				this.moveCamera(
					this.scene.camera,
					this.scene.camera.position,
					this.cameraPos,
					this.scene.camera.rotation,
					this.cameraRot
				);
			}
			this.scene.camera.applyGravity = !this.viewFromTop;
		}
    };
    return loonyball;
});
