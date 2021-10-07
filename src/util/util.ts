export class Util {

    /**
     *  Retorna a distancia entre dois pontos 
     *  @param start Objecto contento a latitude e a longitude do ponto inicial
     *  @param end Objecto contendo a latitude e a longitude do ponto final
     *  @returns Distancia entre o ponto inicial e o ponto final em KM
     *  https://www.joshmorony.com/create-a-nearby-places-list-with-google-maps-in-ionic-2-part-2/
    */
   public static getDistanceBetweenPoints(startLat, startLng, endLat, endLng, units='km'): number {
    if (startLat != 0 && startLng != 0 && endLat != 0 && endLng != 0) {
        let earthRadius = {
            miles: 3958.8,
            km: 6371
        };

        let R = earthRadius[units || 'km'];
        let startLatitude = startLat;
        let startLongitude = startLng;
        let endLatitude = endLat;
        let endLongitude = endLng;

        let dLat = this.toRadiano((endLatitude - startLatitude));
        let dLon = this.toRadiano((endLongitude - startLongitude));
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadiano(startLatitude)) * Math.cos(this.toRadiano(endLatitude)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let distance = R * c;

        return distance;
    }

    return undefined;
  }

  /**
   *  Converte graus para Radiano
   * @param x numero a ser convertido para o Radiano
   * @returns numero de entrada em Radianos
   */
   private static toRadiano(x): number {
    return x * Math.PI / 180;
   }

}