function MovePointLayer(path, opts = {}) {
    this.path = path;
    this.opts = {
        ...opts
    }
    this.currentPathIndex = 0;
}

MovePointLayer.prototype = new BMap.Overlay();
MovePointLayer.prototype.constructor = MovePointLayer;
MovePointLayer.prototype.initialize = function (map) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;left:0;top:0;';
    this._ctx = canvas.getContext('2d');
    const size = map.getSize();
    canvas.width = size.width;
    canvas.height = size.height;
    map.getPanes().labelPane.appendChild(canvas);
    this._canvas = canvas;
    this._map = map;
    return canvas;
}
MovePointLayer.prototype.draw = function () { }
MovePointLayer.prototype.drawPoint = function () {
    const map = this._map;
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const bias = map.pointToOverlayPixel(new BMap.Point(sw.lng, ne.lat));
    this._canvas.style.left = bias.x + 'px'
    this._canvas.style.top = bias.y + 'px'
    const pointNum = 20;
    const ctx = this._ctx;
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    for (let i = 0; i < pointNum; i += 1) {
        if (this.currentPathIndex - i < 0) {
            break;
        }
        const currentPixel = map.pointToOverlayPixel(this.path[this.currentPathIndex - i]);
        ctx.fillStyle = `rgba(255,255,255,${0.9 * (1 - i / pointNum)})`;
        ctx.beginPath();
        ctx.arc(currentPixel.x - bias.x, currentPixel.y - bias.y,
            3 * (1 - i / pointNum), 0, Math.PI * 2)
        ctx.closePath();
        ctx.fill();
    }
}

MovePointLayer.prototype.moveOn = function () {
    this.currentPathIndex += 1;
    if (this.currentPathIndex >= this.path.length) {
        this.currentPathIndex = 0;
    }
}
MovePointLayer.prototype.render = function () {
    this.moveOn();
    this.drawPoint();
    requestAnimationFrame(() => this.render());
}

export default MovePointLayer;