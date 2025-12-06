// src/pages/Home.jsx
import WaterData from '../components/WaterData';

function Home() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold">Water Quality Data</h1>
      <WaterData />   {/* Render WaterData, not MyComponent */}
    </div>
  );
}

export default Home;
