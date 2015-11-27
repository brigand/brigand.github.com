// source: http://codepen.io/teolitto/pen/KwOVvL?editors=001

var camera, scene, renderer,
    geometry, material, mesh;

init();
animate();

function init() {
  clock = new THREE.Clock();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1000;
  scene.add( camera );

  geometry = new THREE.CubeGeometry( 200, 200, 200 );
  material = new THREE.MeshLambertMaterial( { color: 0xff0000, wireframe: false } );
  mesh = new THREE.Mesh( geometry, material );
  //scene.add( mesh );
  cubeSineDriver = 0;

  light = new THREE.DirectionalLight(0xffffff,0.5);
  light.position.set(-1,0,1);
  scene.add(light);

  smokeTexture = THREE.ImageUtils.loadTexture('smoke.png');
  smokeMaterial = new THREE.MeshLambertMaterial({color: 0x30a0ff, map: smokeTexture, transparent: true});
  smokeGeo = new THREE.PlaneGeometry(300,300);
  smokeParticles = [];


  for (p = 0; p < 150; p++) {
    var particle = new THREE.Mesh(smokeGeo,smokeMaterial);
    particle.position.set(Math.random()*500-250,Math.random()*300-300,Math.random()*1000-100);
    particle.rotation.z = Math.random() * 360;
    particle.direction = Math.random() > 0.5;
    scene.add(particle);
    smokeParticles.push(particle);
  }

  document.body.appendChild( renderer.domElement );

}

function animate() {

  // note: three.js includes requestAnimationFrame shim
  delta = clock.getDelta();
  requestAnimationFrame( animate );
  evolveSmoke();
  render();
}

function evolveSmoke() {
  var sp = smokeParticles.length;
  while(sp--) {
    var particle = smokeParticles[sp];
    particle.rotation.z += (delta * 0.2);
  }
}

function render() {
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.01;
  cubeSineDriver += .01;
  mesh.position.z = 100 + (Math.sin(cubeSineDriver) * 500);
  renderer.render( scene, camera );
}






