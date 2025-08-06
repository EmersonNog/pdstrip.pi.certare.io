import { AngularFirestore } from "angularfire2/firestore";
import { DateUtil } from "./date.util";
import { MapUtil2 } from "./map.util2";
import * as wkt from "wkt";

declare var google: any;

export class MapUtil {
  handlePolylineClick(latLng, map, afd) {
    const tolerance = 20;
    const polylinesNearby = MapUtil.rotaPolylines
      .map((polyline, idx) => {
        const path = polyline.getPath().getArray();
        const found = path.some((point) => {
          return (
            google.maps.geometry.spherical.computeDistanceBetween(
              point,
              latLng
            ) < tolerance
          );
        });
        const polyId =
          (polyline as any).ROUTE_ID ||
          (polyline as any).id ||
          `SemID_${idx + 1}`;

        const polyLigacao = (polyline as any).LIGACAO || "";

        return found ? { polyline, idx, polyId, polyLigacao } : null;
      })
      .filter((item) => item !== null);

    if (polylinesNearby.length === 0) return;

    if (polylinesNearby.length === 1) {
      google.maps.event.trigger(polylinesNearby[0].polyline, "click", {
        latLng,
      });
      return;
    }

    const infoDiv = document.createElement("div");
    infoDiv.style.maxWidth = "270px";
    infoDiv.style.padding = "12px 0 8px 0";
    infoDiv.style.fontFamily = "inherit";
    infoDiv.innerHTML = `
  <div style="font-size:16px; font-weight:600; color:#222; margin-bottom: 8px;">
    Selecione a rota desejada
  </div>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    ${polylinesNearby
      .map(
        (item) => `
          <button 
            style="
              width: 100%;
              padding: 10px 6px;
              border-radius: 6px;
              background: #1976d2;
              color: #fff;
              font-weight: 500;
              border: none;
              text-align: left;
              transition: background 0.2s;
              font-size: 15px;
              box-shadow: 0 1px 6px rgba(40,40,40,0.07);
              margin-bottom:0;
            "
            data-polyid="${item.polyId} ${item.polyLigacao}"
            onmouseover="this.style.background='#1250a3'"
            onmouseout="this.style.background='#1976d2'"
          >
            <span style="display:block; font-size:13px; color:#b5d1f2; margin-bottom:2px;">
              Código: <span style="color:white">${item.polyId}</span>
            </span>
            <span style="display:block; font-size:14px; color:#b5d1f2; margin-bottom:2px;">
              Ligação: <span style="color:white">${
                item.polyLigacao || "(sem nome)"
              }</span>
            </span>
          </button>
        `
      )
      .join("")}
  </div>
`;

    const infoWindow = new google.maps.InfoWindow({
      content: infoDiv,
      position: latLng,
    });
    infoWindow.open(map);

    infoDiv.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === "BUTTON") {
        const polyId = target.getAttribute("data-polyid");
        const selected = polylinesNearby.find(
          (item) => `${item.polyId} ${item.polyLigacao}` === polyId
        );
        if (selected) {
          infoWindow.close();
          google.maps.event.trigger(selected.polyline, "click", { latLng });
        }
      }
    });
  }

  public map: google.maps.Map;

  static pontosSecaoMarkers: google.maps.Marker[] = [];
  static acidentesMarkers: google.maps.Marker[] = [];
  static rotaPolylines: google.maps.Polyline[] = [];

  constructor(mapInstance: google.maps.Map) {
    this.map = mapInstance;
  }

  static classificacaoNome = "HDM4";
  static classificacaoSayers = "PAVIMENTO_NOVO";
  static classificacaoObj = {};

  mapUtil = new MapUtil2();

  createMap(mapElement) {
    return this.mapUtil.createMap(mapElement);
  }

  cleanPontosSecao() {
    MapUtil.pontosSecaoMarkers.forEach((marker) => marker.setMap(null));
    MapUtil.pontosSecaoMarkers = [];
  }

  cleanRotas() {
    MapUtil.rotaPolylines.forEach((poly) => poly.setMap(null));
    MapUtil.rotaPolylines = [];
  }

  cleanAcidentes() {
    MapUtil.acidentesMarkers.forEach((marker) => marker.setMap(null));
    MapUtil.acidentesMarkers = [];
  }

  public mapOptions() {
    return this.mapUtil.mapOptions();
  }

  public destroy() {
    this.mapUtil.destroy();
  }

  addInfoWindow(poly, content, map, infowindow) {
    infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(poly, "click", function (event) {
      infowindow.setContent(content);
      infowindow.setPosition(event.latLng);

      MapUtil2.infoWindows.length > 0 &&
        MapUtil2.infoWindows.forEach((infow) => infow.close());
      infowindow.open(map);
      MapUtil2.infoWindows.push(infowindow);
    });
  }

  public setCenter(estado = "MG", map) {
    map.setCenter({ lat: -5.107781872002695, lng: -42.78655968935647 });
    map.setZoom(15);
  }

  public showAcidentesPoints(
    route: any,
    map,
    isAcidente = false,
    type = undefined,
    showBtnImages = true
  ) {
    let itemArr: any[] = route;
    let polyline;
    const latArrOk = itemArr.filter((item) => item.lat !== 0.0);
    const hasPoints = latArrOk.length > 0;

    if (itemArr.length > 0 && hasPoints) {
      let indexCenter = (itemArr.length / 2) | 0;

      for (let i = 0; i < itemArr.length; i++) {
        if (type && type === "limite-municipio") {
          let cor = "#EA4444";

          polyline = new google.maps.Marker({
            position: { lat: itemArr[i].lat, lng: itemArr[i].lng },
            title: itemArr[i]["title"],
            icon: new google.maps.MarkerImage(
              "assets/icon/" + "noun-metro-station.svg"
            ),
          });
          this.addInfoWindow(
            polyline,
            "Nome da estação: " + itemArr[i].name,
            map,
            new google.maps.InfoWindow()
          );
        } else {
          polyline = new google.maps.Marker({
            position: { lat: itemArr[i].lat, lng: itemArr[i].lng },
            title: itemArr[i]["title"],
            icon: new google.maps.MarkerImage(
              "assets/icon/" + itemArr[i]["icon"]
            ),
          });
        }

        polyline.setMap(map);
        MapUtil2.polylines.push(polyline);

        if (type && type === "exames") {
          let infowindow = new google.maps.InfoWindow({
            content: this.createInfoWindowExame(itemArr[i]),
          });

          google.maps.event.addListener(polyline, "click", (event) => {
            infowindow.setPosition(event.latLng);
            infowindow.open(map);
            MapUtil2.infoWindows.push(infowindow);

            if (MapUtil2.infoWindows.length > 1) {
              MapUtil2.infoWindows.forEach((value, index, arr) => {
                if (value != infowindow) {
                  value.close();
                  MapUtil2.infoWindows.splice(index, 1);
                }
              });
            }
          });
        } else {
        }
      }
    }
  }

  showRodoviaLines(rotas: any[], map: any) {
    rotas.forEach((rota) => {
      const polyline = new google.maps.Polyline({
        path: rota.path,
        geodesic: true,
        strokeColor: rota.color || "#009688",
        strokeOpacity: 1.0,
        strokeWeight: 4,
      });

      polyline.setMap(map);
      MapUtil.rotaPolylines.push(polyline);
    });
  }

  showPontosSecao(
    pontos: any[],
    map: any,
    afd: AngularFirestore,
    isAdmin: boolean
  ) {
    pontos.forEach((ponto) => {
      // Garanta que ponto.id é o Firestore ID!
      const marker = new google.maps.Marker({
        position: { lat: ponto.lat, lng: ponto.lng },
        map,
        title: ponto.title || ponto.name,
        icon: {
          url: "assets/icon/ponto_secao.png",
          scaledSize: new google.maps.Size(38, 45),
        },
      });

      // Formulário de edição embutido no popup
      const infoWindow = new google.maps.InfoWindow({
        content: `
    <form id="edit-ponto-${
      ponto.id
    }" style="max-width:280px; padding:8px 0 0 0; font-family:inherit;">
      <h3 style="margin-top:0; margin-bottom:12px; font-size:18px; color:#1976d2;">Ponto de Seção</h3>
      <div style="margin-bottom:8px;">
        <label style="display:block; font-weight:600; color:#444;">Hierarquia</label>
        <input type="text" name="hierarquia" value="${ponto.hierarquia || ""}" 
          style="width:100%; padding:6px; border-radius:6px; border:1px solid #ccc;">
      </div>
      <div style="margin-bottom:8px;">
        <label style="display:block; font-weight:600; color:#444;">Rota</label>
        <input type="text" name="route_id" value="${ponto.route_id || ""}" 
          style="width:100%; padding:6px; border-radius:6px; border:1px solid #ccc;">
      </div>
      <div style="margin-bottom:8px;">
        <label style="display:block; font-weight:600; color:#444;">Km</label>
        <input type="text" name="milepost" value="${ponto.milepost || ""}" 
          style="width:100%; padding:6px; border-radius:6px; border:1px solid #ccc;">
      </div>
      <div style="margin-bottom:8px;">
        <label style="display:block; font-weight:600; color:#444;">Nome da Parada</label>
        <input type="text" name="stop_name" value="${ponto.stop_name || ""}" 
          style="width:100%; padding:6px; border-radius:6px; border:1px solid #ccc;">
      </div>
       <div style="margin-bottom:8px;">
        <label style="display:block; font-weight:600; color:#444;">Terminal</label>
        <input type="text" name="terminal" value="${ponto.terminal || ""}" 
          style="width:100%; padding:6px; border-radius:6px; border:1px solid #ccc;">
      </div>
      <div style="margin-bottom:8px; display:flex; gap:8px;">
        <div style="flex:1">
          <label style="display:block; font-weight:600; color:#444;">Demanda CC</label>
          <input type="number" name="demanda_cc" value="${
            ponto.demanda_cc || 0
          }" 
            style="width:100%; padding:6px; border-radius:6px; border:1px solid #ccc;">
        </div>
        <div style="flex:1">
          <label style="display:block; font-weight:600; color:#444;">Demanda C1</label>
          <input type="number" name="demanda_c1" value="${
            ponto.demanda_c1 || 0
          }" 
            style="width:100%; padding:6px; border-radius:6px; border:1px solid #ccc;">
        </div>
      </div>
      <div style="margin-bottom:12px;">
        <label style="display:block; font-weight:600; color:#444;">Cidade</label>
        <input type="text" name="nm_mun" value="${ponto.nm_mun || ""}" 
          style="width:100%; padding:6px; border-radius:6px; border:1px solid #ccc;">
      </div>
      <button type="submit"
          id="btn-submit-${ponto.id}"
          ${isAdmin ? "" : "disabled"}
          style="
          width:100%;
          background:${isAdmin ? "#1976d2" : "#ccc"};
          color:white;
          font-weight:bold;
          border:none;
          border-radius:6px;
          padding:10px;
          cursor:${isAdmin ? "pointer" : "not-allowed"};
          font-size:15px;
          margin-top:8px;">
          Salvar
        </button>
      </form>
  `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);

        if (isAdmin) {
          setTimeout(() => {
            const form = document.getElementById(`edit-ponto-${ponto.id}`);
            if (form) {
              form.onsubmit = (e) => {
                e.preventDefault();
                const fd = new FormData(form as HTMLFormElement);

                // Gera objeto com os dados do form
                const update: any = {};
                fd.forEach((val, key) => (update[key] = val));

                // Atualiza no banco usando o Firestore ID
                afd
                  .collection("pontoSecao")
                  .doc(ponto.id) // Use sempre o id do doc, não campo "id"
                  .update(update)
                  .then(() => {
                    alert("Atualizado com sucesso!");
                    Object.assign(ponto, update); // Atualiza objeto local
                    infoWindow.close();
                  })
                  .catch(() => alert("Erro ao atualizar!"));
              };
            }
          }, 200);
        }
      });

      MapUtil.pontosSecaoMarkers.push(marker);
    });
  }

  showAcidentes(acidentes: any[], map: any) {
    acidentes.forEach((acidente) => {
      const marker = new google.maps.Marker({
        position: { lat: acidente.lat, lng: acidente.lng },
        map,
        title: acidente.title || acidente.name,
        icon: {
          url: "assets/icon/acidente.png",
          scaledSize: new google.maps.Size(40, 50),
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
        <div style="max-width: 250px">
          <strong>${acidente.title || "Acidente"}</strong><br>
          Tipo: ${acidente.name}<br>
          Rodovia: ${acidente.rodovia}<br>
          Km: ${acidente.km}<br>
          Sentido: ${acidente.sentido || "-"}<br>
          Data: ${acidente.data || "-"}<br>
          Hora: ${acidente.hora || "-"}<br>
          ${acidente.descricao ? `<em>${acidente.descricao}</em>` : ""}
        </div>
      `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      MapUtil.acidentesMarkers.push(marker);
    });
  }

  public addPolyline(
    rota: Position[],
    map,
    lineColor = "#FF4941",
    tipo,
    info = {
      id_gen: "",
      preco_m2_regiao: "",
      recomendacao: "",
      est_prox: "",
      i_priorizacao: "",
      name: "",
      tipo_ocup: "",
      bairro: "",
      endereco_cons: "",
      endereco_forn: "",
      area_cons: "",
      area_tot: "",
      lat_cons: 0,
      lon_cons: 0,
    }
  ) {
    let polyline;
    if (rota && rota.length > 0) {
      const idxMeio = Math.floor(rota.length / 2);
      const rotaMeio = rota[idxMeio];
      const latlngCenter = { lat: rotaMeio.lat, lng: rotaMeio.lng };

      let stroke = 1;

      if (tipo === "imovel") {
        stroke = 1;
      } else if (tipo === "linha") {
        stroke = 3;
      } else if (tipo === "estacao") {
        stroke = 6;
      }

      for (let i = 0; i < rota.length; i++) {
        const _current = rota[i];

        const polylineOpt = {
          path: rota,
          geodesic: tipo === "bufferLinha" ? false : true,
          strokeColor: lineColor,
          strokeOpacity:
            tipo === "bufferEstacao" ? 0 : tipo === "bufferLinha" ? 0 : 1.0,
          strokeWeight: tipo === "bufferLinha" ? 0 : 0,
          fillColor: lineColor,
          fillOpacity: tipo === "bufferLinha" ? 0.01 : 0.01,
          zIndex: tipo === "bufferEstacao" ? 3 : tipo === "bufferLinha" ? 1 : 3,
        };

        polyline = new google.maps.Polyline(polylineOpt);

        if (tipo === "linha") {
          polyline = new google.maps.Polyline(polylineOpt);
          polyline.setMap(map);
          this.addInfoWindow(
            polyline,
            "Linha: " + info.name,
            map,
            new google.maps.InfoWindow()
          );
          MapUtil2.polylines.push(polyline);
        } else if (tipo === "imovel") {
          const polygon = new google.maps.Polygon(polylineOpt);
          polygon.setMap(map);
          const conteudo = `Endereço: ${info.endereco_forn}<br/> Bairro: ${info.bairro}<br/>Tipo de ocupação: ${info.tipo_ocup}<br/>Área construída: ${info.area_cons}m²<br/>Área total: ${info.area_tot}m²`;
          this.addInfoWindow(
            polygon,
            conteudo,
            map,
            new google.maps.InfoWindow()
          );
          MapUtil2.polygons.push(polygon);
        } else if (tipo === "estacao") {
          polyline = new google.maps.Polyline(polylineOpt);
          polyline.setMap(map);
          MapUtil2.polylines.push(polyline);
        } else if (tipo === "bufferEstacao") {
          const polygon = new google.maps.Polygon(polylineOpt);
          polygon.setMap(map);
          const conteudo = `Buffer da estação: ${info.name}`;
          this.addInfoWindow(
            polygon,
            conteudo,
            map,
            new google.maps.InfoWindow()
          );
          MapUtil2.polygons.push(polygon);
        } else if (tipo === "bufferLinha") {
          const polygon = new google.maps.Polygon(polylineOpt);
          polygon.setMap(map);
          const conteudo = `Buffer da linha: ${info.name}`;
          this.addInfoWindow(
            polygon,
            conteudo,
            map,
            new google.maps.InfoWindow()
          );
          MapUtil2.polygons.push(polygon);
        }
      }
    }
  }

  public addBufferLinha(
    rota: Position[],
    map,
    cor,
    strokeColor,
    info: {
      name: "";
    }
  ) {
    console.log("rota buffer linha", rota, cor, info);

    if (rota && rota.length > 0) {
      console.log("bufferLinha");

      const options = {
        path: rota,
        geodesic: true,
        strokeColor: strokeColor,
        strokeOpacity: 0,
        strokeWeight: 0,
        fillColor: cor,
        fillOpacity: 0.3,
        zIndex: 1,
      };

      const polygon = new google.maps.Polygon(options);
      polygon.setMap(map);
      const conteudo = `Buffer da linha: ${info.name}`;
      this.addInfoWindow(polygon, conteudo, map, new google.maps.InfoWindow());
      MapUtil2.polygons.push(polygon);
    }
  }
  public addBufferEstacao(
    rota: Position[],
    map,
    cor,
    info: {
      name: "";
    }
  ) {
    if (rota && rota.length > 0) {
      const options = {
        path: rota,
        geodesic: true,
        strokeColor: cor,
        strokeOpacity: 0.0,
        strokeWeight: 0.0,
        fillColor: cor,
        fillOpacity: 0.2,
        zIndex: 2,
      };

      const polygon = new google.maps.Polygon(options);
      polygon.setMap(map);
      const conteudo = `Buffer da estação: ${info.name}`;
      this.addInfoWindow(polygon, conteudo, map, new google.maps.InfoWindow());
      MapUtil2.polygons.push(polygon);
    }
  }

  public addAreaCaminhavel(
    rota: Position[],
    map,
    cor,
    info: {
      name: "";
    }
  ) {
    if (rota && rota.length > 0) {
      const options = {
        path: rota,
        geodesic: true,
        strokeColor: cor,
        strokeOpacity: 0.0,
        strokeWeight: 0.0,
        fillColor: cor,
        fillOpacity: 0.2,
        zIndex: 2,
      };

      const polygon = new google.maps.Polygon(options);
      polygon.setMap(map);
      const conteudo = `Área caminhável`;
      this.addInfoWindow(polygon, conteudo, map, new google.maps.InfoWindow());
      MapUtil2.polygons.push(polygon);
    }
  }

  public addEstacao(rota, map) {
    let marker;

    if (rota && rota.length > 0) {
      for (let i = 0; i < rota.length; i++) {
        marker = new google.maps.Marker({
          position: { lat: rota[i].lat, lng: rota[i].lng },
          title: rota[i]["name"],
          icon: new google.maps.MarkerImage(
            "assets/icon/" + "noun-metro-station.svg"
          ),
        });

        this.addInfoWindow(
          marker,
          "Nome da estação: " + rota[i].name,
          map,
          new google.maps.InfoWindow()
        );
        marker.setMap(map);
        MapUtil2.polylines.push(marker);
      }
    }
  }

  addLinha(polylinePath, map, color, element, afd, isAdmin: boolean) {
    const polyline = new google.maps.Polyline({
      path: polylinePath,
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });

    (polyline as any).ROUTE_ID = element.ROUTE_ID || element.id;
    (polyline as any).LIGACAO = element.LIGACAO || "";
    polyline.setMap(map);

    // Use id único seguro
    const id = element.id || element.ROUTE_ID;
    const formId = `edit-rota-${id}`;
    const campos = [
      { label: "ID da Rota", name: "ROUTE_ID", type: "text" },
      { label: "Origem", name: "ORIGEM", type: "text" },
      { label: "Destino", name: "DESTINO", type: "text" },
      { label: "Ligação", name: "LIGACAO", type: "text" },
      { label: "Sentido da Viagem", name: "SENTIDO", type: "text" },
      { label: "ID SISTRANS", name: "ROTA_ID_SI", type: "text" },
      { label: "Ativa no Cenário Calibração", name: "TNW_CC", type: "number" },
      { label: "Ativa no Cenário Integrado", name: "TNW_C1", type: "number" },
      {
        label: "Nº Viagens Calibração (Cenário Atual)",
        name: "NV_DU_CC",
        type: "number",
      },
      {
        label: "Nº Viagens Integrado (Mais Integrado)",
        name: "NV_DU_C1",
        type: "number",
      },
      {
        label: "Tempo entre viagens (min) - Atual",
        name: "HEADWAY_CC",
        type: "number",
      },
      {
        label: "Tempo entre viagens (min) - Integrado",
        name: "HEADWAY_C1",
        type: "number",
      },
      {
        label: "Tarifa Cheia (Cenário Atual)",
        name: "TARIFA_CHE",
        type: "number",
      },
      { label: "Hierarquia", name: "HIERARQUIA", type: "text" },
      { label: "Proposta (Mais Integrado)", name: "PROPOSTA_1", type: "text" },
      { label: "Proposta (Menos Integrado)", name: "PROPOSTA_2", type: "text" },
      { label: "ID de Redimensionamento", name: "ID_DIMEN", type: "text" },
      { label: "Nº de Seções", name: "N_SECOES", type: "number" },
      {
        label: "Demanda Estimada (DEMANDA_CC)",
        name: "DEMANDA_CC",
        type: "number",
      },
      {
        label: "Demanda Estimada (DEMANDA_C1)",
        name: "DEMANDA_C1",
        type: "number",
      },
      { label: "Extensão da Rota (km)", name: "EXT_KM", type: "number" },
    ];

    // Popup com formulário
    let contentString = `
  <form id="${formId}" style="max-width:370px; padding:18px 14px; font-family:inherit; background:#fff;">
    <h3 style="margin:0 0 18px 0; font-size:20px; color:#1976d2; font-weight:700; letter-spacing:.02em;">
      Editar Rota <span style="font-weight:400;">#${
        element.ROUTE_ID || ""
      }</span>
    </h3>
    
    <!-- Grupo: Identificação -->
    <fieldset style="border:none; margin-bottom:16px; padding:0;">
      <legend style="font-size:15px; font-weight:600; color:#444; margin-bottom:8px;">Identificação</legend>
      
      <div style="margin-bottom:10px;">
        <label style="font-weight:500;">Código da Rota</label>
        <input type="text" name="ROUTE_ID" value="${
          element.ROUTE_ID || ""
        }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
      </div>
      <div style="margin-bottom:10px;">
        <label style="font-weight:500;">Código SISTRANS</label>
        <input type="text" name="ROTA_ID_SI" value="${
          element.ROTA_ID_SI || ""
        }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
      </div>
      <div style="margin-bottom:10px;">
        <label style="font-weight:500;">Nome da Ligação</label>
        <input type="text" name="LIGACAO" value="${
          element.LIGACAO || ""
        }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
      </div>
      <div style="display:flex; gap:12px; margin-bottom:10px;">
        <div style="flex:1;">
          <label style="font-weight:500;">Origem</label>
          <input type="text" name="ORIGEM" value="${
            element.ORIGEM || ""
          }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
        </div>
        <div style="flex:1;">
          <label style="font-weight:500;">Destino</label>
          <input type="text" name="DESTINO" value="${
            element.DESTINO || ""
          }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
        </div>
      </div>
      <div style="margin-bottom:6px;">
        <label style="font-weight:500;">Sentido</label>
        <input type="text" name="SENTIDO" value="${
          element.SENTIDO || ""
        }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
      </div>
    </fieldset>

    <!-- Grupo: Características Gerais -->
    <fieldset style="border:none; margin-bottom:16px; padding:0;">
      <legend style="font-size:15px; font-weight:600; color:#444; margin-bottom:8px;">Características Gerais</legend>
      <div style="display:flex; gap:12px; margin-bottom:10px;">
        <div style="flex:1;">
          <label style="font-weight:500;">Extensão (km)</label>
          <input type="number" step="any" name="EXT_KM" value="${
            element.EXT_KM || ""
          }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
        </div>
        <div style="flex:1;">
          <label style="font-weight:500;">Nº de Seções</label>
          <input type="number" name="N_SECOES" value="${
            element.N_SECOES || ""
          }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
        </div>
      </div>
      <div style="display:flex; gap:12px;">
        <div style="flex:1;">
          <label style="font-weight:500;">Classificação</label>
          <input type="text" name="HIERARQUIA" value="${
            element.HIERARQUIA || ""
          }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
        </div>
        <div style="flex:1;">
          <label style="font-weight:500;">Código Redimensionamento</label>
          <input type="text" name="ID_DIMEN" value="${
            element.ID_DIMEN || ""
          }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
        </div>
      </div>
    </fieldset>

    <!-- Grupo: Cenário Atual -->
    <fieldset style="border:none; margin-bottom:16px; padding:0;">
      <legend style="font-size:15px; font-weight:600; color:#444; margin-bottom:8px;">Cenário Atual</legend>
      <div style="display:flex; gap:12px; margin-bottom:10px;">
        <div style="flex:1;">
          <label style="font-weight:500;">Ativa?</label>
          <input type="number" name="TNW_CC" value="${
            element.TNW_CC || ""
          }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
        </div>
        <div style="flex:1;">
          <label style="font-weight:500;">Viagens/dia</label>
          <input type="number" name="NV_DU_CC" value="${
            element.NV_DU_CC || ""
          }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
        </div>
      </div>
      <div style="display:flex; gap:12px; margin-bottom:10px;">
        <div style="flex:1;">
          <label style="font-weight:500;">Intervalo (min)</label>
          <input type="number" name="HEADWAY_CC" value="${
            element.HEADWAY_CC || ""
          }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
        </div>
        <div style="flex:1;">
          <label style="font-weight:500;">Demanda Estimada</label>
          <input type="number" name="DEMANDA_CC" value="${
            element.DEMANDA_CC || ""
          }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
        </div>
      </div>
      <div style="margin-bottom:10px;">
        <label style="font-weight:500;">Tarifa (R$)</label>
        <input type="number" name="TARIFA_CHE" value="${
          element.TARIFA_CHE || ""
        }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
      </div>
    </fieldset>

    <!-- Grupo: Cenário Mais Integrado -->
    <fieldset style="border:none; margin-bottom:16px; padding:0;">
      <legend style="font-size:15px; font-weight:600; color:#444; margin-bottom:8px;">Cenário Mais Integrado</legend>
      <div style="display:flex; gap:12px; margin-bottom:10px;">
        <div style="flex:1;">
          <label style="font-weight:500;">Ativa?</label>
          <input type="number" name="TNW_C1" value="${
            element.TNW_C1 || ""
          }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
        </div>
        <div style="flex:1;">
          <label style="font-weight:500;">Viagens/dia</label>
          <input type="number" name="NV_DU_C1" value="${
            element.NV_DU_C1 || ""
          }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
        </div>
      </div>
      <div style="display:flex; gap:12px;">
        <div style="flex:1;">
          <label style="font-weight:500;">Intervalo (min)</label>
          <input type="number" name="HEADWAY_C1" value="${
            element.HEADWAY_C1 || ""
          }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
        </div>
        <div style="flex:1;">
          <label style="font-weight:500;">Demanda Estimada</label>
          <input type="number" name="DEMANDA_C1" value="${
            element.DEMANDA_C1 || ""
          }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
        </div>
      </div>
    </fieldset>

    <!-- Grupo: Propostas -->
    <fieldset style="border:none; margin-bottom:12px; padding:0;">
      <legend style="font-size:15px; font-weight:600; color:#444; margin-bottom:8px;">Propostas de Racionalização</legend>
      <div style="display:flex; gap:12px;">
        <div style="flex:1;">
          <label style="font-weight:500;">Mais Integrado</label>
          <input type="text" name="PROPOSTA_1" value="${
            element.PROPOSTA_1 || ""
          }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
        </div>
        <div style="flex:1;">
          <label style="font-weight:500;">Menos Integrado</label>
          <input type="text" name="PROPOSTA_2" value="${
            element.PROPOSTA_2 || ""
          }" style="width:100%; padding:7px 8px; border-radius:6px; border:1px solid #ccc;">
        </div>
      </div>
    </fieldset>

    <button type="submit" 
    id="btn-submit-rota-${id}"
    ${isAdmin ? "" : "disabled"}
    style="
      width:100%;
       background:${isAdmin ? "#1976d2" : "#ccc"};
      color:white;
      font-weight:600;
      border:none;
      border-radius:6px;
      padding:11px 0;
       cursor:${isAdmin ? "pointer" : "not-allowed"};
      font-size:16px;
      margin-top:14px;
      letter-spacing:.04em;
      box-shadow:0 1px 3px rgba(0,0,0,0.09);
    ">Salvar</button>
  </form>
