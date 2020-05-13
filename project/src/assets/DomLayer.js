//[{e,pt}]
function DomLayer(doms) {
    this._doms = doms;
}
DomLayer.prototype = new BMap.Overlay();
DomLayer.prototype.initialize = function (map) {
    this._map = map;
    const div = document.createElement('div');
    div.style.cssText = 'position:absolute;top:0;left:0';

    this._doms.forEach(e => {
        div.appendChild(e);
    })
    map.getPanes().labelPane.appendChild(div);

    this._div = div;
    return div;
}
DomLayer.prototype.draw = function () {
    const map = this._map;
    [...this._div.children].forEach(e => {
        const pixel = map.pointToOverlayPixel(new BMap.Point(parseFloat(e.dataset.lng), parseFloat(e.dataset.lat)));
        e.style.left = pixel.x + parseInt(e.dataset.offsetX) + "px";
        e.style.top = pixel.y + parseInt(e.dataset.offsetY)+ "px";
    })
}

export default DomLayer;