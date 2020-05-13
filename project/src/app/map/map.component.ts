import { Component, OnInit } from '@angular/core';
import mapStyle from '../../assets/mapStyle';
import MovePointLayer from '../../assets/MovePointLayer';
import DomLayer from '../../assets/DomLayer';
declare var BMap: any;
declare var BMapLib: any;

const coors = [{
  name: '泸州',
  coor: [105.440486, 28.883086],
  desc: {
    content: ['家乡'],
    period: '1990-2008',
    offset: [-220, 20]
  }
}, {
  name: '南充',
  coor: [106.087608, 30.790563],
  desc: {
    period: '2008-2010',
    content: ['本科（西南石油大学）'],
    offset: [10, -90]
  }
}, {
  name: '成都',
  coor: [104.073337, 30.631039],
  desc: {
    period: '2010-2012',
    content: ['本科（西南石油大学）'],
    offset: [-210, -90]
  }
}, {
  name: '北京',
  coor: [116.403838, 39.915931],
  desc: {
    period: '2012-2015',
    content: ['硕士（中国石油大学）'],
    offset: [-210, -90]
  }
}, {
  name: '天津',
  coor: [117.21878, 39.143252],
  desc: {
    period: '2015',
    content: ['工作1（中海油）'],
    offset: [30, 30]
  }
}, {
  name: '重庆',
  coor: [106.552947, 29.561181],
  desc: {
    period: '2016-2018',
    content: ['工作2（新东方培训学校）', '工作3（采田信息）'],
    offset: [20, 30]
  }
}, {
  name: '广州',
  coor: [113.270548, 23.135506],
  desc: {
    period: '2018至今',
    content: ['工作4（锦行科技）'],
    offset: [30, 30]
  }
}]
const center = [108.916569, 34.40422]

const mainColor = 'rgb(34, 221, 228)'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {
  map: any;
  aniLayer: any;
  type: any = 1;

  constructor() { }

  ngOnInit() {
    this.initMap();
    // this.createMoveline();
    // this.addDescription();
  }

  initMap(): void {
    const map = new BMap.Map('map', {
      enableMapClick: false
    });
    map.centerAndZoom(new BMap.Point(...center), 6);
    map.enableScrollWheelZoom();
    map.setMapStyleV2({ styleJson: mapStyle });
    this.map = map;
  }

  createMoveline(): void {
    const map = this.map;
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
      });
      label.name=e.name;
      map.addOverlay(label)
    });

    const aniLayer = new MovePointLayer(BMapLib.CurveLine.getCurvePoints(pts, map.getZoom()));
    map.addOverlay(aniLayer);
    aniLayer.render();
    this.aniLayer = aniLayer;

    this.map.addEventListener('zoomend', () => {
      const ratio = aniLayer.currentPathIndex / aniLayer.path.length;
      aniLayer.path = BMapLib.CurveLine.getCurvePoints(pts, map.getZoom());
      aniLayer.currentPathIndex = Math.floor(ratio * aniLayer.path.length);
    })
  }

  switch(type): void {
    this.type = type;
  }

  addDescription(): void {
    const doms = [];
    coors.forEach(e => {
      const desc = document.createElement('div');
      desc.style.cssText = `
      background-color:rgba(0,0,0,0.8);
      border-radius:5px;
      position:absolute;
      width:170px;
      color:#fff;
      padding:10px;
      border:2px solid rgba(178, 164, 113,0.5);
      cursor:pointer;
      opacity:0.15;
      `;
      desc.onmouseenter =e=> {
        const target=e.target as HTMLElement;
        target.style.opacity = '1';
        this.map.getOverlays().find(e2 => e2.name === target.dataset.name).setStyle({ color: 'rgb(178, 164, 113)',fontSize:'20px',fontWeight:'bold' });
      }
      desc.onmouseleave = e => {
        const target=e.target as HTMLElement;
        target.style.opacity = '0.15';
        this.map.getOverlays().find(e2 => e2.name === target.dataset.name).setStyle({ color: mainColor,fontSize:'12px',fontWeight:'normal' });
      }
      desc.dataset.lng = `${e.coor[0]}`;
      desc.dataset.lat = `${e.coor[1]}`;
      desc.dataset.offsetX = `${e.desc.offset[0]}`;
      desc.dataset.offsetY = `${e.desc.offset[1]}`;
      desc.dataset.name=e.name;
      desc.innerHTML = `
      <div style="text-align:center;border-bottom:1px solid rgb(178, 164, 113);">${e.desc.period}</div>
      <div style="padding-top:10px;">${e.desc.content.join('<br/>')}</div>
      `;
      doms.push(desc);
    })
    const descLayer = new DomLayer(doms);
    this.map.addOverlay(descLayer);
  }

}
