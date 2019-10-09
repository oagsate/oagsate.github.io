import { Component, OnInit } from '@angular/core';
import mapStyle from '../../assets/mapStyle';
import MovePointLayer from '../../assets/MovePointLayer';
declare var BMap: any;
declare var BMapLib: any;

const coors = [{
  name: '泸州',
  coor: [105.440486, 28.883086]
}, {
  name: '成都',
  coor: [104.073337, 30.631039]
}, {
  name: '北京',
  coor: [116.403838, 39.915931]
}, {
  name: '天津',
  coor: [117.21878, 39.143252]
}, {
  name: '重庆',
  coor: [106.552947, 29.561181]
}, {
  name: '广州',
  coor: [113.270548, 23.135506]
}]
const center = [108.916569, 34.40422]

const mainColor = 'rgb(34, 221, 228)'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    const map = new BMap.Map('map', {
      enableMapClick: false
    });
    map.centerAndZoom(new BMap.Point(...center), 6);
    map.enableScrollWheelZoom();
    map.setMapStyleV2({ styleJson: mapStyle });

    const pts = coors.map(e => new BMap.Point(...e.coor));

    const curve = new BMapLib.CurveLine(pts, { strokeColor: mainColor, strokeWeight: 2, strokeOpacity: 0.5 });
    map.addOverlay(curve);

    const options = {
      color: mainColor
    }
    const pointCollection = new BMap.PointCollection(pts, options)
    map.addOverlay(pointCollection);

    coors.forEach(e => {
      const label = new BMap.Label(e.name, {
        position: new BMap.Point(...e.coor)
      });
      label.setStyle({
        backgroundColor: 'rgba(0,0,0,0)',
        border: 'none',
        color: mainColor
      })
      map.addOverlay(label)
    });

    const aniLayer=new MovePointLayer(BMapLib.CurveLine.getCurvePoints(pts,map.getZoom()));
    map.addOverlay(aniLayer);
    aniLayer.render();

    
  }

}
