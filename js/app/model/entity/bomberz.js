define(['babylon.2.2','Oimo'], function () {
    function bomberz(user, events) {
        this.scene = {};
        this.config = {};
        this.camera = {};
        this.entity = [];
        this.entityId = 0;
        this.interactions = [];
        this.moveSpeed = 0.25;
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
    bomberz.prototype = {
        init: function(data) {
            var data = JSON.parse(data);
            this.entityId = data.id;
        },
        new: function(data) {
            var data = JSON.parse(data);
            for(var i in data) {
                var entityMaterial = new BABYLON.StandardMaterial("eMaterial_" + this.entityId, this.scene);
                //entityMaterial.diffuseTexture = new BABYLON.Texture("images/box.png", this.scene);
                entityMaterial.diffuseColor = new BABYLON.Color3(0.1,0,0);
                var ent = BABYLON.Mesh.CreateSphere("sphere_" + this.entityId, 20, 0.9, this.scene);

                //ent._onCollisionPositionChange = function (collisionId, newPosition, collidedMesh) {
                //    if (collidedMesh === void 0) { collidedMesh = null; }
                //
                //    var oldPosition = ent.position.clone();
                //
                //    if (ent.getScene().workerCollisions)
                //        newPosition.multiplyInPlace(ent._collider.radius);
                //    newPosition.subtractToRef(ent._oldPositionForCollisions, ent._diffPositionForCollisions);
                //    if (ent._diffPositionForCollisions.length() > BABYLON.Engine.CollisionsEpsilon) {
                //        ent.position.addInPlace(ent._diffPositionForCollisions);
                //    }
                //    if (ent.onCollide && collidedMesh) {
                //        ent.onCollide(collidedMesh);
                //    }
                //    console.debug('previous position', oldPosition.z, 'current position', ent.position.z);
                //};

                ent.position = new BABYLON.Vector3(data[i].position.x, data[i].position.y, data[i].position.z);
                ent.material = entityMaterial;
                //ent.rotation = new BABYLON.Vector3(1,1,1);
                //ent.applyGravity = true;

                //ent.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { move:true, restitution: 3, mass:1.5, friction:3 });
                ent.showBoundingBox = true;
                ent.checkCollisions = true;
                //ent.elipsoid = new BABYLON.Vector3(2, 2.0, 2);
                //ent.ellipsoidOffset = new BABYLON.Vector3(0, 1.0, 0)
                //var forwards = new BABYLON.Vector3(parseFloat(Math.sin(ent.rotation.y)) / this.moveSpeed, 0.15, parseFloat(Math.cos(ent.rotation.y)) / this.moveSpeed);
                //forwards.negate();
                //ent.moveWithCollisions(forwards);
                //var backwards = new BABYLON.Vector3(parseFloat(Math.sin(ent.rotation.y)) / this.moveSpeed, -0.15, parseFloat(Math.cos(ent.rotation.y)) / this.moveSpeed);
                //ent.moveWithCollisions(backwards);

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
                //Camera target
                if(this.entityId == data[i].id) {
                    this.scene.camera.target = this.entity[data[i].id].object;
                }
                this.scene.render();
            }
        },
        delete: function(connexionId) {
            var i;
            for(i in this.entity) {
                if(this.entity[i].owner == connexionId) {
                    this.entity[i].object.dispose();
                    this.scene.render();
                    this.entity.splice(i);
                    console.log('entity delete EXECUTED');
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
            var canvas = document.getElementById(config.game.canvas_id);
            var engine = new BABYLON.Engine(canvas, true);

            // Scene Creation
            this.scene = new BABYLON.Scene(engine);
            //this.scene.enablePhysics(new BABYLON.Vector3(0,-10,0));
            //this.scene.gravity = new BABYLON.Vector3(0, 10, 0);

            this.scene.workerCollisions = false;
            this.scene.collisionsEnabled = true;

            this.scene.camera = new BABYLON.ArcRotateCamera("ArcRotateCamera",  0.8, 0.3, 25, new BABYLON.Vector3(0, 5, 2), this.scene);
            //this.scene.camera = new BABYLON.FreeCamera("MainCamera", new BABYLON.Vector3(0, 35, -25), this.scene);
            //this.scene.camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 15, -10), this.scene);

            this.camera.applyGravity = true;
            //this.camera.checkCollisions = true;

            /** Attach control keybord and mouses to camera **/
            this.scene.activeCamera.attachControl(canvas);

            this.camera.speed = 0.5;
            this.camera.angularSensibility = 1000;

            // Debug
            //this.scene.debugLayer.show();
            //this.scene.debugLayer.shouldDisplayAxis = function (mesh) {
            //    return mesh.name === "sphere1";
            //}

            // Light
            var light = new BABYLON.PointLight("DirLight", new BABYLON.Vector3(0, 10, 0), this.scene);
            light.diffuse = new BABYLON.Color3(1, 1, 1);
            light.specular = new BABYLON.Color3(0.6, 0.6, 0.6);
            light.intensity = 1.5;


            //Attach Action manager to scene
            this.scene.actionManager = new BABYLON.ActionManager(this.scene);

            this.scene.registerBeforeRender(function() {
                if(this.events.hasDataChanged()) {
                    var prevPosition = this.entity[this.entityId].object.position;
                    var newPosition;
                    if (this.events.keys.up == 1) {
                        newPosition = new BABYLON.Vector3(0, 0, -this.moveSpeed);
                    }

                    if (this.events.keys.down == 1) {
                        newPosition = new BABYLON.Vector3(0, 0, this.moveSpeed);
                    }

                    if (this.events.keys.left == 1) {
                        newPosition = new BABYLON.Vector3(this.moveSpeed, 0, 0);
                    }

                    if (this.events.keys.right == 1) {
                        newPosition = new BABYLON.Vector3(-this.moveSpeed, 0, 0);
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
            }.bind(this));

            // Runner =)
            var gameScene = this.createScene();
			var sceneG = this.scene;
            engine.runRenderLoop(function () {
                sceneG.render();
            });
        },
        beforeRender : function() {
			
			
        },
        move: function(evt, instance) {
            var newPos;
            switch(evt.sourceEvent.key) {
                case 'z' :  this.entity[this.entityId].object.position.z = this.entity[this.entityId].object.position.z-1;
                    break;
                case 'q' :  this.entity[this.entityId].object.position.x = this.entity[this.entityId].object.position.x+1;
                    break;
                case 'd' :  this.entity[this.entityId].object.position.x = this.entity[this.entityId].object.position.x-1;
                    break;
                case 's' :  this.entity[this.entityId].object.position.z = this.entity[this.entityId].object.position.z+1;
                    break;
            }
            newPos = new BABYLON.Vector3(this.entity[this.entityId].object.position.x, this.entity[this.entityId].object.position.y, this.entity[this.entityId].object.position.z);
            this.entity[this.entityId].object.position = newPos;
            this.entity[this.entityId].remoteOpts.position = this.entity[this.entityId].object.position;
            var data = {};
            data[this.entityId] = this.entity[this.entityId].remoteOpts;
            if(!this.config.simulation) {
                this.user.owner.send(JSON.stringify({f:'entity.update', d:data}));
            }
            this.scene.render();
        },
        createScene: function () {
            // ground creation
            var groundSize = 20;
            var ground = BABYLON.Mesh.CreateGround("ground", 20, 20, 0, this.scene);
            //ground.rotation.x = Math.PI / 2;
            //ground.applyGravity = true;
            //ground.material = new BABYLON.StandardMaterial("gMaterial", this.scene);
            //ground.material.diffuseTexture = new BABYLON.Texture("images/ground.png", this.scene);
            ground.checkCollisions = true;
            //ground.setPhysicsState({ impostor: BABYLON.PhysicsEngine.PlaneImpostor, move:true, restitution: 0,  mass:0, friction:1});
            ground.showBoundingBox = true;

            var boxMaterial = new BABYLON.StandardMaterial("bMaterial", this.scene);
            //boxMaterial.diffuseTexture = new BABYLON.Texture("images/box.png", this.scene);
            boxMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.5, 0.1);

            var cubeSize = 1;
            var dummy = BABYLON.Mesh.CreateBox("dummyBox", cubeSize, this.scene);
            dummy.material = boxMaterial;
            dummy.checkCollisions = true;
			dummy.applyGravity = true;
            // Apply rotation movement
            //box.rotation = new BABYLON.Vector3(0, 0, 1.5);
            //var physicState = [BABYLON.PhysicsEngine.BoxImpostor, { move:false, restitution: 0, mass:0, friction:0 }];
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
                            //box.setPhysicsState(physicState[0], physicState[1]);
                            //box.updatePhysicsBodyPosition();
                            //box.refreshBoundingInfo();
                            this.interactions.push(box);
						}
                    }
                } else {
                    for (var x = 1; x <= groundSize; x++) {
                        var box = dummy.clone('box-' + x + '_' + y);
                        box.position = new BABYLON.Vector3(y-(groundSize/2-0.5), cubeSize / 2, (x-groundSize/2-0.5));
                        //box.rotation = new BABYLON.Vector3(0, 0, 1.5);
                        //box.setPhysicsState(physicState[0], physicState[1]);
                        //box.updatePhysicsBodyPosition();
                        //box.refreshBoundingInfo();
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
                //this.entity[data[i].id].object.updatePhysicsBodyPosition();
                this.scene.render();
            }
        }
    };
    return bomberz;
});
