class BaseCube {
    constructor(CubeColor) {
        this.Position = new THREE.Vector3(0, 0, 0);

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({ color: CubeColor });
        this.Mesh = new THREE.Mesh(geometry, material);
    }
}

class Tetromino {

}