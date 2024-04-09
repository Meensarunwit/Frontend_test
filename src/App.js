import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { Icon } from 'leaflet';
import "./App.css";


const customIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/143/143960.png",
  iconSize: [20, 20]
});

const DataFetchingComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState(1); // เก็บชุดข้อมูลที่ถูกเลือก
  const datasets = Array.from({ length: 100 }, (_, index) => index + 1);
  // ตัวเลือกของชุดข้อมูล

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://v2k-dev.vallarismaps.com/core/api/features/1.1/collections/658cd4f88a4811f10a47cea7/items?api_key=bLNytlxTHZINWGt1GIRQBUaIlqz9X45XykLD83UkzIoN6PFgqbH7M7EDbsdgKVwC&limit=1000&offset=${(selectedDataset - 1) * 1000}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData.features);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDataset]);

  const handleDatasetChange = (e) => {
    setSelectedDataset(parseInt(e.target.value)); // เมื่อเลือกชุดข้อมูลใหม่ กำหนด selectedDataset ให้เป็นค่าที่เลือก
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>

      <div style={{ textAlign: 'center', fontSize: '50px', marginTop: '5px' }}><div className='Bebas'>Data GPS 100,000 Point</div></div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <select value={selectedDataset} onChange={handleDatasetChange}
          style={{
            width: '200px',
            height: '40px',
            fontSize: '15px',
            margin: 'auto',
            marginBottom: '10px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #ccc',
            borderRadius: '10px',
            color: '#333',

          }}
        >

          {datasets.map(dataset => (
            <option className='Quicksand' key={dataset} value={dataset}><div className='Quicksand'>Show Set Data {dataset}</div></option>
          ))}
        </select>
      </div>
      <MapContainer center={[16.474593576260084, 102.82206455659724]}
        zoom={5}
        style={{
          height: '400px',
          width: '80%',
          marginTop: '50px',
          margin: 'auto',
          border: '1px solid #ccc', // กำหนดเส้นขอบ
          borderRadius: '10px', // กำหนดรูปร่างของเส้นขอบ

        }}
      >
        <LayersControl position='topright'>
          <LayersControl.BaseLayer name='dark' checked>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name='Normal'>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name='Topo'>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {data.map((feature, index) => (
          <Marker key={index} position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]} icon={customIcon}>
            <div>
              <Popup>
                <div className='Quicksand'>
                  <h2>{feature.properties.ct_en}</h2>
                  <ul>
                    <li>{feature.properties.ct_tn}</li>
                    <li>Lat: {feature.geometry.coordinates[1]}</li>
                    <li>Lon: {feature.geometry.coordinates[0]}</li>
                  </ul>
                </div>
              </Popup>
            </div>
          </Marker>
        ))}
      </MapContainer>


    </div>
  );
};

export default DataFetchingComponent;
