import { Outlet } from 'react-router-dom';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="waycast pt-2">
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
