
import './App.css';
import GalaxyScene from "./components/View";
import ControlsBar from "./components/Controls.jsx";

export default function App() {
    return (
        <div style={{ height: "100vh", width: "100vw" }}>
            <GalaxyScene />
            <ControlsBar />
        </div>
    );
}