`;

    const infoWindow = new google.maps.InfoWindow({
      content: contentString,
    });

    polyline.setMap(map);

    polyline.addListener("click", (event) => {
      infoWindow.setContent(contentString); // importante: reseta conteúdo!
      infoWindow.setPosition(event.latLng);
      infoWindow.open(map);
      const latLng = event.latLng;
      this.handlePolylineClick(latLng, this.map, afd);

      if (isAdmin) {
        setTimeout(() => {
          const form = document.getElementById(formId) as HTMLFormElement;
          if (form) {
            form.onsubmit = (e) => {
              e.preventDefault();
              const fd = new FormData(form);
              const update: any = {};
              fd.forEach((val, key) => (update[key] = val));

              afd
                .collection("rotas")
                .doc(id)
                .update(update)
                .then(() => {
                  alert("Atualizado com sucesso!");
                  Object.assign(element, update);
                  infoWindow.close();
                })
                .catch(() => alert("Erro ao atualizar!"));
            };
          }
        }, 200);
      }
    });

    MapUtil.rotaPolylines.push(polyline);
  }

  public addImovel(
    rota: Position[],
    map,
    cor,
    info = {
      id_gen: "",
      preco_m2_regiao: "",
      recomendacao: "",
      est_prox: "",
      i_priorizacao: "",
      name: "",
      tipo_ocup: "",
      bairro: "",
      endereco_cons: "",
      endereco_forn: "",
      area_cons: "",
      area_tot: "",
      lat_cons: 0,
      lon_cons: 0,
      link: "",
      cabas: "",
      camax: "",
      potencial_add: "",
      comp_emb: "",
      perc_valoriza: "",
    }
  ) {
    if (rota && rota.length > 0) {
      // for(let i = 0; i < rota.length; i++) {

      const options = {
        path: rota,
        geodesic: true,
        strokeColor: cor,
        strokeOpacity: 1.0,
        strokeWeight: 1.0,
        fillColor: cor,
        fillOpacity: 0.7,
        zIndex: 4,
      };

      const polyline = new google.maps.Polyline(
        this.createPolylineBall({ lat: info.lat_cons, lng: info.lon_cons }, cor)
      );
      const polygon = new google.maps.Polygon(options);
      polygon.setMap(map);
      polyline.setMap(map);
      let conteudo;
      if (info.link === "")
        conteudo = `ID_GEN: ${info.id_gen}<br/>Endereço: ${info.endereco_cons}<br/>Bairro: ${info.bairro}<br/>Estação mais próxima: ${info.est_prox}<br/>Área total: ${info.area_tot}m²<br/>Valor m²: R$${info.preco_m2_regiao}<br/>CA básico: ${info.cabas}<br/>CA máximo: ${info.camax}<br/>Potencial adicional: ${info.potencial_add}<br/>Complexidade dos embaraços: ${info.comp_emb}<br/>Potencial de valorização percentual: ${info.perc_valoriza}<br/>Vocação: ${info.recomendacao}<br/>Ficha resumo: Não possui`;
      else
        conteudo = `ID_GEN: ${info.id_gen}<br/>Endereço: ${info.endereco_cons}<br/>Bairro: ${info.bairro}<br/>Estação mais próxima: ${info.est_prox}<br/>Área total: ${info.area_tot}m²<br/>Valor m²: R$${info.preco_m2_regiao}<br/>CA básico: ${info.cabas}<br/>CA máximo: ${info.camax}<br/>Potencial adicional: ${info.potencial_add}<br/>Complexidade dos embaraços: ${info.comp_emb}<br/>Potencial de valorização percentual: ${info.perc_valoriza}<br/>Vocação: ${info.recomendacao}<br/>Ficha resumo: <a href=${info.link} target="_blank">Link</a>`;
      this.addInfoWindow(polygon, conteudo, map, new google.maps.InfoWindow());
      MapUtil2.polygons.push(polygon);
      MapUtil2.polylines.push(polyline);

      // }
    }
  }

  public showLevantamentoPoints(route: any, map, levantamentoId) {
    let itemArr: any[] = route.map((item) => item.values);
    let polyline;

    const latArrOk = itemArr.filter((item) => item.lat !== 0.0);
    const hasPoints = latArrOk.length > 0;
    if (itemArr.length > 0 && hasPoints) {
      let indexCenter = (itemArr.length / 2) | 0;

      map.setCenter({
        lat: itemArr[indexCenter].lat,
        lng: itemArr[indexCenter].lng,
      });

      for (let i = 0; i < itemArr.length; i++) {
        polyline = new google.maps.Polyline(
          this.createPolylineOptions(itemArr[i])
        );
        polyline.setMap(map);
        MapUtil2.polylines.push(polyline);

        let infowindow = new google.maps.InfoWindow({
          content: this.createInfoWindowLevantamento(
            itemArr[i],
            levantamentoId
          ),
        });

        google.maps.event.addListener(polyline, "click", (event) => {
          infowindow.setPosition(event.latLng);
          infowindow.open(map);
          MapUtil2.infoWindows.push(infowindow);

          if (MapUtil2.infoWindows.length > 1) {
            MapUtil2.infoWindows.forEach((value, index, arr) => {
              if (value != infowindow) {
                value.close();
                MapUtil2.infoWindows.splice(index, 1);
              }
            });
          }
        });
      }

      let markerBegin = new google.maps.Marker({
        position: { lat: itemArr[0].lat, lng: itemArr[0].lng },
        title: "Início do Levantamento",
        // label: 'I',
        icon: new google.maps.MarkerImage("assets/icon/marker-green.png"),
      });

      let markerLast = new google.maps.Marker({
        position: {
          lat: itemArr[itemArr.length - 1].lat,
          lng: itemArr[itemArr.length - 1].lng,
        },
        title: "Fim do Levantamento",
        icon: new google.maps.MarkerImage("assets/icon/marker-red.png"),
      });
    }
  }

  public pinSymbol(color) {
    return {
      path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
      fillColor: color,
      fillOpacity: 1,
      strokeColor: "#000",
      strokeWeight: 2,
      scale: 2,
    };
  }

  public createPolylineOptions(item: any) {
    let cor = "#2E5C1F";

    if (item.buracosUser.length >= 5 || item.remendosUser.length >= 5) {
      cor = "#B33235";
    } else if (item.buracosUser.length >= 3 || item.remendosUser.length >= 3) {
      cor = "#A4A437";
    } else if (item.buracosUser.length >= 1 || item.remendosUser.length >= 1) {
      cor = "#66CC80";
    }

    return {
      path: [
        { lat: item.lat, lng: item.lng },
        { lat: item.lat, lng: item.lng },
      ],
      geodesic: true,
      strokeColor: cor,
      strokeOpacity: 1,
      strokeWeight: 10,
    };
  }

  public createPolylineBall(item, cor = "#2E5C1F") {
    return {
      path: [
        { lat: item.lat, lng: item.lng },
        { lat: item.lat, lng: item.lng },
      ],
      geodesic: true,
      strokeColor: cor,
      strokeOpacity: 0.95,
      strokeWeight: 8,
      zIndex: 3,
    };
  }

  public createPolylineOptionsGeneric(item: any) {
    let cor = "#2E5C1F";

    return {
      path: [
        { lat: item.lat, lng: item.lng },
        { lat: item.lat, lng: item.lng },
      ],
      geodesic: true,
      strokeColor: cor,
      strokeOpacity: 1,
      strokeWeight: 10,
    };
  }

  private createInfoWindowLevantamento(item: any, levantamentoId: string) {
    const lavantamentoId = levantamentoId;
    const keyTrack = item.id;
    const name = item.path;
    const lat = DateUtil.getNumberFormatted(item.lat, 6);
    const lng = DateUtil.getNumberFormatted(item.lng, 6);
    const distance = DateUtil.getNumberFormatted(item.distance, 2);
    const qtdRemendos = item.remendosUser.length + "";
    const qtdBuracos = item.buracosUser.length + "";
    const timeProcess = DateUtil.getNumberFormatted(item.timeInMilis, 2);
    const pathImage = item.pathImage;

    let div = document.createElement("div");
    div.className = "gm-style gm-style-iw";
    div.style.minWidth = "220px";
    div.id = "content";

    let h1 = document.createElement("h1");
    h1.className = "firstHeading";
    h1.id = "firstHeading";
    h1.innerText = "Informações";

    let divBody = document.createElement("div");
    divBody.id = "bodyContent";

    let p1 = document.createElement("p");
    p1.innerText = "Imagem: " + name;
    p1.style.cssText = "font-weight: bold";

    let p2 = document.createElement("p");
    p2.innerText = "Distância: " + distance + " m";
    p2.style.cssText = "font-weight: bold";

    let p3 = document.createElement("p");
    p3.innerText = "Remendos: " + qtdRemendos;
    p3.style.cssText = "font-weight: bold";

    let p4 = document.createElement("p");
    p4.innerText = "Buracos: " + qtdBuracos;
    p4.style.cssText = "font-weight: bold";

    let p5 = document.createElement("p");
    p5.innerText = "Processamento: " + timeProcess + " ms";
    p5.style.cssText = "font-weight: bold";

    let buttonImagens = document.createElement("button");
    buttonImagens.className = "btn-infowindow";
    buttonImagens.innerText = "Imagens";

    buttonImagens.addEventListener("click", () => {
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("levantamentoId", levantamentoId);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("key", keyTrack);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("name", name);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("lat", lat);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("lng", lng);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("distance", distance);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("qtdRemendos", qtdRemendos);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("qtdBuracos", qtdBuracos);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("timeProcess", timeProcess);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("pathImage", pathImage);
      document.getElementById("btn-show-estacionar-page").click();
    });

    div.appendChild(h1);

    divBody.appendChild(p1);
    divBody.appendChild(buttonImagens);

    div.appendChild(divBody);

    return div;
  }

  private createInfoWindowExame(item: any) {
    let lat;
    let lng;
    let area;
    let ce;
    let key;

    if (item.lat) {
      lat = DateUtil.getNumberFormatted(item.lat, 6);
    }
    if (item.lng) {
      lng = DateUtil.getNumberFormatted(item.lng, 6);
    }
    if (item.area) {
      area = DateUtil.getNumberFormatted(item.area, 0);
    }

    key = item.id;
    ce = item.municipio;

    let div = document.createElement("div");
    div.className = "gm-style gm-style-iw";
    div.style.minWidth = "220px";
    div.id = "content";

    let h1 = document.createElement("h1");
    h1.className = "firstHeading";
    h1.id = "firstHeading";
    h1.innerText = "Informações";

    let divBody = document.createElement("div");
    divBody.id = "bodyContent";

    let p1 = document.createElement("p");
    p1.innerText = "Munícipo: " + ce;
    p1.style.cssText = "font-weight: bold";

    let p2 = document.createElement("p");
    p2.innerText = "Área: " + area + " m²";
    p2.style.cssText = "font-weight: bold";

    let buttonImagens = document.createElement("button");
    buttonImagens.className = "btn-infowindow";
    buttonImagens.innerText = "Imagens";

    buttonImagens.addEventListener("click", () => {
      document
        .getElementById("btn-show-estacionar-page-2")
        .setAttribute("key", key);
      document
        .getElementById("btn-show-estacionar-page-2")
        .setAttribute("name", ce);
      document
        .getElementById("btn-show-estacionar-page-2")
        .setAttribute("lat", lat);
      document
        .getElementById("btn-show-estacionar-page-2")
        .setAttribute("lng", lng);
      document
        .getElementById("btn-show-estacionar-page-2")
        .setAttribute("distance", area);
      document
        .getElementById("btn-show-estacionar-page-2")
        .setAttribute("sre_inic", "");
      document
        .getElementById("btn-show-estacionar-page-2")
        .setAttribute("sre_fim", "");
      document
        .getElementById("btn-show-estacionar-page-2")
        .setAttribute("sre_sit", "");
      document
        .getElementById("btn-show-estacionar-page-2")
        .setAttribute("ce", ce);
      document
        .getElementById("btn-show-estacionar-page-2")
        .setAttribute("rodovia", item.photo);
      document
        .getElementById("btn-show-estacionar-page-2")
        .setAttribute("sre", "");
      document.getElementById("btn-show-estacionar-page-2").click();
    });

    div.appendChild(h1);
    divBody.appendChild(p1);
    divBody.appendChild(p2);
    divBody.appendChild(buttonImagens);

    div.appendChild(divBody);

    return div;
  }

  private createInfoWindowFE(item: any, showBtnImages = true) {
    let lat;
    let lng;

    const keyTrack = item.id;
    const name = item.name;
    const rodovia = item.ce;

    if (item.lat) {
      lat = DateUtil.getNumberFormatted(item.lat, 6);
    }
    if (item.lng) {
      lng = DateUtil.getNumberFormatted(item.lng, 6);
    }

    let local = item.local + " - " + item.cidade;
    let data_de_homologacao = item.data_de_homologacao;
    let sentido = item.sentido;
    let slte = item.site;
    let status_slte = "Status: " + item.status_site;
    let tipo_equipamento = item.tipo_equipamento;

    let div = document.createElement("div");
    div.className = "gm-style gm-style-iw";
    div.style.minWidth = "220px";
    div.id = "content";

    let h1 = document.createElement("h1");
    h1.className = "firstHeading";
    h1.id = "firstHeading";
    h1.innerText = "Informações";

    let divBody = document.createElement("div");
    divBody.id = "bodyContent";

    let p1 = document.createElement("p");
    p1.innerText = item.name ? "Imagem: " + name : "";
    p1.style.cssText = "font-weight: bold";

    let p2 = document.createElement("p");
    p2.innerText = local;
    p2.style.cssText = "font-weight: bold";

    let p3 = document.createElement("p");
    p3.innerText = "";
    p3.style.cssText = "font-weight: bold";

    let p4 = document.createElement("p");
    p4.innerText = sentido;
    p4.style.cssText = "font-weight: bold";

    let p5 = document.createElement("p");
    p5.innerText = status_slte;
    p5.style.cssText = "font-weight: bold";

    let p6 = document.createElement("p");
    p6.innerText = "Homologado em: " + data_de_homologacao;
    p6.style.cssText = "font-weight: bold";

    let buttonImagens = document.createElement("button");
    buttonImagens.className = "btn-infowindow";
    buttonImagens.innerText = "Imagens";

    buttonImagens.addEventListener("click", () => {
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("key", keyTrack);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("name", name);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("lat", lat);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("lng", lng);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("rodovia", rodovia);
      document.getElementById("btn-show-estacionar-page").click();
    });

    div.appendChild(h1);

    divBody.appendChild(p1);
    divBody.appendChild(p2);
    divBody.appendChild(p3);
    divBody.appendChild(p4);
    divBody.appendChild(p5);
    divBody.appendChild(p6);

    if (showBtnImages) {
      divBody.appendChild(buttonImagens);
    }

    div.appendChild(divBody);

    return div;
  }

  private createInfoWindowFD(item: any, showBtnImages = true) {
    let lat;
    let lng;

    if (item.lat) {
      lat = DateUtil.getNumberFormatted(item.lat, 6);
    }
    if (item.lng) {
      lng = DateUtil.getNumberFormatted(item.lng, 6);
    }

    let distance = DateUtil.getNumberFormatted(item.dist, 2);
    let sre = item.sre;
    let tipo = item.tipo;
    let title = item.title;

    let div = document.createElement("div");
    div.className = "gm-style gm-style-iw";
    div.style.minWidth = "220px";
    div.id = "content";

    let h1 = document.createElement("h1");
    h1.className = "firstHeading";
    h1.id = "firstHeading";
    h1.innerText = "Informações";

    let divBody = document.createElement("div");
    divBody.id = "bodyContent";

    let p1 = document.createElement("p");
    p1.innerText = title;
    p1.style.cssText = "font-weight: bold";

    let p2 = document.createElement("p");
    p2.innerText = "Distância: " + distance + "";
    p2.style.cssText = "font-weight: bold";

    let p3 = document.createElement("p");
    p3.innerText = "SRE: " + sre;
    p3.style.cssText = "font-weight: bold";

    let p4 = document.createElement("p");
    p4.innerText = "Tipo: " + tipo;
    p4.style.cssText = "font-weight: bold";

    let p5 = document.createElement("p");
    p5.innerText = "";
    p5.style.cssText = "font-weight: bold";

    let p6 = document.createElement("p");
    p6.innerText = "";
    p6.style.cssText = "font-weight: bold";

    let buttonImagens = document.createElement("button");
    buttonImagens.className = "btn-infowindow";
    buttonImagens.innerText = "Imagens";

    buttonImagens.addEventListener("click", () => {
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("lat", lat);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("lng", lng);
      document.getElementById("btn-show-estacionar-page").click();
    });

    div.appendChild(h1);

    divBody.appendChild(p1);
    divBody.appendChild(p2);
    divBody.appendChild(p3);
    divBody.appendChild(p4);
    divBody.appendChild(p5);
    divBody.appendChild(p6);

    if (showBtnImages) {
      divBody.appendChild(buttonImagens);
    }

    div.appendChild(divBody);

    return div;
  }

  private createInfoWindow(type, dados: any[], showBtnImages = true) {
    switch (type) {
      case "acidente":
        return this.createInfoWindowAcidente(dados, showBtnImages);
      default:
        break;
    }
  }

  private createInfoWindowAcidente(dados: any[], showBtnImages = true) {
    let div = document.createElement("div");
    div.className = "gm-style gm-style-iw";
    div.style.minWidth = "220px";
    div.id = "content";

    let h1 = document.createElement("h1");
    h1.className = "firstHeading";
    h1.id = "firstHeading";
    h1.innerText = "Informações";

    let divBody = document.createElement("div");
    divBody.id = "bodyContent";

    const pHtmlArr = dados
      .filter((_item) => _item.isVisible === true)
      .map((_item) => {
        let p1 = document.createElement("p");
        p1.innerText = _item.value;
        p1.style.cssText = "font-weight: bold";

        return p1;
      });

    let buttonImagens = document.createElement("button");
    buttonImagens.className = "btn-infowindow";
    buttonImagens.innerText = "Imagens";

    buttonImagens.addEventListener("click", () => {
      dados.forEach((_item) => {
        document
          .getElementById("btn-show-estacionar-page")
          .setAttribute(_item.key, _item.value);
      });

      document.getElementById("btn-show-estacionar-page").click();
    });

    div.appendChild(h1);
    pHtmlArr.forEach((_item) => divBody.appendChild(_item));

    if (showBtnImages) {
      divBody.appendChild(buttonImagens);
    }

    div.appendChild(divBody);

    return div;
  }

  private createInfoWindowGenerico(
    item: any,
    isAcidente,
    showBtnImages = true
  ) {
    let lat;
    let lng;
    let distance;

    let sre;
    let sre_inic;
    let sre_fim;
    let sre_sit;
    let sreText;
    let ce;
    let situacao;

    const keyTrack = item.id;
    const name = item.name;
    const rodovia = item.ce;

    if (item.lat) {
      lat = DateUtil.getNumberFormatted(item.lat, 6);
    }
    if (item.lng) {
      lng = DateUtil.getNumberFormatted(item.lng, 6);
    }
    if (item.km) {
      distance = DateUtil.getNumberFormatted(item.km, 2);
    }

    if (isAcidente) {
      ce = item.datahora + " - " + item.ce + " - " + item.municipio;
      sre_inic = item.quantidade + " vítimas" + " | " + item.classifica;
      sre_fim = item.tipo_acide;
      situacao = "";
      sreText = item.custo;
      sre = item.custo;
    } else {
      ce = item.ce + " - KM: " + distance;
      sre_inic = item.sre_inic ? "Início: " + item.sre_inic : "";
      sre_fim = item.sre_fim ? "Fim: " + item.sre_fim : "";
      situacao = item.situacao ? "Situação: " + item.situacao : "";
      sreText = "SRE: " + item.sre;
      sre = item.sre;
      sre_sit = item.sre_sit;
    }

    let div = document.createElement("div");
    div.className = "gm-style gm-style-iw";
    div.style.minWidth = "220px";
    div.id = "content";

    let h1 = document.createElement("h1");
    h1.className = "firstHeading";
    h1.id = "firstHeading";
    h1.innerText = "Informações";

    let divBody = document.createElement("div");
    divBody.id = "bodyContent";

    let p1 = document.createElement("p");
    p1.innerText = item.name ? "Imagem: " + name : "";
    p1.style.cssText = "font-weight: bold";

    let p2 = document.createElement("p");
    p2.innerText = ce;
    p2.style.cssText = "font-weight: bold";

    let p3 = document.createElement("p");
    p3.innerText = sre_inic;
    p3.style.cssText = "font-weight: bold";

    let p4 = document.createElement("p");
    p4.innerText = sre_fim;
    p4.style.cssText = "font-weight: bold";

    let p5 = document.createElement("p");
    p5.innerText = situacao;
    p5.style.cssText = "font-weight: bold";

    let p6 = document.createElement("p");
    p6.innerText = sreText;
    p6.style.cssText = "font-weight: bold";

    let buttonImagens = document.createElement("button");
    buttonImagens.className = "btn-infowindow";
    buttonImagens.innerText = "Imagens";

    buttonImagens.addEventListener("click", () => {
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("key", keyTrack);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("name", name);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("lat", lat);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("lng", lng);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("distance", distance);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("sre_inic", sre_inic);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("sre_fim", sre_fim);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("sre_sit", sre_sit);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("ce", ce);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("rodovia", rodovia);
      document
        .getElementById("btn-show-estacionar-page")
        .setAttribute("sre", sre);
      document.getElementById("btn-show-estacionar-page").click();
    });

    div.appendChild(h1);

    divBody.appendChild(p1);
    divBody.appendChild(p2);
    divBody.appendChild(p3);
    divBody.appendChild(p4);
    divBody.appendChild(p5);
    divBody.appendChild(p6);

    if (!isAcidente && showBtnImages) {
      divBody.appendChild(buttonImagens);
    }

    div.appendChild(divBody);

    return div;
  }

  public cleanPolylines() {
    for (let i = 0; i < MapUtil2.polylines.length; i++) {
      MapUtil2.polylines[i].setMap(null);
    }
  }

  public cleanPolygons() {
    for (let i = 0; i < MapUtil2.polygons.length; i++) {
      MapUtil2.polygons[i].setMap(null);
    }
  }

  public cleanMarkers() {
    MapUtil2.markers.forEach((value) => {
      value.setMap(null);
    });
  }

  public testCemK(map) {
    map.setCenter({ lat: 39.905963, lng: 116.390813 });
    map.setZoom(12);

    let arr = [];

    for (let index = 0; index < 100000; index++) {
      const _lat = 39.905963 + (Math.random() - Math.random()) * 3;
      const _lng = 116.390813 + (Math.random() - Math.random()) * 3;

      arr.push({ lat: _lat, lng: _lng });
    }

    arr.forEach((_item) => {
      const marker = new google.maps.Marker({
        position: _item,
        title: "Stan the T-Rex",
        icon: new google.maps.MarkerImage("assets/icon/marker-red.png"),
      });

      marker.setMap(map);

      let infowindow = new google.maps.InfoWindow({
        content: this.createInfoWindowGenerico(_item, false),
      });

      google.maps.event.addListener(marker, "click", (event) => {
        infowindow.setPosition(event.latLng);
        infowindow.open(map);
        MapUtil2.infoWindows.push(infowindow);

        if (MapUtil2.infoWindows.length > 1) {
          MapUtil2.infoWindows.forEach((value, index, arr) => {
            if (value != infowindow) {
              value.close();
              MapUtil2.infoWindows.splice(index, 1);
            }
          });
        }
      });
    });
  }
}
export class Rota {
  distance: number;
  time: number;
  instructions: string;
  path: Position[];
  position: Position;

  constructor();
  constructor(obj: any);
  constructor(obj?: any) {
    this.distance = (obj && obj.distance) || 0;
    this.time = (obj && obj.time) || 0;
    this.instructions = (obj && obj.instructions) || "";
    this.path = (obj && obj.path) || [];
    this.position = (obj && obj.position) || new Position();
  }
}

export class Position {
  lat: number;
  lng: number;

  constructor();
  constructor(obj: any);
  constructor(obj?: any) {
    this.lat = (obj && obj.lat) || 0.0;
    this.lng = (obj && obj.lng) || 0.0;
  }
}
