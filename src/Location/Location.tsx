// // Locations.tsx – FINAL PERFECT VERSION (Weather + Search + KM)
// import React, { useEffect, useRef, useState } from "react";
// import GoogleMapReact from "google-map-react";
// import { Pi } from "lucide-react";
// // import { PiMapPinBold } from "react-icons/pi";

// /* ================= API KEYS ================= */
// const GOOGLE_API_KEY = "AIzaSyCfNC5MDzTJ3HADdmPr-Q0ZGNOeuLKPKnw";
// const WEATHER_API_KEY = "83c234ebc61449ce1225672c4cb575fc";

// /* ================= TYPES ================= */
// type Coords = {
//   lat: number;
//   lng: number;
// };

// type WeatherInfo = {
//   temp: number;
//   wind: number;
//   rain: number;
//   condition: string;
// };

// type RouteInfo = {
//   distanceKm: number;
//   duration: string;
// };

// /* ================= MARKER ================= */
// const Marker = ({ color }: { color: string }) => (
//   <Pi
//     style={{
//       color,
//       fontSize: "28px",
//       transform: "translate(-50%, -100%)",
//     }}
//   />
// );

// /* ================= MAIN ================= */
// const Location: React.FC = () => {
//   const mapRef = useRef<any>(null);
//   const mapsRef = useRef<any>(null);

//   const fromInputRef = useRef<HTMLInputElement>(null);
//   const toInputRef = useRef<HTMLInputElement>(null);

//   const [current, setCurrent] = useState<Coords | null>(null);
//   const [from, setFrom] = useState<Coords | null>(null);
//   const [to, setTo] = useState<Coords | null>(null);

//   const [weather, setWeather] = useState<WeatherInfo | null>(null);
//   const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

//   /* ================= GET CURRENT GPS ================= */
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const loc = {
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         };
//         setCurrent(loc);
//         setFrom(loc);
//         loadWeather(loc.lat, loc.lng);
//       },
//       () => alert("Please allow location permission"),
//       { enableHighAccuracy: true }
//     );
//   }, []);

//   /* ================= WEATHER ================= */
//   const loadWeather = async (lat: number, lng: number) => {
//     try {
//       const res = await fetch(
//         `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${WEATHER_API_KEY}`
//       );
//       const data = await res.json();

//       setWeather({
//         temp: Math.round(data.main.temp),
//         wind: Math.round(data.wind.speed),
//         rain: data.clouds?.all ?? 0,
//         condition: data.weather?.[0]?.main ?? "Clear",
//       });
//     } catch (err) {
//       console.error("Weather error", err);
//     }
//   };

//   /* ================= SEARCH (FROM & TO) ================= */
//   const initSearch = () => {
//     if (!mapsRef.current) return;

//     const fromAuto = new mapsRef.current.places.Autocomplete(
//       fromInputRef.current!
//     );
//     const toAuto = new mapsRef.current.places.Autocomplete(
//       toInputRef.current!
//     );

//     fromAuto.addListener("place_changed", () => {
//       const p = fromAuto.getPlace();
//       if (!p.geometry) return;

//       const loc = {
//         lat: p.geometry.location.lat(),
//         lng: p.geometry.location.lng(),
//       };

//       setFrom(loc);
//       loadWeather(loc.lat, loc.lng);
//     });

//     toAuto.addListener("place_changed", () => {
//       const p = toAuto.getPlace();
//       if (!p.geometry) return;

//       setTo({
//         lat: p.geometry.location.lat(),
//         lng: p.geometry.location.lng(),
//       });
//     });
//   };

//   /* ================= ROUTE + DISTANCE + TRAFFIC ================= */
//   useEffect(() => {
//     if (!from || !to || !mapRef.current || !mapsRef.current) return;

//     const service = new mapsRef.current.DirectionsService();
//     const renderer = new mapsRef.current.DirectionsRenderer({
//       suppressMarkers: true,
//       polylineOptions: {
//         strokeColor: "#0f766e",
//         strokeWeight: 5,
//       },
//     });

//     renderer.setMap(mapRef.current);

//     service.route(
//       {
//         origin: from,
//         destination: to,
//         travelMode: mapsRef.current.TravelMode.DRIVING,
//         drivingOptions: {
//           departureTime: new Date(),
//           trafficModel: "bestguess",
//         },
//       },
//       (res: any, status: string) => {
//         if (status === "OK") {
//           renderer.setDirections(res);

//           const leg = res.routes[0].legs[0];
//           setRouteInfo({
//             distanceKm: leg.distance.value / 1000,
//             duration: leg.duration_in_traffic?.text || leg.duration.text,
//           });
//         }
//       }
//     );

//     const trafficLayer = new mapsRef.current.TrafficLayer();
//     trafficLayer.setMap(mapRef.current);
//   }, [from, to]);

//   return (
//     <div className="space-y-4">
//       {/* SEARCH */}
//       <div className="flex justify-center gap-3">
//         <input
//           ref={fromInputRef}
//           placeholder="From location"
//           className="border px-3 py-2 rounded w-64"
//         />
//         <input
//           ref={toInputRef}
//           placeholder="To destination"
//           className="border px-3 py-2 rounded w-64"
//         />
//       </div>

//       {/* WEATHER */}
//       {weather && (
//         <div className="flex justify-center">
//           <div className="flex gap-6 bg-white px-5 py-3 rounded-xl shadow border text-sm">
//             <span>🌡 {weather.temp}°C</span>
//             <span>💨 Wind {weather.wind} km/h</span>
//             <span>🌧 Rain {weather.rain}%</span>
//             <span>☁ {weather.condition}</span>
//           </div>
//         </div>
//       )}

//       {/* DISTANCE */}
//       {routeInfo && (
//         <div className="text-center text-sm font-medium text-teal-700">
//           📏 Distance: {routeInfo.distanceKm.toFixed(2)} km | ⏱ Duration:{" "}
//           {routeInfo.duration}
//         </div>
//       )}

//       {/* MAP */}
//       <div style={{ height: "60vh", width: "100%" }}>
//         <GoogleMapReact
//           bootstrapURLKeys={{
//             key: GOOGLE_API_KEY,
//             libraries: ["places"],
//           }}
//           defaultCenter={current ?? { lat: 23.81, lng: 90.41 }}
//           defaultZoom={15}
//           yesIWantToUseGoogleMapApiInternals
//           onGoogleApiLoaded={({ map, maps }) => {
//             mapRef.current = map;
//             mapsRef.current = maps;
//             initSearch();
//           }}
//         >
//           {from && <Marker lat={from.lat} lng={from.lng} color="blue" />}
//           {to && <Marker lat={to.lat} lng={to.lng} color="red" />}
//         </GoogleMapReact>
//       </div>
//     </div>
//   );
// };

// export default Location;






const Location = () => {
    return (
        <div>
            This is Location page 
            
        </div>
    );
};

export default Location;