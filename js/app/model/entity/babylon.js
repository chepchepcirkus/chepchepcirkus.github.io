define(['babylon.2.2'], function () {
    function babylon(user, events) {
        this.scene = {};
        this.camera = {};
        this.entity = [];
        this.entityId = 0;
        this.moveSpeed = 0.5;
        this.user = user;
        this.events = new events();
    }
    babylon.prototype = {
        init: function(data) {
            var data = JSON.parse(data);
            this.entityId = data.id;
        },
        new: function(data) {
            var data = JSON.parse(data);
            for(var i in data) {
                var boxMaterial = new BABYLON.StandardMaterial("bMaterial_" + this.entityId, this.scene);
                boxMaterial.diffuseTexture = new BABYLON.Texture("images/box.png", this.scene);
                var box = BABYLON.Mesh.CreateBox("box_" + this.entityId, 2.5, this.scene);
                box.position = new BABYLON.Vector3(data[i].position.x, 2.5 / 2, data[i].position.z);
                box.material = boxMaterial;
                box.checkCollisions = true;
                box.applyGravity = true;

                this.entity[data[i].id] = {
                    owner: data[i].id,
                    entityId: data[i].id,
                    object: box,
                    remoteOpts: {
                        id: data[i].id,
                        position: {
                            x: data[i].position.x,
                            z: data[i].position.z
                        }
                    }
                };
                console.log(data[i].id);
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
            var canvas = document.getElementById(config.game.canvas_id);
            var engine = new BABYLON.Engine(canvas, true);

            // Scene Creation
            this.scene = new BABYLON.Scene(engine);
            this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
            this.scene.collisionsEnabled = true;
            /* Event / Trigger */

            // Camera and Controller
            //this.camera = new BABYLON.FreeCamera("MainCamera", new BABYLON.Vector3(0, 2.5, 5), this.scene);

            //
            //this.camera.keysUp = [90]; // keyboard input Z
            //this.camera.keysDown = [83]; // keyboard input S
            //this.camera.keysLeft = [81]; // keyboard input Q
            //this.camera.keysRight = [68]; // keyboard input D;

            this.scene.camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 15, -45), this.scene);
            this.camera.applyGravity = true;
            this.camera.checkCollisions = true;
            this.scene.activeCamera.attachControl(canvas);

            this.camera.speed = 0.5;
            this.camera.angularSensibility = 1000;

            // Light
            var light = new BABYLON.PointLight("DirLight", new BABYLON.Vector3(0, 10, 0), this.scene);
            light.diffuse = new BABYLON.Color3(1, 1, 1);
            light.specular = new BABYLON.Color3(0.6, 0.6, 0.6);
            light.intensity = 1.5;


            //Attach Action manager to scene
            this.scene.actionManager = new BABYLON.ActionManager(this.scene);



            //Attach action to scene
            //this.scene.actionManager.registerAction(
            //    new BABYLON.ExecuteCodeAction(
            //        BABYLON.ActionManager.OnKeyUpTrigger, this.move.bind(this))
            //);

            this.scene.registerBeforeRender(function() {
                if(this.events.hasDataChanged()) {
                    if (this.events.keys.up == 1) {
                        this.entity[this.entityId].object.position.z = this.entity[this.entityId].object.position.z-this.moveSpeed;
                        this.entity[this.entityId].remoteOpts.position.z = this.entity[this.entityId].object.position.z-this.moveSpeed;
                    }

                    if (this.events.keys.down == 1) {
                        this.entity[this.entityId].object.position.z = this.entity[this.entityId].object.position.z+this.moveSpeed;
                        this.entity[this.entityId].remoteOpts.position.z = this.entity[this.entityId].object.position.z+this.moveSpeed;
                    }

                    if (this.events.keys.left == 1) {
                        this.entity[this.entityId].object.position.x = this.entity[this.entityId].object.position.x+this.moveSpeed;
                        this.entity[this.entityId].remoteOpts.position.x = this.entity[this.entityId].object.position.x+this.moveSpeed;
                    }

                    if (this.events.keys.right == 1) {
                        this.entity[this.entityId].object.position.x = this.entity[this.entityId].object.position.x-this.moveSpeed;
                        this.entity[this.entityId].remoteOpts.position.x = this.entity[this.entityId].object.position.x-this.moveSpeed;
                    }

                    newPos = new BABYLON.Vector3(this.entity[this.entityId].object.position.x, 2.5 / 2, this.entity[this.entityId].object.position.z);
                    this.entity[this.entityId].object.position = newPos;
                    var data = {};
                    data[this.entityId] = this.entity[this.entityId].remoteOpts;
                    this.user.owner.send(JSON.stringify({f:'entity.update', d:data}));
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
                    this.entity[this.entityId].remoteOpts.position.z = this.entity[this.entityId].object.position.z-1;
                    break;
                case 'q' :  this.entity[this.entityId].object.position.x = this.entity[this.entityId].object.position.x+1;
                    this.entity[this.entityId].remoteOpts.position.x = this.entity[this.entityId].object.position.x+1;
                    break;
                case 'd' :  this.entity[this.entityId].object.position.x = this.entity[this.entityId].object.position.x-1;
                    this.entity[this.entityId].remoteOpts.position.x = this.entity[this.entityId].object.position.x-1;
                    break;
                case 's' :  this.entity[this.entityId].object.position.z = this.entity[this.entityId].object.position.z+1;
                    this.entity[this.entityId].remoteOpts.position.z = this.entity[this.entityId].object.position.z+1;
                    break;
            }
            newPos = new BABYLON.Vector3(this.entity[this.entityId].object.position.x, 2.5 / 2, this.entity[this.entityId].object.position.z);
            this.entity[this.entityId].object.position = newPos;
            var data = {};
            data[this.entityId] = this.entity[this.entityId].remoteOpts;
            this.user.owner.send(JSON.stringify({f:'entity.update', d:data}));
            this.scene.render();
        },
        createScene: function () {
            // ground creation
            var ground = BABYLON.Mesh.CreatePlane("ground", 50, this.scene);
            ground.rotation.x = Math.PI / 2;
            ground.material = new BABYLON.StandardMaterial("gMaterial", this.scene);
            ground.material.diffuseTexture = new BABYLON.Texture("images/ground.png", this.scene);
            ground.checkCollisions = true;

            var boxMaterial = new BABYLON.StandardMaterial("bMaterial", this.scene);
            boxMaterial.diffuseTexture = new BABYLON.Texture("images/box.png", this.scene);

            var positions = [
                {x: -15, z: 15},
                {x: -15, z: -15},
                {x: 15, z: 15},
                {x: 15, z: -15}
            ];

            var cubeSize = 2.5;

            for (var i = 0; i < 4; i++) {
                var box = BABYLON.Mesh.CreateBox("box1", cubeSize, this.scene);
                box.position = new BABYLON.Vector3(positions[i].x, cubeSize / 2, positions[i].z);
                box.material = boxMaterial;
                box.checkCollisions = true;
            }
        },

        update:function (data) {
            var data = JSON.parse(data);
            for(var i in data) {
                //this.entity[data[i].id] = data[i];
                this.entity[data[i].id].object.position = new BABYLON.Vector3(data[i].position.x, 2.5 / 2, data[i].position.z);
                this.scene.render();
            }
        }
    };
    return babylon;
});