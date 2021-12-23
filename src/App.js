import Header from '../src/components/Header';
import Title from '../src/components/Title';
import Cards from '../src/components/Cards';
import FloatingBar from './components/FloatingBar';
import './App.css';

function App() {
	return (
		<div className='App'>
			<Header />
			<Title />
			<Cards />
			<FloatingBar />
		</div>
	);
}

export default App;
